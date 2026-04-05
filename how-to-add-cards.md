# How to Add Flash Cards

---

## Where to find terms

Cards can come from any source — textbooks, documentation, lecture notes, online glossaries, or your own notes. The important thing is that you have a clear term and a concise definition.

**Common source — Google's ML Glossary** (a good reference for ML/AI decks):

| Deck | URL |
|---|---|
| Fundamentals | developers.google.com/machine-learning/glossary/fundamentals |
| Generative AI | developers.google.com/machine-learning/glossary/generative |
| Metrics | developers.google.com/machine-learning/glossary/metrics |
| Responsible AI | developers.google.com/machine-learning/glossary/responsible-ai |
| All terms | developers.google.com/machine-learning/glossary |

---

## Card format

Every card is a JavaScript object inside the `CARDS` array in the `<script>` block near the bottom of the HTML file. Each card has three fields:

```js
{
  term: "the term",
  category: "deck · subtopic",
  definition: "The definition text. Can include <strong>bold</strong> or <em>italic</em> HTML."
},
```

**`term`** — The term or concept you want to study.

**`category`** — Shown as a small tag on the front of the card. Use the format `"deck · subtopic"` to group related cards. Examples:
- `"ml fundamentals"`
- `"ml fundamentals · regularization"`
- `"history · world war ii"`
- `"programming · data structures"`

Pick category names that make sense for your subject. Subtopics are optional but useful for large decks.

**`definition`** — Keep it concise. Include the key formula, rule of thumb, or distinguishing detail. You can use `<strong>term</strong>` to bold key words inline.

---

## How to add a card

1. Open the HTML flashcard file in any text editor (VS Code, Notepad, TextEdit, etc.)
2. Search for `const CARDS = [` — the array starts there
3. Find where you want to insert the new card (alphabetical order is optional but helps readability)
4. Paste in a new card object, ending with a comma:

```js
  {
    term: "your new term",
    category: "your category",
    definition: "Your definition here."
  },
```

5. Save the file
6. Drag and drop onto Netlify to deploy

---

## Example — adding a card from Google's ML Glossary

Dropout is defined in the glossary as a regularization technique that randomly removes neurons during training to prevent co-adaptation. You'd add:

```js
  {
    term: "dropout regularization",
    category: "ml fundamentals · regularization",
    definition: "A regularization technique that randomly removes (drops out) neurons during each training iteration. Forces the network to learn redundant representations and prevents neurons from co-adapting. Only applied during training, not inference."
  },
```

Place it between the `"discrete feature"` and `"dynamic model"` cards (alphabetical order by term).

---

## Tips

- **Alphabetical order isn't required** — the app works fine regardless. It just makes the file easier to scan.
- **Shuffle is your friend** — the app has a shuffle button, so you don't need to worry about card order for studying.
- **Bold sparingly** — use `<strong>` for the one or two most important sub-terms in a definition, not for general emphasis.
- **Keep definitions short** — aim for 2–4 sentences. The card back has limited space on mobile.
- **Don't break the comma** — every card object except the very last one needs a trailing comma. If the app shows a blank screen after editing, a missing or extra comma is usually the cause. Open your browser's developer console (F12) to see the error.
