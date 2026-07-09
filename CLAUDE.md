# Flash Cards — Agent Instructions

## Project overview

A flashcard web app with no build step, no frameworks, and no dependencies beyond Google Fonts. Card data and progress are stored in **Google Sheets** (Phase 6). All styles are in `css/style.css`. All app logic is in `js/app.js`.

## File structure

```
index.html                        — App shell (HTML only, no inline CSS or JS)
css/style.css                     — All styles
js/app.js                         — All app logic; fetches cards from Google Sheets
scripts/apps-script.js            — Paste into Google Apps Script editor (API layer)
scripts/migrate-to-sheets.js      — One-time export of old JS cards to CSV
decks/                            — Legacy JS card files (no longer imported; kept as backup)
old/                              — Archived previous versions (do not edit)
```

## Adding cards — Google Sheets (current method)

Cards live in the Google Sheet. To add new cards, add rows directly in the sheet.

**Column order:** `deck` | `category` | `term` | `definition` | `linked_to` | `weight` | `archived` | `got_it`

| Column | Example | Notes |
|--------|---------|-------|
| deck | `AI` | Top-level deck name (e.g. AI, Religion) |
| category | `ML Fundamentals` | Sub-category shown in the selector |
| term | `accuracy` | The word/concept on the card front |
| definition | `The fraction of correct...` | Shown on flip; can use `<strong>` and `<em>` |
| linked_to | `precision, recall, F1` | Comma-separated related terms (optional) |
| weight | `0` | Leave as 0 for new cards |
| archived | `FALSE` | Leave as FALSE for new cards |
| got_it | `FALSE` | Leave as FALSE for new cards |

New rows are live immediately on next page load — no code changes needed.

## Card generation prompt

Use this prompt to generate batches of cards to paste into the Sheet:

```
Generate flashcard rows for Google Sheets in this exact column order:
deck, category, term, definition, linked_to, weight, archived, got_it

Rules:
- deck: the top-level deck name (e.g. "AI")
- category: the sub-category (e.g. "ML Fundamentals")
- definition: 1–3 sentences, concise but complete; may use <strong> or <em> for emphasis
- linked_to: comma-separated list of related terms from the same sheet (optional; leave blank if unsure)
- weight: always 0
- archived: always FALSE
- got_it: always FALSE
- No markdown, no extra formatting — plain values only

Output as tab-separated rows (one card per line, no header row).

Topic: [REPLACE]
Deck: [REPLACE]
Category: [REPLACE]
```

Paste the output directly into the Google Sheet starting at the next empty row.

## Legacy: Adding a new category to an existing deck (OLD — pre-Phase 6)

This method is no longer used. Cards now come from Google Sheets.
For historical reference only:

1. Create `decks/<deck-folder>/<category-name>.js`:
   ```js
   const MY_CATEGORY = [
     { term: "...", category: "...", definition: "..." }
   ];
   export default MY_CATEGORY;
   ```

## Legacy: Adding a new deck (OLD — pre-Phase 6)

This method is no longer used.

For historical reference only:
1. Create a new subfolder under `decks/` and add at least one category JS file
2. In `js/app.js`, add the import and a new object to `DECKS`:
   ```js
   import MY_CARDS from '../decks/<new-folder>/<category>.js';
   // then in DECKS:
   {
     id: 'my-deck',
     label: 'My Deck',
     categories: [
       { id: 'my-category', label: 'My Category', cards: MY_CARDS },
     ]
   },
   ```

## Card data format

```js
{
  term: "the term",
  category: "deck · subtopic",
  definition: "Definition text. Can include <strong>bold</strong> or <em>italic</em> HTML.",
  linked_to: ["Related Term", "Another Term"]   // optional — added by scripts/link-cards.js
}
```

- No trailing comma on the last card
- Cards are kept in alphabetical order by `term` for readability
- `linked_to` is optional. When present the app shows related card previews on flip.
  Run `scripts/link-cards.js` to populate it automatically.
- Inline `[[wikilinks]]` in definitions also create related card links (both sources are merged)

## Linking cards — agent workflow

Use this when asked to "link the X deck" or "add related cards to X".

**Step 1 — prepare (run this first):**
```
node scripts/prepare-links.js --decks ai
node scripts/prepare-links.js --decks all
node scripts/prepare-links.js --decks ai,religion --cross-deck
node scripts/prepare-links.js          (lists available decks)
```
No `--decks` arg → lists available decks and exits.
Writes all card data to `scripts/.workspace/cards.json`.

**Step 2 — agent generates suggestions:**
Read `scripts/.workspace/cards.json`. For each card apply the linking rules below
and write `scripts/.workspace/suggestions.json` in this format:
```json
{ "Term A": ["Term B", "Term C"], "Term B": ["Term A"] }
```
Only use terms from the `allTerms` array in cards.json. No invented terms.

**Step 3 — apply (run after writing suggestions.json):**
```
node scripts/apply-links.js
```
Validates every suggested term exists, then writes `linked_to` fields to card files.

**Linking rules:**
1. Definition directly mentions another card's term → link
2. Subtype relationship → link both directions
3. Contrast/confusion pairs (e.g. precision ↔ recall) → link both directions
4. Conceptually inseparable or always taught together → link
5. Prerequisite: understanding A requires knowing B → link A → B (one direction)

**Setup (run once, needed for prepare/apply scripts):**
```
cd scripts && npm install
```

## Conventions

- **ES modules** — card files use `export default`, `app.js` uses `import`
- **`index.html` is the app shell** — no inline CSS or JS, just `<link>` and `<script type="module">` tags
- **IBM Plex Sans + IBM Plex Mono** — fonts used throughout; keep consistent
- **CSS variables** — colours and spacing defined in `:root` in `style.css`; edit there, not inline

## Deployment

- Hosted on Netlify with auto-deploy from GitHub (`master` branch)
- Push to `master` → Netlify deploys automatically
- No build command or publish directory needed — files are served as-is
- ES modules work fine on Netlify (served over HTTP); no bundler needed

## Git commits and pushes

When asked to commit and push:

1. Stage only relevant files — never use `git add -A` blindly; check `git status` first
2. Commit message format: `Phase N - short description`
   - Use sentence case for the description
   - List key changes as bullet points in the body
   - Always append: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
3. Push to `origin master` after committing
4. Confirm the push succeeded before reporting done

Example commit:
```
Phase 4 - add right/wrong tracking

- Added correct/incorrect buttons below each card
- Score persists across shuffle and category changes
- Reset button clears score without reshuffling

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Cards, working web app | Done |
| 2 | Category filter | Done |
| 3 | Multi-file refactor + ES modules + new decks | Done |
| 4 | Right/wrong tracking + confidence slider | Planned |
| 5 | Archive — hide mastered cards | Planned |
| 6 | Mobile polish + PWA | Planned |
| 7 | Google Sheets backend | Planned |
