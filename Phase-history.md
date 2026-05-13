# Flashcard App — Phase History & Lessons Learned

---

## Phase 1 — Complete ✅
### Single-file flashcard web app

**What was built:**
- 126 cards covering every `#fundamentals` tagged term from the Google ML Glossary
  (developers.google.com/machine-learning/glossary/fundamentals), A–Z
- Each card has a `term`, `category`, and `definition` stored as a JS object in a `CARDS` array
- Flip animation (3D rotateY) — front shows term + category tag, back shows definition
  on dark navy surface
- Prev / Next / Shuffle navigation
- Keyboard support: `←` `→` to navigate, `Space` or `F` to flip, `S` to shuffle
- Progress bar with card count and percentage
- Mobile-friendly layout — fluid font sizes, large tap targets, max-width container
- Design: flat, minimal, IBM Plex Mono for terms, IBM Plex Sans for definitions,
  single accent blue, no gradients or shadows

**Architecture decisions:**
- `CARDS` is the source-of-truth array, never mutated at runtime
- `deck` is a separate working copy — supports shuffle without touching `CARDS`
- Discrete functions: `render()`, `flipCard()`, `navigate()`, `shuffle()`
- Category field already on every card object — filtering by category is just a `.filter()`
- No build tools, no dependencies except Google Fonts CDN

**Hosting setup:**
- Repo: `github.com/Storycodin/Flash-Cards`
- Hosted on Netlify: `flashcards-bonbon.netlify.app`
- Auto-deploys on every push to main
- File named `index.html` at repo root so Netlify serves it automatically

**Reference docs produced:**
- `how-to-add-cards.md` — instructions for adding cards manually including card format,
  category conventions, and blank-screen debugging tip

**Lessons learned:**
- Name the file `index.html` not anything else — Netlify requires this for root deploys
- GitHub defaults to `main` but older Git installs default to `master` — align these
  early to avoid merge conflicts on first push
- Keep functions small and single-purpose from the start — easier to extend in later phases

---

## Phase 2 — Complete ✅
### Multi-file refactor + category system

**What was built:**
- Refactored single `index.html` into a multi-file structure:
  ```
  /index.html
  /css/style.css
  /js/app.js
  /cards/ai/ml-fundamentals.js
  /cards/ai/generative-ai.js
  /cards/ai/metrics.js
  /cards/ai/responsible-ai.js
  ```
- Three new card decks sourced from Google ML Glossary:
  - Generative AI — 33 cards
  - Metrics — 41 cards
  - Responsible AI — 26 cards
  - Total across all decks: ~226 cards
- Category toggle UI — four buttons above the progress bar, one per category
- At least one category must always remain active
- Deck rebuilds instantly on every toggle
- All categories active by default (mix mode), one active = single category mode
- Extensibility: adding a new deck requires one new file + one line in `SOURCES`
  array in `app.js` — no other files need to change

**All Phase 1 functionality preserved:**
- Flip animation, Prev/Next/Shuffle, keyboard shortcuts, progress bar, slide transitions

**Deployment note:**
- The full folder must be deployed — not just `index.html`
- ES modules require all files to be served from the same origin
- Drag the entire project folder to Netlify, or use GitHub auto-deploy

**Lessons learned:**
- Keep the system modular — each deck is its own file, each concern (styles, logic, data)
  is its own file. This makes the codebase readable and easy to hand off between chats
- Standardize card objects across all decks — every card must have exactly
  `{ term, category, definition }` with no extra or missing fields. Inconsistent
  shapes cause subtle bugs that are hard to trace
- Register all decks in one place (`SOURCES` in `app.js`) — never scatter
  deck imports across multiple files
- Future card files should follow the path convention `/cards/[topic]/[deck-name].js`
  e.g. `/cards/languages/spanish-verbs.js` or `/cards/religions/buddhism.js`

---

## Phase 3 — Complete ✅
### Archive system + card timer

**What was built:**
- Archive button below the card — archives the current card with one click
- Archived cards are removed from the active deck immediately; button shows "Restore"
  when viewing an archived card
- "Include in deck" checkbox — toggle archived cards back into the active deck
- Expandable archived panel below the controls — lists all archived cards with their
  category and a per-card Restore button
- Archive state persists in `localStorage` under key `archived_cards` (array of term strings)
- Timer on the card front — counts up from `0:00` while reading the term,
  pauses when flipped to the definition, resumes on unflip, resets on every navigate/shuffle
- Timer is small, monospace, top-right of the card — unobtrusive

**Architecture decisions:**
- Archive identified by `term` string (not a composite key) — simple and matches roadmap spec;
  acceptable tradeoff since duplicate terms across decks are unlikely
- Archive button placed *outside* the `.scene` click zone so clicking it does not
  trigger a card flip — a layout constraint worth remembering for future card-level actions
- `rebuildActiveCards(startIndex)` accepts an optional start index so archiving a card
  jumps to the next one rather than resetting to card 1
- Timer uses `setInterval` / `clearInterval`; pause = clear interval, resume = restart it;
  no drift correction needed at this precision
- `window.toggleArchive`, `window.toggleIncludeArchived`, `window.toggleShowArchived`
  exposed for HTML `onclick` attributes, consistent with existing pattern

**Lessons learned:**
- Any button that acts on the current card must live *outside* the card scene element,
  otherwise the click bubbles up and flips the card
- Identify archived cards by a stable natural key (`term`) — avoids needing to add
  IDs to every card object or change the card file format
- Keep UI additions minimal: one button row + one collapsible panel adds the full
  feature without touching the card layout or controls bar
- `localStorage` keys to date: `archived_cards` — document these as they accumulate
  so Phase 6 (Google Sheets migration) knows exactly what to sync

---

## Standing Rules (apply to all future phases)

- `CARDS` source arrays are never mutated at runtime
- All persistent state (weights, archive, got it deck) lives in `localStorage`
  until Phase 6 migrates it to Google Sheets
- Do not redesign the UI between phases — only add what the phase spec requires
- Every new phase chat should receive: this doc, `roadmap.md`, and all current files