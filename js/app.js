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
  const linkedTerms = parseWikiLinks(activeCards[currentIndex].definition);
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
  document.getElementById('btn-next').disabled = currentIndex === activeCards.length - 1;

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
  } else {
    resumeTimer();
    hideRelatedCards();
  }
}

function navigate(dir) {
  const next = currentIndex + dir;
  if (next < 0 || next >= activeCards.length) return;
  currentIndex = next;
  render(dir);
}

function shuffle() {
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

// ── Init ──────────────────────────────────────
buildDeckSelector();
updateArchivedCount();
buildArchivedPanel();
rebuildActiveCards();
