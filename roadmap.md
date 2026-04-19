# Flashcard App — Project Roadmap & Feature Spec

## Phase Status
- Phase 1 — ✅ Complete
- Phase 2 — ✅ Complete
- Phase 3 — Archive system
- Phase 4 — Timer + related cards
- Phase 5 — Scoring system
- Phase 6 — Google Sheets backend
- Phase 7 — Mobile polish

---

## Current State (Post Phase 2)
- 226 cards across 4 AI subcategories
- Multi-file structure: `index.html`, `css/style.css`, `js/app.js`, `cards/ai/*.js`
- Category toggle UI — mix or single category mode
- Adding a new deck requires: one new card file + one line in `SOURCES` array in `app.js`

---

## File Structure

```
/index.html
/css/style.css
/js/app.js
/cards/ai/ml-fundamentals.js
/cards/ai/generative-ai.js
/cards/ai/metrics.js
/cards/ai/responsible-ai.js
/cards/[future-topic]/[future-deck].js
```

### Card object shape (current)
```javascript
{
  term: "accuracy",
  category: "ML Fundamentals",
  definition: "The number of correct predictions divided by total predictions."
}
```

### Card object shape (after Phase 5)
```javascript
{
  term: "accuracy",
  category: "ML Fundamentals",
  definition: "The number of correct predictions divided by total predictions.",
  weight: 1,          // increases when answered incorrectly
  gotIt: false,       // true when moved to got it deck
  archived: false     // true when archived by user
}
```

---

## Phase 3 — Archive System

### Behaviour
- Every card has an `archived` field (default `false`)
- Archived cards are excluded from the active deck
- A toggle in the UI shows/hides archived cards
- Archived cards can be restored at any time
- Archiving does not delete the card from the source file

### UI
- Archive button appears on the card (visible after flip, or always visible)
- Archived cards panel — list view with restore button per card
- Toggle to include/exclude archived cards from deck

### Storage
- Archived state stored in `localStorage`
- Key: `archived_cards` — array of archived term strings
- Source card files are never modified

---

## Phase 4 — Timer + Related Cards

### Timer
- Starts when a new card is shown
- Displays time elapsed since card was shown (e.g. "0:12")
- Resets on every card navigation
- Pauses when card is flipped (optional — decide during build)
- Display: small, unobtrusive, monospace font, top corner of card

### Related Cards
- Appear after the user flips a card
- An AI call searches the entire active deck (all categories) for
  semantically related cards — not limited to same category
- If no strong semantic matches found, fall back to 3 random cards
  from the same subcategory
- Related cards are displayed as mini flip-able previews below the
  main card
- Next/Prev navigation stays connected to the main deck order —
  related cards do not affect deck position

---

## Phase 5 — Scoring System

### Card Weights
- Every card has a `weight` value (default: 1)
- Weight determines how likely a card is to appear during shuffled play
- Higher weight = appears more frequently
- Weights persist in `localStorage`

### How Did You Do — Response Options
Shown after flipping any non-got-it card:

| Response | Weight Change |
|---|---|
| Horrible | +4 |
| Ok | +2 |
| Getting it | +1 |
| Got it! | Move to got it deck |

### Got It Deck
- Cards marked "got it" are removed from the main deck
- Got it cards are stored separately in `localStorage`
- Got it cards appear in the active deck with 5% probability
- A pity card from the got it deck is guaranteed every 20 draws
  if none have appeared naturally

### Got It Card — Response Options
| Response | Action |
|---|---|
| Still got it! | Returns to got it deck |
| Didn't get it | Weight set to +12, returned to main deck |

### Reverse Pity Mechanic
- Prevents the same card from appearing too frequently
- Formula: `Math.max(1, Math.round(deckSize * 0.1))`
- A card cannot reappear until that many other cards have been shown
- Examples:
  - 100 card deck → 10 card buffer
  - 5 card deck → 1 card buffer (rounds up)

### Points (Placeholder)
- Points system to be designed — hook into scoring responses
- Suggested triggers: correct answer = +points, streak bonus,
  got it = bonus points, didn't get it = no penalty
- Full spec to be written before Phase 5 build

### Storage
- All weight and got it data stored in `localStorage`
- Keys:
  - `card_weights` — object mapping term string to weight value
  - `got_it_deck` — array of term strings
  - `archived_cards` — array of term strings (from Phase 3)
- Source card files are never modified at runtime

---

## Phase 6 — Google Sheets Backend

### Goal
- Replace `localStorage` as the persistence layer with Google Sheets
- Card definitions remain in `/cards/` JS files (source of truth for content)
- Google Sheets stores: weights, got it deck, archived cards, points

### Architecture
- Google Sheet columns: `term`, `weight`, `gotIt`, `archived`, `points`
- A Google Apps Script acts as middleware — provides a URL endpoint
  the app can POST to
- App fetches user data on load, writes back after every card response
- Offline fallback: cache last known state in `localStorage`,
  sync when connection restored

### Auth
- Google OAuth for write access
- Read access can be public if sheet is set to anyone with link

---

## Phase 7 — Mobile Polish

### Goals
- Swipe gestures: swipe right = got it, swipe left = missed it,
  swipe up = next card
- Larger tap targets throughout
- PWA support: `manifest.json` + service worker for add to home
  screen and offline support
- App icon and splash screen
- Smooth animations on all interactions

---

## Adding a New Card Deck

1. Create a new JS file in the appropriate `/cards/` subfolder:
   ```
   /cards/[topic]/[deck-name].js
   ```
2. File must export a default array of card objects:
   ```javascript
   const CARDS = [
     { term: "...", category: "...", definition: "..." },
   ];
   export default CARDS;
   ```
3. Add one entry to the `SOURCES` array in `js/app.js`
4. No other files need to be changed

### Card Generator Prompt

Use this prompt in a new chat to generate a deck:

```
I need you to generate a flashcard deck as a JavaScript file.

Output format:
const CARDS = [
  { term: "term here", category: "Category Name", definition: "Definition here." },
];
export default CARDS;

Rules:
- Definitions should be concise but complete — 1 to 3 sentences
- No markdown, HTML, or special characters inside the strings — plain text only
- Every card must have all three fields: term, category, definition
- Output only the JS file contents, nothing else

If I give you a URL, fetch the page and extract terms from it.
If I give you a topic with no source, use your training knowledge
and tell me which cards you are less confident about.

Once generated, tell me:
- How many cards were created
- Suggested file path (e.g. cards/ai/generative-ai.js)
- Any terms skipped and why

Topic: [REPLACE]
Category name: [REPLACE]
Source (optional): [REPLACE]
```
