/**
 * apply-links.js — Step 3 of the agent linking workflow
 *
 * Reads link suggestions written by the Claude Code agent,
 * validates them against the known card pool, and writes
 * linked_to fields back to the card files.
 *
 * Usage:
 *   node scripts/apply-links.js
 *
 * Reads:
 *   scripts/.workspace/cards.json       (written by prepare-links.js)
 *   scripts/.workspace/suggestions.json (written by Claude Code agent)
 *
 * suggestions.json format:
 *   { "Term Name": ["Linked Term A", "Linked Term B"], ... }
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath }               from 'url';
import { resolve, basename, dirname }  from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = resolve(__dirname, '.workspace');

function readJSON(filename) {
  try {
    return JSON.parse(readFileSync(resolve(WORKSPACE, filename), 'utf8'));
  } catch {
    console.error(`Could not read .workspace/${filename}`);
    console.error(filename === 'cards.json'
      ? 'Run prepare-links.js first.'
      : 'Claude Code agent needs to write suggestions.json first.');
    process.exit(1);
  }
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

function main() {
  const workspace   = readJSON('cards.json');
  const suggestions = readJSON('suggestions.json');

  const validTerms = new Set(workspace.allTerms);
  let totalLinked  = 0;
  let totalSkipped = 0;

  for (const file of workspace.files) {
    let changed = false;

    const updated = file.cards.map(card => {
      const links = suggestions[card.term];
      if (!links?.length) return card;

      const valid   = [...new Set(links)].filter(t => validTerms.has(t) && t !== card.term);
      const invalid = links.filter(t => !validTerms.has(t));

      if (invalid.length) {
        console.warn(`  Skipped invalid terms for "${card.term}": ${invalid.join(', ')}`);
        totalSkipped += invalid.length;
      }

      if (!valid.length) return card;
      changed = true;
      return { ...card, linked_to: valid };
    });

    if (changed) {
      writeFileSync(file.filePath, serializeFile(file.varName, updated), 'utf8');
      const count = updated.filter(c => c.linked_to?.length).length;
      totalLinked += count;
      console.log(`Updated: ${basename(file.filePath)} — ${count} cards linked`);
    } else {
      console.log(`No changes: ${basename(file.filePath)}`);
    }
  }

  console.log(`\nDone. ${totalLinked} cards linked.`);
  if (totalSkipped) console.log(`${totalSkipped} invalid term references skipped.`);
}

main();
