/**
 * link-cards.js — AI-powered card linker
 *
 * Reads card decks, sends them to Claude, and writes back linked_to fields.
 *
 * Setup (run once):
 *   cd scripts
 *   npm install
 *
 * Run:
 *   node link-cards.js
 *
 * Requires ANTHROPIC_API_KEY environment variable.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { createInterface }                                     from 'readline';
import { pathToFileURL, fileURLToPath }                       from 'url';
import { resolve, join, basename, dirname }                   from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DECKS_DIR = resolve(__dirname, '../decks');
const MODEL     = 'claude-sonnet-4-6';

// ── CLI helpers ───────────────────────────────────────────────────────────────
const rl  = createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(res => rl.question(q, res));

// ── Deck discovery ────────────────────────────────────────────────────────────
function discoverDecks() {
  const decks = {};
  for (const folder of readdirSync(DECKS_DIR)) {
    const fp = join(DECKS_DIR, folder);
    if (!statSync(fp).isDirectory()) continue;
    decks[folder] = readdirSync(fp)
      .filter(f => f.endsWith('.js'))
      .map(f => join(fp, f));
  }
  return decks;
}

// ── Card file I/O ─────────────────────────────────────────────────────────────
async function loadFile(filePath, deckName) {
  const url  = pathToFileURL(filePath).href;
  // Add cache-bust so Node re-imports if script is run multiple times
  const { default: cards } = await import(`${url}?t=${Date.now()}`);
  const content  = readFileSync(filePath, 'utf8');
  const varMatch = content.match(/^const\s+(\w+)\s*=/m);
  return { filePath, deckName, varName: varMatch?.[1] ?? 'CARDS', cards };
}

function serializeFile(varName, cards) {
  const rows = cards.map((card, i) => {
    const fields = [
      `term: ${JSON.stringify(card.term)}`,
      `category: ${JSON.stringify(card.category)}`,
      `definition: ${JSON.stringify(card.definition)}`,
    ];
    if (card.linked_to?.length) {
      fields.push(`linked_to: [${card.linked_to.map(t => JSON.stringify(t)).join(', ')}]`);
    }
    const comma = i < cards.length - 1 ? ',' : '';
    return `  { ${fields.join(', ')} }${comma}`;
  });
  return `const ${varName} = [\n${rows.join('\n')}\n];\nexport default ${varName};\n`;
}

// ── Claude linking ────────────────────────────────────────────────────────────
function buildPrompt(targetCards, scopeCards) {
  const termList  = scopeCards.map(c => JSON.stringify(c.term)).join('\n');
  const cardBlock = targetCards.map(c =>
    `Term: ${JSON.stringify(c.term)}\nDefinition: ${c.definition}`
  ).join('\n\n---\n\n');

  return `You are linking flashcard definitions. Identify meaningful relationships between cards.

Available terms you may link to (use exact strings only):
${termList}

Cards to analyse:
${cardBlock}

Return a JSON object mapping each card's term to an array of related terms.

Linking rules:
1. Link if the definition directly mentions or explains another card's term
2. Link subtypes bidirectionally — if A is a type of B, link A→B and B→A
3. Link contrast/confusion pairs bidirectionally (e.g. precision ↔ recall, overfitting ↔ underfitting)
4. Link cards that are conceptually inseparable or always taught together
5. Link prerequisites — if understanding A requires knowing B first, link A→B
6. Do not self-link a term to itself
7. Only use terms from the available terms list above — no invented terms

Return ONLY a valid JSON object. No markdown, no explanation, no commentary.
Example: {"Term A": ["Term B", "Term C"], "Term B": ["Term A"]}`;
}

async function linkFile(file, scopeCards, client) {
  const prompt   = buildPrompt(file.cards, scopeCards);
  const response = await client.messages.create({
    model:      MODEL,
    max_tokens: 8096,
    messages:   [{ role: 'user', content: prompt }],
  });

  const raw     = response.content[0].text.trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const linkMap = JSON.parse(cleaned);

  const validTerms = new Set(scopeCards.map(c => c.term));
  let changed = false;

  const updated = file.cards.map(card => {
    const suggestions = linkMap[card.term];
    if (!suggestions?.length) return card;
    const valid = [...new Set(suggestions)]
      .filter(t => validTerms.has(t) && t !== card.term);
    if (!valid.length) return card;
    changed = true;
    return { ...card, linked_to: valid };
  });

  return { ...file, cards: updated, changed };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const client = new Anthropic();
  const decks  = discoverDecks();
  const names  = Object.keys(decks);

  console.log('\nAvailable decks:');
  names.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));

  const sel = (await ask('\nWhich decks to process? (numbers comma-separated, or "all"): ')).trim();
  const selectedNames = sel.toLowerCase() === 'all'
    ? names
    : sel.split(',').map(s => names[parseInt(s.trim(), 10) - 1]).filter(Boolean);

  if (!selectedNames.length) {
    console.log('No valid decks selected. Exiting.');
    rl.close();
    return;
  }

  let crossDeck = false;
  if (selectedNames.length > 1) {
    crossDeck =
      (await ask('Allow cross-deck links between selected decks? (y/n): '))
        .trim().toLowerCase() === 'y';
  }

  rl.close();

  console.log(`\nLoading: ${selectedNames.join(', ')}`);

  const fileData = await Promise.all(
    selectedNames.flatMap(deckName =>
      decks[deckName].map(fp => loadFile(fp, deckName))
    )
  );

  const allCards = fileData.flatMap(f => f.cards);
  let totalLinked = 0;

  for (const file of fileData) {
    // Scope: cross-deck = everything selected; single-deck = same deck only
    const scopeCards = crossDeck
      ? allCards
      : fileData.filter(f => f.deckName === file.deckName).flatMap(f => f.cards);

    process.stdout.write(`  Linking ${basename(file.filePath)}... `);

    try {
      const result = await linkFile(file, scopeCards, client);
      if (result.changed) {
        writeFileSync(result.filePath, serializeFile(result.varName, result.cards), 'utf8');
        const count = result.cards.filter(c => c.linked_to?.length).length;
        totalLinked += count;
        console.log(`done — ${count} cards linked`);
      } else {
        console.log('no links found');
      }
    } catch (err) {
      console.log(`FAILED — ${err.message}`);
    }
  }

  console.log(`\nDone. ${totalLinked} cards now have links.`);
}

main().catch(err => { console.error(err); process.exit(1); });
