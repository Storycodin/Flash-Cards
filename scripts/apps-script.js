/**
 * apps-script.js
 *
 * Paste this entire file into your Google Apps Script editor.
 * Tools → Script editor (inside your Google Sheet)
 *
 * After pasting:
 *   Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 *   Copy the deployment URL → paste into js/app.js as SCRIPT_URL
 */

const SHEET_NAME = 'Cards';

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return respond({ error: 'Sheet "Cards" not found' });

  const [headers, ...rows] = sheet.getDataRange().getValues();
  const cards = rows
    .filter(row => row[0]) // skip empty rows
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });

  return respond(cards);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return respond({ ok: false, error: 'Sheet "Cards" not found' });

    const [headers, ...rows] = sheet.getDataRange().getValues();
    const col = name => headers.indexOf(name); // 0-based column index

    for (let i = 0; i < rows.length; i++) {
      if (String(rows[i][col('term')]).trim() !== String(payload.term).trim()) continue;

      const rowNum = i + 2; // +1 for header row, +1 for 1-based indexing
      if (payload.weight   !== undefined) sheet.getRange(rowNum, col('weight')   + 1).setValue(payload.weight);
      if (payload.archived !== undefined) sheet.getRange(rowNum, col('archived') + 1).setValue(payload.archived);
      if (payload.got_it   !== undefined) sheet.getRange(rowNum, col('got_it')   + 1).setValue(payload.got_it);

      return respond({ ok: true });
    }

    return respond({ ok: false, error: 'Term not found: ' + payload.term });
  } catch (err) {
    return respond({ ok: false, error: err.message });
  }
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
