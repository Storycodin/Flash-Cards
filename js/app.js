// ─────────────────────────────────────────────
// app.js — Flashcards
// ─────────────────────────────────────────────

// ── Deck Registry ─────────────────────────────
import ML_FUNDAMENTALS from '../decks/ai/ml-fundamentals.js';
import GENERATIVE_AI   from '../decks/ai/generative-ai.js';
import METRICS         from '../decks/ai/metrics.js';
import RESPONSIBLE_AI  from '../decks/ai/responsible-ai.js';
import VIKING_RUNES    from '../decks/Religion/viking-runes.js';

const DECKS = [
  {
    id: 'ai',
    label: 'AI',
    categories: [
      { id: 'ml-fundamentals',  label: 'ML Fundamentals',  cards: ML_FUNDAMENTALS },
      { id: 'generative-ai',    label: 'Generative AI',    cards: GENERATIVE_AI   },
      { id: 'metrics',          label: 'Metrics',           cards: METRICS         },
      { id: 'responsible-ai',   label: 'Responsible AI',   cards: RESPONSIBLE_AI  },
    ]
  },
  {
    id: 'religion',
    label: 'Religion',
    categories: [
      { id: 'viking-runes',     label: 'Viking Runes',     cards: VIKING_RUNES    },
    ]
  },
];

// Flat lookup: term -> { card, deckKey } — built once at load, used for related card lookups
const CARD_LOOKUP = new Map();
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

// ── State ─────────────────────────────────────
let activeKeys = new Set(
  DECKS.flatMap(d => d.categories.map(c => `${d.id}/${c.id}`))
);
let activeCards  = [];
let currentIndex = 0;
let isFlipped    = false;

// ── Archive State ─────────────────────────────
let archivedTerms     = new Set(JSON.parse(localStorage.getItem('archived_cards') || '[]'));
let includeArchived   = false;
let showArchivedPanel = false;

// ── Weighted Pool State ───────────────────────
let wrongCounts     = new Map(
  Object.entries(JSON.parse(localStorage.getItem('wrong_counts') || '{}'))
    .map(([k, v]) => [k, Number(v)])
);
let seenThisSession = new Set();
let recentlySeen    = [];        // last 10 terms seen, for connection bonus
let addedQueue      = new Set(); // terms manually queued via addAsNext
let judgedThisCard  = false;

function saveArchived() {
  localStorage.setItem('archived_cards', JSON.stringify([...archivedTerms]));
}

function toggleArchive() {
  if (activeCards.length === 0) return;
  const term = activeCards[currentIndex].term;
  if (archivedTerms.has(term)) {
    archivedTerms.delete(term);
  } else {
    archivedTerms.add(term);
  }
  saveArchived();
  updateArchivedCount();
  buildArchivedPanel();
  if (!includeArchived) {
    const savedIndex = Math.min(currentIndex, Math.max(0, activeCards.length - 2));
    rebuildActiveCards(savedIndex);
  } else {
    updateArchiveBtn();
  }
}

function restoreCard(term) {
  archivedTerms.delete(term);
  saveArchived();
  updateArchivedCount();
  buildArchivedPanel();
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
  document.getElementById('archived-count').textContent = archivedTerms.size;
}

function updateArchiveBtn() {
  if (activeCards.length === 0) return;
  const term = activeCards[currentIndex]?.term;
  const btn  = document.getElementById('btn-archive');
  if (!btn || term === undefined) return;
  const isArch = archivedTerms.has(term);
  btn.textContent = isArch ? 'Restore' : 'Archive';
  btn.classList.toggle('archived', isArch);
}

