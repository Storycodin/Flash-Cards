// ─────────────────────────────────────────────
// DECK REGISTRY
// To add a new deck:
//   1. Create cards/<category>/<deck-name>.js that assigns window.CARDS
//   2. In the deck's HTML, load that file before this script
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let activeCategory = null;   // null = All
let deck = [...CARDS];       // Current ordered deck (shuffled or original)
let currentIndex = 0;
let isFlipped = false;

// ─────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────
function render(slideDir) {
  const card = deck[currentIndex];

  document.getElementById('card-term').textContent = card.term;
  document.getElementById('card-category').textContent = card.category;
  document.getElementById('card-definition').innerHTML = card.definition;

  // Progress
  const count = currentIndex + 1;
  const total = deck.length;
  const pct = Math.round((count / total) * 100);
  document.getElementById('progress-count').textContent = `${count} / ${total}`;
  document.getElementById('progress-pct').textContent = `${pct}%`;
  document.getElementById('progress-fill').style.width = `${pct}%`;

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
  // Fisher-Yates shuffle
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

// ─────────────────────────────────────────────
// KEYBOARD NAVIGATION
// ─────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight': navigate(1); break;
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

// ─────────────────────────────────────────────
// FILTER
// ─────────────────────────────────────────────
function buildFilterBar() {
  const categories = ['All', ...new Set(CARDS.map(c => c.category).sort())];
  const bar = document.getElementById('filter-bar');
  bar.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === 'All' && activeCategory === null ? ' active' : cat === activeCategory ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => filterDeck(cat === 'All' ? null : cat));
    bar.appendChild(btn);
  });
}

function filterDeck(category) {
  activeCategory = category;
  deck = category === null ? [...CARDS] : CARDS.filter(c => c.category === category);
  currentIndex = 0;
  buildFilterBar();
  render(0);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
buildFilterBar();
render(0);
