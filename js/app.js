// ─────────────────────────────────────────────
// app.js — ML Flashcards
// ─────────────────────────────────────────────

// ── Card Sources ──────────────────────────────
// To add a new category: import the array here,
// then add one entry to SOURCES. Nothing else changes.
import ML_FUNDAMENTALS from '../cards/ai/ml-fundamentals.js';
import GENERATIVE_AI   from '../cards/ai/generative-ai.js';
import METRICS         from '../cards/ai/metrics.js';
import RESPONSIBLE_AI  from '../cards/ai/responsible-ai.js';
import VIKING_RUNES    from '../cards/Religion/viking-runes.js';

const SOURCES = [
  { id: 'fundamentals',   label: 'Fundamentals',   cards: ML_FUNDAMENTALS },
  { id: 'generative-ai',  label: 'Generative AI',  cards: GENERATIVE_AI   },
  { id: 'metrics',        label: 'Metrics',         cards: METRICS         },
  { id: 'responsible-ai', label: 'Responsible AI',  cards: RESPONSIBLE_AI  },
  { id: 'viking-runes',   label: 'Viking Runes',    cards: VIKING_RUNES    },
];

// ── State ─────────────────────────────────────
let activeIds  = new Set(SOURCES.map(s => s.id)); // all on by default
let deck       = [];
let currentIndex = 0;
let isFlipped    = false;

// ── Category Selector ─────────────────────────
function buildCategorySelector() {
  const container = document.getElementById('category-selector');
  SOURCES.forEach(source => {
    const btn = document.createElement('button');
    btn.className   = 'cat-btn active';
    btn.dataset.id  = source.id;
    btn.textContent = source.label;
    btn.addEventListener('click', () => toggleCategory(source.id, btn));
    container.appendChild(btn);
  });
}

function toggleCategory(id, btn) {
  if (activeIds.has(id)) {
    // Don't allow deselecting the last active category
    if (activeIds.size === 1) return;
    activeIds.delete(id);
    btn.classList.remove('active');
  } else {
    activeIds.add(id);
    btn.classList.add('active');
  }
  rebuildDeck();
}

// ── Deck Management ───────────────────────────
function rebuildDeck() {
  // Combine cards from all active categories, preserving original order
  const combined = SOURCES
    .filter(s => activeIds.has(s.id))
    .flatMap(s => s.cards);
  deck = [...combined];
  currentIndex = 0;
  render(0);
}

// ── Render ────────────────────────────────────
function render(slideDir) {
  if (deck.length === 0) return;
  const card = deck[currentIndex];

  document.getElementById('card-term').textContent      = card.term;
  document.getElementById('card-category').textContent  = card.category;
  document.getElementById('card-definition').innerHTML  = card.definition;

  // Progress
  const count = currentIndex + 1;
  const total = deck.length;
  const pct   = Math.round((count / total) * 100);
  document.getElementById('progress-count').textContent = `${count} / ${total}`;
  document.getElementById('progress-pct').textContent   = `${pct}%`;
  document.getElementById('progress-fill').style.width  = `${pct}%`;

  // Nav buttons
  document.getElementById('btn-prev').disabled = currentIndex === 0;
  document.getElementById('btn-next').disabled = currentIndex === deck.length - 1;

  // Always show front when navigating
  const cardEl = document.getElementById('card');
  cardEl.classList.remove('flipped');
  isFlipped = false;

  // Slide animation
  if (slideDir) {
    cardEl.classList.remove('slide-right', 'slide-left');
    void cardEl.offsetWidth; // reflow
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
  if (next < 0 || next >= deck.length) return;
  currentIndex = next;
  render(dir);
}

function shuffle() {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  deck = arr;
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
window.flipCard  = flipCard;
window.navigate  = navigate;
window.shuffle   = shuffle;

// ── Init ──────────────────────────────────────
buildCategorySelector();
rebuildDeck();