function buildArchivedPanel() {
  const list = document.getElementById('archived-list');
  list.innerHTML = '';

  if (archivedTerms.size === 0) {
    const empty = document.createElement('p');
    empty.className = 'archived-empty';
    empty.textContent = 'No archived cards.';
    list.appendChild(empty);
    return;
  }

  const allCards = DECKS.flatMap(d => d.categories.flatMap(c => c.cards));
  archivedTerms.forEach(term => {
    const card = allCards.find(c => c.term === term);
    if (!card) return;

    const row = document.createElement('div');
    row.className = 'archived-item';

    const termSpan = document.createElement('span');
    termSpan.className = 'archived-term';
    termSpan.textContent = card.term;

    const catSpan = document.createElement('span');
    catSpan.className = 'archived-cat';
    catSpan.textContent = card.category;

    const restoreBtn = document.createElement('button');
    restoreBtn.className = 'btn-restore';
    restoreBtn.textContent = 'Restore';
    restoreBtn.addEventListener('click', () => restoreCard(card.term));

    row.appendChild(termSpan);
    row.appendChild(catSpan);
    row.appendChild(restoreBtn);
    list.appendChild(row);
  });
}

// ── Timer ─────────────────────────────────────
let timerInterval = null;
let timerSeconds  = 0;

