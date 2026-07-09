// ─────────────────────────────────────────────
// app.js — Flashcards
// ─────────────────────────────────────────────

// ── Config ────────────────────────────────────
// Paste your Apps Script deployment URL here after setup:
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyi4QXze7nfOx41vi-hOoaSN1eqJJF81dEifJwidGhNBmSEkguHhDvTnR4HrLCMYAaDzA/exec';

// ── Deck Registry (built from Sheets on load) ─
let DECKS = [];

const CARD_LOOKUP = new Map();

function buildCardLookup() {
  CARD_LOOKUP.clear();
  DECKS.forEach(deck => {
    deck.categories.forEach(cat => {
      const key = `${deck.id}/${cat.id}`;
      cat.cards.forEach(card => {
        if (!CARD_LOOKUP.has(card.term)) {
          CARD_LOOKUP.set(card.term, { card, deckKey: key });
        }
      });
    });
  });
}

// ── State ─────────────────────────────────────
let activeKeys   = new Set();
let activeCards  = [];
let currentIndex = 0;
let isFlipped    = false;

// ── Archive & Got It State ────────────────────
let archivedTerms     = new Set();
let gotItTerms        = new Set();
let includeArchived   = false;
let showArchivedPanel = false;

function syncCard(term, updates) {
  if (!SCRIPT_URL || SCRIPT_URL.includes('PASTE')) return;

  // Update local cache immediately so offline reloads preserve progress
  try {
    const cache = JSON.parse(localStorage.getItem('sheets_cache') || '[]');
    const row   = cache.find(r => String(r.term).trim() === String(term).trim());
    if (row) Object.assign(row, updates);
    localStorage.setItem('sheets_cache', JSON.stringify(cache));
  } catch {}

  // Fire-and-forget to Sheets
  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ term, ...updates }),
  }).catch(() => {});
}

function toggleArchive() {
  if (activeCards.length === 0) return;
  const term = activeCards[currentIndex].term;
  if (archivedTerms.has(term)) {
    archivedTerms.delete(term);
    syncCard(term, { archived: false });
  } else {
    archivedTerms.add(term);
    syncCard(term, { archived: true });
  }
  updateArchivedCount();
  buildArchivedPanel();
  updateCategoryTrackers();
  if (!includeArchived) {
    const savedIndex = Math.min(currentIndex, Math.max(0, activeCards.length - 2));
    rebuildActiveCards(savedIndex);
  } else {
    updateArchiveBtn();
  }
}

function restoreCard(term, type) {
  if (type === 'got_it') {
    gotItTerms.delete(term);
    syncCard(term, { got_it: false, weight: 0 });
  } else {
    archivedTerms.delete(term);
    syncCard(term, { archived: false });
  }
  updateArchivedCount();
  buildArchivedPanel();
  updateCategoryTrackers();
  if (!includeArchived) rebuildActiveCards();
  else updateArchiveBtn();
}

function toggleIncludeArchived() {
  includeArchived = document.getElementById('include-archived').checked;
  rebuildActiveCards();
}

function toggleShowArchived() {
  showArchivedPanel = !showArchivedPanel;
  document.getElementById('archived-list').classList.toggle('hidden', !showArchivedPanel);
  document.getElementById('archived-toggle-btn').classList.toggle('open', showArchivedPanel);
}

function updateArchivedCount() {
  document.getElementById('archived-count').textContent = archivedTerms.size + gotItTerms.size;
}

function updateArchiveBtn() {
  if (activeCards.length === 0) return;
  const term = activeCards[currentIndex]?.term;
  const btn  = document.getElementById('btn-archive');
  if (!btn || term === undefined) return;
  const isArch = archivedTerms.has(term);
  btn.textContent = isArch ? 'Remove from Tome' : 'Add to Tome';
  btn.classList.toggle('archived', isArch);
}

