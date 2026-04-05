# Flash Cards — Agent Instructions

## Project overview

A lightweight, single-file flashcard web app. No build step, no frameworks, no dependencies beyond Google Fonts. Each deck is a standalone HTML file. `index.html` is the home page that links to all decks.

## File structure

| File | Purpose |
|------|---------|
| `index.html` | Home page — lists all available decks |
| `ml-flashcards.html` | ML Fundamentals deck |
| `how-to-add-cards.md` | Instructions for adding cards to any deck |
| `README.md` | Project overview and roadmap |

## Card data format

Cards live in a `const CARDS = [...]` array in the `<script>` block of each deck file:

```js
{
  term: "the term",
  category: "deck · subtopic",
  definition: "Definition text. Can include <strong>bold</strong> or <em>italic</em> HTML."
},
```

## Conventions

- **One HTML file per deck** — all styles, logic, and card data live in that file
- **IBM Plex Sans + IBM Plex Mono** — the fonts used across all files; keep this consistent
- **CSS variables** — colours and spacing are defined in `:root` at the top of each file's `<style>` block; edit there, not inline
- **No trailing comma on the last card** — the JS array will break if the final card object has a comma
- Cards are kept in alphabetical order by `term` for readability, but order doesn't affect the app

## Deployment

- Hosted on Netlify with auto-deploy from GitHub
- Push to `main` → Netlify deploys automatically
- No build command or publish directory needed — files are served as-is

## Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Cards, working web app | Done |
| 2 | Categories — study all or a single category | Planned |
| 3 | Archive — hide mastered cards | Planned |
| 4 | Right/wrong tracking + confidence slider | Planned |
| 5 | Mobile polish + PWA | Planned |
| 6 | Google Sheets backend | Planned |