function startTimer() {
  clearInterval(timerInterval);
  timerSeconds = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resumeTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  document.getElementById('card-timer').textContent =
    `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Judgment & Weighted Pool ──────────────────
const JUDGMENT_LEVELS = ['horrible', 'ok', 'gettingit', 'gotit'];
const JUDGMENT_DELTA  = { horrible: 4, ok: 2, gettingit: 1 };

function saveWrongCounts() {
  localStorage.setItem('wrong_counts', JSON.stringify(Object.fromEntries(wrongCounts)));
}

function judgeCard(level) {
  if (judgedThisCard || activeCards.length === 0) return;
  judgedThisCard = true;
  updateJudgmentBtns(level);

  const term = activeCards[currentIndex].term;

  if (level === 'gotit') {
    // Archive the card and auto-advance
    archivedTerms.add(term);
    saveArchived();
    updateArchivedCount();
    buildArchivedPanel();
    updateArchiveBtn();
    recentlySeen.unshift(term);
    if (recentlySeen.length > 10) recentlySeen.pop();
    judgedThisCard = false;
    currentIndex = weightedPickIndex();
    render(1);
    return;
  }

  const delta = JUDGMENT_DELTA[level] || 0;
  if (delta > 0) {
    wrongCounts.set(term, (wrongCounts.get(term) || 0) + delta);
    saveWrongCounts();
  }
}

function updateJudgmentBtns(level) {
  JUDGMENT_LEVELS.forEach(l => {
    document.getElementById(`btn-${l}`)?.classList.add(
      l === level ? `judged-${l}` : 'judged-other'
    );
  });
}

function showJudgmentBtns() {
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
      (!archivedTerms.has(card.term) || includeArchived)
    );

  if (candidates.length === 0) return currentIndex;

  const weights = candidates.map(({ card }) => {
    let w = 1.0;
    w += (wrongCounts.get(card.term) || 0) * 3;
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

// Merge inline [[wikilinks]] with the linked_to field, deduplicated
function getLinkedTerms(card) {
  const fromDefinition = parseWikiLinks(card.definition);
  const fromField      = card.linked_to || [];
  return [...new Set([...fromDefinition, ...fromField])];
}

// ── Related Cards ─────────────────────────────
function cardPriority({ deckKey, card }) {
  const active   = activeKeys.has(deckKey);
  const archived = archivedTerms.has(card.term);
  if ( active && !archived) return 0;
  if ( active &&  archived) return 1;
  if (!active && !archived) return 2;
  return 3;
}

function showRelatedCards() {
  if (activeCards.length === 0) return;
  const linkedTerms = getLinkedTerms(activeCards[currentIndex]);
  const container   = document.getElementById('related-cards');

  if (linkedTerms.length === 0) {
    container.classList.add('hidden');
    return;
  }

  const related = linkedTerms
    .map(term => CARD_LOOKUP.get(term))
    .filter(Boolean)
    .sort((a, b) => cardPriority(a) - cardPriority(b))
    .slice(0, 5);

  if (related.length === 0) {
    container.classList.add('hidden');
    return;
  }

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
    btn.textContent = 'Already next';
    btn.disabled = true;
    return;
  }
  activeCards.splice(insertAt, 0, { ...card });
  addedQueue.add(card.term);
  btn.textContent = 'Added';
  btn.disabled = true;

  // Update progress totals to reflect the new card
  const total = activeCards.length;
  const count = currentIndex + 1;
  const pct   = Math.round((count / total) * 100);
  document.getElementById('progress-count').textContent = `${count} / ${total}`;
  document.getElementById('progress-pct').textContent   = `${pct}%`;
  document.getElementById('progress-fill').style.width  = `${pct}%`;
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
      const key = `${deck.id}/${cat.id}`;
      const catBtn = document.createElement('button');
      catBtn.className = 'cat-btn' + (activeKeys.has(key) ? ' active' : '');
      catBtn.textContent = cat.label;
      catBtn.dataset.key = key;
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

// ── Card Management ───────────────────────────
function rebuildActiveCards(startIndex = 0) {
  addedQueue.clear();
  let cards = DECKS.flatMap(deck =>
    deck.categories
      .filter(cat => activeKeys.has(`${deck.id}/${cat.id}`))
      .flatMap(cat => cat.cards)
  );
  if (!includeArchived) {
    cards = cards.filter(c => !archivedTerms.has(c.term));
  }
  activeCards  = cards;
  currentIndex = Math.min(startIndex, Math.max(0, activeCards.length - 1));
  render(0);
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

  const count = currentIndex + 1;
  const total = activeCards.length;
  const pct   = Math.round((count / total) * 100);
  document.getElementById('progress-count').textContent = `${count} / ${total}`;
  document.getElementById('progress-pct').textContent   = `${pct}%`;
  document.getElementById('progress-fill').style.width  = `${pct}%`;

  document.getElementById('btn-prev').disabled = currentIndex === 0;
  // In pool mode next is always available (pool picks from whole deck); only disable if ≤1 card
  document.getElementById('btn-next').disabled =
    addedQueue.size > 0
      ? currentIndex === activeCards.length - 1
      : activeCards.length <= 1;

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
    if (currentIndex <= 0) return;
    recentlySeen.unshift(activeCards[currentIndex].term);
    if (recentlySeen.length > 10) recentlySeen.pop();
    currentIndex--;
    render(dir);
    return;
  }

  // Forward: drain manually-queued cards first, then weighted pool
  recentlySeen.unshift(activeCards[currentIndex].term);
  if (recentlySeen.length > 10) recentlySeen.pop();

  if (addedQueue.size > 0) {
    const next = currentIndex + 1;
    if (next >= activeCards.length) return;
    const nextTerm = activeCards[next]?.term;
    if (nextTerm && addedQueue.has(nextTerm)) addedQueue.delete(nextTerm);
    currentIndex = next;
  } else {
    currentIndex = weightedPickIndex();
  }

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

  const cardEl = document.getElementById('card');
  cardEl.classList.remove('shuffle-anim');
  void cardEl.offsetWidth;
  cardEl.classList.add('shuffle-anim');

  render(0);
}

// ── Keyboard Navigation ───────────────────────
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight': navigate(1);  break;
    case 'ArrowLeft':  navigate(-1); break;
    case ' ':
    case 'f':
      e.preventDefault();
      flipCard();
      break;
    case 's':
      shuffle();
      break;
  }
});

// Expose to HTML onclick attributes
window.flipCard              = flipCard;
window.navigate              = navigate;
window.shuffle               = shuffle;
window.toggleArchive         = toggleArchive;
window.toggleIncludeArchived = toggleIncludeArchived;
window.toggleShowArchived    = toggleShowArchived;
window.judgeCard             = judgeCard;

// ── Init ──────────────────────────────────────
buildDeckSelector();
updateArchivedCount();
buildArchivedPanel();
rebuildActiveCards();