function buildArchivedPanel() {
  const list = document.getElementById('archived-list');
  list.innerHTML = '';

  const allCards = DECKS.flatMap(d => d.categories.flatMap(c => c.cards));
  const entries  = [
    ...[...gotItTerms].map(t  => ({ term: t, type: 'got_it'   })),
    ...[...archivedTerms].map(t => ({ term: t, type: 'archived' })),
  ];

  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'archived-empty';
    empty.textContent = 'Your Tome of Knowledge is empty.';
    list.appendChild(empty);
    return;
  }

  entries.forEach(({ term, type }) => {
    const card = allCards.find(c => c.term === term);
    if (!card) return;

    const row = document.createElement('div');
    row.className = 'archived-item';

    const termSpan = document.createElement('span');
    termSpan.className = 'archived-term';
    termSpan.textContent = card.term;

    const catSpan = document.createElement('span');
    catSpan.className = 'archived-cat';
    catSpan.textContent = type === 'got_it' ? '✓ Mastered' : card.category;

    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'btn-restore';
    restoreBtn.textContent = type === 'got_it' ? 'Un-master' : 'Remove from Tome';
    restoreBtn.addEventListener('click', () => restoreCard(card.term, type));

    row.appendChild(termSpan);
    row.appendChild(catSpan);
    row.appendChild(restoreBtn);
    list.appendChild(row);
  });
}

// ── Weighted Pool State ───────────────────────
let cardWeights     = new Map(); // term → accumulated weight delta
let seenThisSession = new Set();
let recentlySeen    = [];        // last 10 terms, for connection bonus
let addedQueue      = new Set(); // terms manually queued via addAsNext
let cardHistory     = [];        // ordered terms visited this session (browser-style history)
let historyPos       = -1;       // index into cardHistory for the currently displayed card
let judgedThisCard  = false;

// Truncate any forward history past the current position, then append a new card.
// Used whenever a genuinely new card is chosen (not a back/forward replay).
function recordNewCard(term) {
  cardHistory = cardHistory.slice(0, historyPos + 1);
  cardHistory.push(term);
  historyPos = cardHistory.length - 1;
}

const JUDGMENT_LEVELS = ['horrible', 'ok', 'gettingit', 'gotit'];
const JUDGMENT_DELTA  = { horrible: 4, ok: 2, gettingit: 1 };

function judgeCard(level) {
  if (judgedThisCard || activeCards.length === 0) return;
  judgedThisCard = true;
  updateJudgmentBtns(level);

  const term = activeCards[currentIndex].term;

  if (level === 'gotit') {
    addedQueue.clear(); // reset queue so Next works cleanly after auto-advance
    gotItTerms.add(term);
    syncCard(term, { got_it: true, weight: 0 });
    updateArchivedCount();
    buildArchivedPanel();
    updateArchiveBtn();
    updateCategoryTrackers();
    recentlySeen.unshift(term);
    if (recentlySeen.length > 10) recentlySeen.pop();
    // Remove from active deck and auto-advance
    activeCards.splice(currentIndex, 1);
    if (activeCards.length === 0) { judgedThisCard = false; render(0); return; }
    if (currentIndex >= activeCards.length) currentIndex = 0;
    judgedThisCard = false;
    currentIndex = weightedPickIndex();
    recordNewCard(activeCards[currentIndex].term);
    render(1);
    return;
  }

  const delta = JUDGMENT_DELTA[level] || 0;
  if (delta > 0) {
    const newWeight = (cardWeights.get(term) || 0) + delta;
    cardWeights.set(term, newWeight);
    syncCard(term, { weight: newWeight });
  }
}

function updateJudgmentBtns(level) {
  JUDGMENT_LEVELS.forEach(l =>
    document.getElementById(`btn-${l}`)?.classList.add(
      l === level ? `judged-${l}` : 'judged-other'
    )
  );
}

function showJudgmentBtns() {
  // Always reset button states before showing so stale selections don't carry over
  JUDGMENT_LEVELS.forEach(l =>
    document.getElementById(`btn-${l}`)?.classList.remove(`judged-${l}`, 'judged-other')
  );
  document.getElementById('judgment-row')?.classList.remove('hidden');
}

function hideJudgmentBtns() {
  const row = document.getElementById('judgment-row');
  if (!row) return;
  row.classList.add('hidden');
  JUDGMENT_LEVELS.forEach(l =>
    document.getElementById(`btn-${l}`)?.classList.remove(`judged-${l}`, 'judged-other')
  );
}

