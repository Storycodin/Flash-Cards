// ─────────────────────────────────────────────
// app.js — Flashcards
// ─────────────────────────────────────────────

// ── Deck Registry ─────────────────────────────
// Folder = deck, JS file = category within that deck.
// To add a new category: import it and add to the deck's categories array.
// To add a new deck: add a new object to DECKS.
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

// ── State ─────────────────────────────────────
// Active keys are composite "deckId/categoryId" strings
let activeKeys = new Set(
  DECKS.flatMap(d => d.categories.map(c => `${d.id}/${c.id}`))
);
let activeCards = [];
let currentIndex = 0;
let isFlipped    = false;

// ── Deck Selector ─────────────────────────────
function buildDeckSelector() {
  const container = document.getElementById('category-selector');
  container.innerHTML = '';

  DECKS.forEach(deck => {
    const group = document.createElement('div');
    group.className = 'deck-group';

    // Deck header button — toggles all categories in the deck
    const deckBtn = document.createElement('button');
    deckBtn.className = 'deck-btn';
    deckBtn.textContent = deck.label;
    deckBtn.dataset.deckId = deck.id;
    syncDeckBtn(deck, deckBtn);
    deckBtn.addEventListener('click', () => toggleDeck(deck.id));
    group.appendChild(deckBtn);

    // Category pills
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
    // Don't allow deactivating the last deck
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
    if (activeKeys.size === 1) return; // keep at least one active
    activeKeys.delete(key);
  } else {
    activeKeys.add(key);
  }
  buildDeckSelector();
  rebuildActiveCards();
}

// ── Card Management ───────────────────────────
function rebuildActiveCards() {
  activeCards = DECKS.flatMap(deck =>
    deck.categories
      .filter(cat => activeKeys.has(`${deck.id}/${cat.id}`))
      .flatMap(cat => cat.cards)
  );
  currentIndex = 0;
  render(0);
}

// ── Render ────────────────────────────────────
function render(slideDir) {
  if (activeCards.length === 0) return;
  const card = activeCards[currentIndex];

  document.getElementById('card-term').textContent     = card.term;
  document.getElementById('card-category').textContent = card.category;
  document.getElementById('card-definition').innerHTML = card.definition;

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
}

// ── Card Interactions ─────────────────────────
function flipCard() {
  const cardEl = document.getElementById('card');
  isFlipped = !isFlipped;
  cardEl.classList.toggle('flipped', isFlipped);
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
  activeCards = arr;
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
window.flipCard = flipCard;
window.navigate = navigate;
window.shuffle  = shuffle;

// ── Init ──────────────────────────────────────
buildDeckSelector();
rebuildActiveCards();
