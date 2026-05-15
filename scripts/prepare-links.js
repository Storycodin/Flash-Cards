/**
 * prepare-links.js — Step 1 of the agent linking workflow
 *
 * Discovers decks, loads card data, and writes a workspace file
 * for the Claude Code agent to read and generate link suggestions from.
 *
 * Usage:
 *   node scripts/prepare-links.js --decks ai
 *   node scripts/prepare-links.js --decks ai,religion --cross-deck
 *   node scripts/prepare-links.js               (lists available decks and exits)
 *
 * Output: scripts/.workspace/cards.json
 * Next:   Claude Code agent reads that file and writes scripts/.workspace/suggestions.json
 *         Then run apply-links.js to write linked_to fields back to card files.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';
import { resolve, join, dirname }       from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DECKS_DIR = resolve(__dirname, '../decks');
const WORKSPACE = resolve(__dirname, '.workspace');

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

async function loadFile(filePath, deckName) {
  const { default: cards } = await import(`${pathToFileURL(filePath).href}?t=${Date.now()}`);
  const content  = readFileSync(filePath, 'utf8');
  const varMatch = content.match(/^const\s+(\w+)\s*=/m);
  return { filePath, deckName, varName: varMatch?.[1] ?? 'CARDS', cards };
}

async function main() {
  const args      = process.argv.slice(2);
  const decksFlag = args.find(a => a.startsWith('--decks='))?.slice(8)
                 ?? args[args.indexOf('--decks') + 1];
  const crossDeck = args.includes('--cross-deck');

  const decks = discoverDecks();
  const names = Object.keys(decks);

  if (!decksFlag) {
    console.log('Available decks:');
    names.forEach((n, i) => {
      const fileCount = decks[n].length;
      console.log(`  ${i + 1}. ${n}  (${fileCount} file${fileCount > 1 ? 's' : ''})`);
    });
    console.log('\nUsage:');
    console.log('  node prepare-links.js --decks ai');
    console.log('  node prepare-links.js --decks all');
    console.log('  node prepare-links.js --decks ai,religion --cross-deck');
    process.exit(0);
  }

  const selectedNames = decksFlag.toLowerCase() === 'all'
    ? names
    : decksFlag.split(',').map(s => s.trim().toLowerCase())
        .map(s => names.find(n => n.toLowerCase() === s))
        .filter(Boolean);

  if (!selectedNames.length) {
    console.error(`No matching decks found for: "${decksFlag}"`);
    console.error(`Available: ${names.join(', ')}`);
    process.exit(1);
  }

  console.log(`\nLoading: ${selectedNames.join(', ')}`);

  const fileData = await Promise.all(
    selectedNames.flatMap(deckName =>
      decks[deckName].map(fp => loadFile(fp, deckName))
    )
  );

  const allCards = fileData.flatMap(f => f.cards);

  const workspace = {
    crossDeck,
    selectedDecks: selectedNames,
    allTerms: allCards.map(c => c.term),
    files: fileData.map(f => ({
      filePath: f.filePath,
      deckName: f.deckName,
      varName:  f.varName,
      cards:    f.cards,
    })),
  };

  mkdirSync(WORKSPACE, { recursive: true });
  writeFileSync(resolve(WORKSPACE, 'cards.json'), JSON.stringify(workspace, null, 2), 'utf8');

  console.log(`\n${allCards.length} cards across ${fileData.length} file(s) written to:`);
  console.log('  scripts/.workspace/cards.json');
  console.log('\nAll available terms:');
  workspace.allTerms.forEach(t => console.log(`  - ${t}`));
}

main().catch(err => { console.error(err); process.exit(1); });
