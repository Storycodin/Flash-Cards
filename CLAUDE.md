# Flash Cards — Agent Instructions

## Project overview

A flashcard web app with no build step, no frameworks, and no dependencies beyond Google Fonts. Card data lives in individual JS files under `cards/`. All styles are in `css/style.css`. All app logic is in `js/app.js`.

## File structure

```
index.html                        — App shell (HTML only, no inline CSS or JS)
css/style.css                     — All styles
js/app.js                         — All app logic + DECKS registry
decks/ai/ml-fundamentals.js       — Category: ML Fundamentals (part of AI deck)
decks/ai/generative-ai.js         — Category: Generative AI (part of AI deck)
decks/ai/metrics.js               — Category: Metrics (part of AI deck)
decks/ai/responsible-ai.js        — Category: Responsible AI (part of AI deck)
decks/Religion/viking-runes.js    — Category: Viking Runes (part of Religion deck)
old/                              — Archived previous versions (do not edit)
```

**Folder = deck. JS file = category within that deck.**

## Adding a new category to an existing deck

1. Create `decks/<deck-folder>/<category-name>.js`:
   ```js
   const MY_CATEGORY = [
     { term: "...", category: "...", definition: "..." }
   ];
   export default MY_CATEGORY;
   ```
2. In `js/app.js`, add the import and one entry to the deck's `categories` array:
   ```js
   import MY_CATEGORY from '../decks/<deck-folder>/<category-name>.js';
   // then inside the deck object in DECKS:
   { id: 'my-category', label: 'My Category', cards: MY_CATEGORY },
   ```

## Adding a new deck

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
  definition: "Definition text. Can include <strong>bold</strong> or <em>italic</em> HTML."
}
```

- No trailing comma on the last card
- Cards are kept in alphabetical order by `term` for readability

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