function weightedPickIndex() {
  const recentSet  = new Set(recentlySeen);
  const candidates = activeCards
    .map((card, i) => ({ card, i }))
    .filter(({ card, i }) =>
      i !== currentIndex &&
      !archivedTerms.has(card.term) &&
      !gotItTerms.has(card.term)
    );

  if (candidates.length === 0) return currentIndex;

  const weights = candidates.map(({ card }) => {
    let w = 1.0 + (cardWeights.get(card.term) || 0);
    const linked = getLinkedTerms(card);
    w += linked.filter(t => recentSet.has(t)).length * 2;
    if (seenThisSession.has(card.term)) w *= 0.2;
    return Math.max(w, 0.1);
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let k = 0; k < candidates.length; k++) {
    rand -= weights[k];
    if (rand <= 0) return candidates[k].i;
  }
  return candidates[candidates.length - 1].i;
}

// ── Progress & Trackers ───────────────────────
function updateProgress() {
  const uniqueTerms = new Set(activeCards.map(c => c.term));
  const total = uniqueTerms.size;
  const done  = [...uniqueTerms].filter(t => seenThisSession.has(t)).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('progress-count').textContent = `${done} / ${total}`;
  document.getElementById('progress-pct').textContent   = `${pct}%`;
  document.getElementById('progress-fill').style.width  = `${pct}%`;
}

function updateCategoryTrackers() {
  DECKS.forEach(deck => {
    deck.categories.forEach(cat => {
      const key = `${deck.id}/${cat.id}`;
      const btn = document.querySelector(`.cat-btn[data-key="${key}"]`);
      if (!btn) return;

      const total  = cat.cards.length;
      const active = cat.cards.filter(c => !archivedTerms.has(c.term) && !gotItTerms.has(c.term)).length;
      const wasComplete = btn.classList.contains('cat-complete');
      const isComplete  = total > 0 && active === 0;

      const countEl = btn.querySelector('.cat-count');
      if (countEl) countEl.textContent = `${active}/${total}`;

      if (isComplete && !wasComplete) {
        btn.classList.add('cat-complete', 'cat-complete-anim');
        setTimeout(() => btn.classList.remove('cat-complete-anim'), 800);
      } else if (!isComplete) {
        btn.classList.remove('cat-complete');
      }
    });
  });
}

// ── Timer ─────────────────────────────────────
let timerInterval = null;
let timerSeconds  = 0;

function startTimer() {
  clearInterval(timerInterval);
  timerSeconds = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => { timerSeconds++; updateTimerDisplay(); }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resumeTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => { timerSeconds++; updateTimerDisplay(); }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  document.getElementById('card-timer').textContent = `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Wikilinks ─────────────────────────────────
function parseWikiLinks(text) {
  const terms = [];
  const re = /\[\[([^\]]+)\]\]/g;
  let m;
  while ((m = re.exec(text)) !== null) terms.push(m[1]);
  return terms;
}

function stripWikiLinks(text) {
  return text.replace(/\[\[([^\]]+)\]\]/g, '$1');
}

function getLinkedTerms(card) {
  const fromDefinition = parseWikiLinks(card.definition || '');
  const fromField      = card.linked_to || [];
  return [...new Set([...fromDefinition, ...fromField])];
}

// ── Related Cards ─────────────────────────────
function cardPriority({ deckKey, card }) {
  const active   = activeKeys.has(deckKey);
  const archived = archivedTerms.has(card.term) || gotItTerms.has(card.term);
  if ( active && !archived) return 0;
  if ( active &&  archived) return 1;
  if (!active && !archived) return 2;
  return 3;
}

function showRelatedCards() {
  if (activeCards.length === 0) return;
  const linkedTerms = getLinkedTerms(activeCards[currentIndex]);
  const container   = document.getElementById('related-cards');

  if (linkedTerms.length === 0) { container.classList.add('hidden'); return; }

  const related = linkedTerms
    .map(term => CARD_LOOKUP.get(term))
    .filter(Boolean)
    .sort((a, b) => cardPriority(a) - cardPriority(b))
    .slice(0, 5);

  if (related.length === 0) { container.classList.add('hidden'); return; }

  container.innerHTML = '';

  const label = document.createElement('p');
  label.className = 'related-label';
  label.textContent = 'Related';
  container.appendChild(label);

  const row = document.createElement('div');
  row.className = 'related-row';

  related.forEach(({ card }) => {
    const tile = document.createElement('div');
    tile.className = 'related-tile';

    const termEl = document.createElement('div');
    termEl.className = 'related-term';
    termEl.textContent = card.term;

    const catEl = document.createElement('span');
    catEl.className = 'related-cat-tag';
    catEl.textContent = card.category;

    const btn = document.createElement('button');
    btn.className = 'btn-add-next';
    btn.textContent = 'Add as next';
    btn.addEventListener('click', () => addAsNext(card, btn));

    tile.appendChild(termEl);
    tile.appendChild(catEl);
    tile.appendChild(btn);
    row.appendChild(tile);
  });

  container.appendChild(row);
  container.classList.remove('hidden');
}

function hideRelatedCards() {
  const container = document.getElementById('related-cards');
  container.classList.add('hidden');
  container.innerHTML = '';
}

function addAsNext(card, btn) {
  const insertAt = currentIndex + 1;
  if (activeCards[insertAt]?.term === card.term) {
    btn.textContent = 'Already next'; btn.disabled = true; return;
  }
  activeCards.splice(insertAt, 0, { ...card });
  addedQueue.add(card.term);
  btn.textContent = 'Added'; btn.disabled = true;
  updateProgress();
  document.getElementById('btn-next').disabled = false;
}

// ── Deck Selector ─────────────────────────────
function buildDeckSelector() {
  const container = document.getElementById('category-selector');
  container.innerHTML = '';

  DECKS.forEach(deck => {
    const group = document.createElement('div');
    group.className = 'deck-group';

    const deckBtn = document.createElement('button');
    deckBtn.className = 'deck-btn';
    deckBtn.textContent = deck.label;
    deckBtn.dataset.deckId = deck.id;
    syncDeckBtn(deck, deckBtn);
    deckBtn.addEventListener('click', () => toggleDeck(deck.id));
    group.appendChild(deckBtn);

    const catGroup = document.createElement('div');
    catGroup.className = 'cat-group';
    deck.categories.forEach(cat => {
      const key    = `${deck.id}/${cat.id}`;
      const total  = cat.cards.length;
      const active = cat.cards.filter(c => !archivedTerms.has(c.term) && !gotItTerms.has(c.term)).length;
      const catBtn = document.createElement('button');
      catBtn.className = 'cat-btn'
        + (activeKeys.has(key)             ? ' active'       : '')
        + (total > 0 && active === 0       ? ' cat-complete' : '');
      catBtn.dataset.key = key;
      catBtn.innerHTML = `${cat.label}<span class="cat-count">${active}/${total}</span>`;
      catBtn.addEventListener('click', () => toggleCategory(key));
      catGroup.appendChild(catBtn);
    });
    group.appendChild(catGroup);
    container.appendChild(group);
  });
}

function syncDeckBtn(deck, btn) {
  const keys = deck.categories.map(c => `${deck.id}/${c.id}`);
  const activeCount = keys.filter(k => activeKeys.has(k)).length;
  btn.classList.remove('active', 'partial');
  if (activeCount === keys.length) btn.classList.add('active');
  else if (activeCount > 0)        btn.classList.add('partial');
}

function toggleDeck(deckId) {
  const deck = DECKS.find(d => d.id === deckId);
  const keys = deck.categories.map(c => `${deckId}/${c.id}`);
  const allActive = keys.every(k => activeKeys.has(k));
  if (allActive) {
    const otherActive = [...activeKeys].some(k => !k.startsWith(deckId + '/'));
    if (!otherActive) return;
    keys.forEach(k => activeKeys.delete(k));
  } else {
    keys.forEach(k => activeKeys.add(k));
  }
  buildDeckSelector();
  rebuildActiveCards();
}

function toggleCategory(key) {
  if (activeKeys.has(key)) {
    if (activeKeys.size === 1) return;
    activeKeys.delete(key);
  } else {
    activeKeys.add(key);
  }
  buildDeckSelector();
  rebuildActiveCards();
}

// ── Render ────────────────────────────────────
function render(slideDir) {
  if (activeCards.length === 0) return;
  const card = activeCards[currentIndex];

  seenThisSession.add(card.term);
  judgedThisCard = false;
  hideJudgmentBtns();

  document.getElementById('card-term').textContent     = card.term;
  document.getElementById('card-category').textContent = card.category;
  document.getElementById('card-definition').innerHTML = stripWikiLinks(card.definition);

  updateProgress();

  document.getElementById('btn-prev').disabled = historyPos <= 0;
  document.getElementById('btn-next').disabled =
    addedQueue.size > 0 ? currentIndex === activeCards.length - 1 : activeCards.length <= 1;

  const cardEl = document.getElementById('card');
  cardEl.classList.remove('flipped');
  isFlipped = false;

  if (slideDir) {
    cardEl.classList.remove('slide-right', 'slide-left');
    void cardEl.offsetWidth;
    cardEl.classList.add(slideDir === 1 ? 'slide-right' : 'slide-left');
  }

  hideRelatedCards();
  startTimer();
  updateArchiveBtn();
}

// ── Card Interactions ─────────────────────────
function flipCard() {
  const cardEl = document.getElementById('card');
  isFlipped = !isFlipped;
  cardEl.classList.toggle('flipped', isFlipped);
  if (isFlipped) {
    pauseTimer();
    showRelatedCards();
    showJudgmentBtns();
  } else {
    resumeTimer();
    hideRelatedCards();
    hideJudgmentBtns();
  }
}

function navigate(dir) {
  if (dir === -1) {
    // Walk back through history, skipping any entries no longer in the active pool
    while (historyPos > 0) {
      historyPos--;
      const idx = activeCards.findIndex(c => c.term === cardHistory[historyPos]);
      if (idx !== -1) { currentIndex = idx; render(-1); return; }
    }
    return; // nothing further back
  }

  recentlySeen.unshift(activeCards[currentIndex].term);
  if (recentlySeen.length > 10) recentlySeen.pop();

  if (addedQueue.size > 0) {
    const next = currentIndex + 1;
    if (next >= activeCards.length) return;
    const nextTerm = activeCards[next]?.term;
    if (nextTerm && addedQueue.has(nextTerm)) addedQueue.delete(nextTerm);
    currentIndex = next;
    recordNewCard(activeCards[currentIndex].term);
    render(1);
    return;
  }

  // Redo forward through history first, skipping any entries no longer in the active pool
  while (historyPos < cardHistory.length - 1) {
    historyPos++;
    const idx = activeCards.findIndex(c => c.term === cardHistory[historyPos]);
    if (idx !== -1) { currentIndex = idx; render(1); return; }
  }

  // No forward history left — pick a genuinely new card
  currentIndex = weightedPickIndex();
  recordNewCard(activeCards[currentIndex].term);
  render(1);
}

function shuffle() {
  addedQueue.clear();
  const arr = [...activeCards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  activeCards  = arr;
  currentIndex = 0;
  cardHistory  = activeCards.length ? [activeCards[0].term] : [];
  historyPos   = activeCards.length ? 0 : -1;

  const cardEl = document.getElementById('card');
  cardEl.classList.remove('shuffle-anim');
  void cardEl.offsetWidth;
  cardEl.classList.add('shuffle-anim');

  render(0);
}

function rebuildActiveCards(startIndex = 0) {
  addedQueue.clear();
  let cards = DECKS.flatMap(deck =>
    deck.categories
      .filter(cat => activeKeys.has(`${deck.id}/${cat.id}`))
      .flatMap(cat => cat.cards)
  );
  if (!includeArchived) {
    cards = cards.filter(c => !archivedTerms.has(c.term) && !gotItTerms.has(c.term));
  }
  activeCards  = cards;
  currentIndex = Math.min(startIndex, Math.max(0, activeCards.length - 1));
  cardHistory  = activeCards.length ? [activeCards[currentIndex].term] : [];
  historyPos   = activeCards.length ? 0 : -1;
  render(0);
}

// ── Keyboard ──────────────────────────────────
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight': navigate(1);  break;
    case 'ArrowLeft':  navigate(-1); break;
    case ' ': case 'f': e.preventDefault(); flipCard(); break;
    case 's': shuffle(); break;
  }
});

// ── Expose to HTML onclick attributes ─────────
window.flipCard              = flipCard;
window.navigate              = navigate;
window.shuffle               = shuffle;
window.toggleArchive         = toggleArchive;
window.toggleIncludeArchived = toggleIncludeArchived;
window.toggleShowArchived    = toggleShowArchived;
window.judgeCard             = judgeCard;

// ── Data Loading ──────────────────────────────
function buildDecksFromRows(rows) {
  const deckMap = new Map();

  for (const row of rows) {
    const deckName = String(row.deck     || 'Unknown').trim();
    const catName  = String(row.category || 'General').trim();
    const term     = String(row.term     || '').trim();
    if (!term) continue;

    if (!deckMap.has(deckName)) deckMap.set(deckName, new Map());
    const catMap = deckMap.get(deckName);
    if (!catMap.has(catName)) catMap.set(catName, []);

    const linked_to = row.linked_to
      ? String(row.linked_to).split(',').map(t => t.trim()).filter(Boolean)
      : [];

    catMap.get(catName).push({
      term,
      category:   catName,
      definition: String(row.definition || '').trim(),
      linked_to,
    });
  }

  const decks = [];
  deckMap.forEach((catMap, deckName) => {
    const categories = [];
    catMap.forEach((cards, catName) => {
      const id = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      categories.push({ id, label: catName, cards });
    });
    const deckId = deckName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    decks.push({ id: deckId, label: deckName, categories });
  });

  return decks;
}

function loadProgressFromRows(rows) {
  const weights  = new Map();
  const archived = new Set();
  const gotIt    = new Set();

  for (const row of rows) {
    const term = String(row.term || '').trim();
    if (!term) continue;

    const w = Number(row.weight) || 0;
    if (w > 0) weights.set(term, w);

    if (row.archived === true || String(row.archived).toUpperCase() === 'TRUE') archived.add(term);
    if (row.got_it   === true || String(row.got_it  ).toUpperCase() === 'TRUE') gotIt.add(term);
  }

  return { weights, archived, gotIt };
}

// ── Init ──────────────────────────────────────
async function init() {
  document.getElementById('loading-overlay')?.classList.remove('hidden');

  let rows = null;

  if (SCRIPT_URL && !SCRIPT_URL.includes('PASTE')) {
    try {
      const res = await fetch(SCRIPT_URL);
      rows = await res.json();
      localStorage.setItem('sheets_cache', JSON.stringify(rows));
    } catch {}
  }

  if (!rows) {
    try {
      const cached = localStorage.getItem('sheets_cache');
      if (cached) rows = JSON.parse(cached);
    } catch {}
  }

  if (!rows || rows.length === 0) {
    const el = document.getElementById('load-error');
    if (el) {
      el.textContent = SCRIPT_URL.includes('PASTE')
        ? 'Set your Apps Script URL in js/app.js (the SCRIPT_URL constant at the top).'
        : 'Could not load cards. Check your connection — using cached data if available.';
      el.classList.remove('hidden');
    }
    document.getElementById('loading-spinner')?.classList.add('hidden');
    return;
  }

  DECKS = buildDecksFromRows(rows);
  buildCardLookup();

  const progress = loadProgressFromRows(rows);
  cardWeights   = progress.weights;
  archivedTerms = progress.archived;
  gotItTerms    = progress.gotIt;

  activeKeys = new Set(
    DECKS.flatMap(d => d.categories.map(c => `${d.id}/${c.id}`))
  );

  document.getElementById('loading-overlay')?.classList.add('hidden');
  buildDeckSelector();
  updateArchivedCount();
  buildArchivedPanel();
  rebuildActiveCards();
}

init();
