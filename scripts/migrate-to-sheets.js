/**
 * migrate-to-sheets.js
 *
 * Reads all current card files from decks/ and outputs a CSV ready to
 * import into Google Sheets. Run once during the Phase 6 migration.
 *
 * Usage:
 *   node scripts/migrate-to-sheets.js
 *
 * Output:
 *   scripts/.workspace/cards-for-sheets.csv
 *
 * Import into Google Sheets:
 *   File → Import → Upload the CSV → Replace current sheet
 */

import { writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';
import { resolve, join, dirname, basename } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DECKS_DIR = resolve(__dirname, '../decks');
const WORKSPACE = resolve(__dirname, '.workspace');

function deckLabel(folder) {
  return folder.length <= 3
    ? folder.toUpperCase()
    : folder.charAt(0).toUpperCase() + folder.slice(1).toLowerCase();
}

function categoryLabel(filename) {
  return basename(filename, '.js')
    .split('-')
    .map(w => w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function csvField(val) {
  const s = val === null || val === undefined ? '' : String(val);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

async function main() {
  const decks = [];
  for (const folder of readdirSync(DECKS_DIR)) {
    const fp = join(DECKS_DIR, folder);
    if (!statSync(fp).isDirectory()) continue;
    const files = readdirSync(fp).filter(f => f.endsWith('.js'));
    decks.push({ folder, files: files.map(f => join(fp, f)) });
  }

  const headers = ['deck', 'category', 'term', 'definition', 'linked_to', 'weight', 'archived', 'got_it'];
  const rows = [headers];

  for (const { folder, files } of decks) {
    const deck = deckLabel(folder);
    for (const filePath of files) {
      const { default: cards } = await import(`${pathToFileURL(filePath).href}?t=${Date.now()}`);
      const category = categoryLabel(filePath);
      for (const card of cards) {
        rows.push([
          csvField(deck),
          csvField(category),
          csvField(card.term),
          csvField(card.definition),
          csvField((card.linked_to || []).join(', ')),
          0,        // weight starts at 0 (no history)
          'FALSE',  // archived
          'FALSE',  // got_it
        ]);
      }
    }
  }

  mkdirSync(WORKSPACE, { recursive: true });
  const outPath = resolve(WORKSPACE, 'cards-for-sheets.csv');
  writeFileSync(outPath, rows.map(r => r.join(',')).join('\n'), 'utf8');

  console.log(`\nExported ${rows.length - 1} cards to:`);
  console.log(`  ${outPath}`);
  console.log('\nNext: import this CSV into your Google Sheet.');
  console.log('File → Import → Upload → Replace current sheet');
  console.log('\nColumn order: deck, category, term, definition, linked_to, weight, archived, got_it');
}

main().catch(err => { console.error(err); process.exit(1); });
