// src/warmup.js
import ExcelJS from 'exceljs';
import { sendViaSES } from './sesMailer.js';

function getEmail(cell) {
  const v = cell.value;
  if (!v) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'object') return (v.text || v.hyperlink || '').trim();
  return String(v).trim();
}

async function warmUp() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('contacts.xlsx');
  const sheet = wb.getWorksheet('Warmup');

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    if ((row.getCell('C').value || '').toString().toLowerCase() === 'sent') continue;

    const to      = getEmail(row.getCell('B'));
    if (!to) {
      console.warn(`Row ${i} has no valid email—skipping.`);
      continue;
    }

    const subject = 'IQVentory Mailer Warm-Up';
    const html    = `<p>Hi there—this is a quick warm-up email from IQVentory!</p>`;
    const text    = `Hi there—this is a quick warm-up email from IQVentory!`;

    try {
      await sendViaSES(to, subject, html, text);
      
      console.log(`Warm-up email sent to ${to}.`);
    } catch (err) {
      console.error(`Warm-up failed for ${to}:`, err);
    }

    await wb.xlsx.writeFile('contacts.xlsx');
    await new Promise(r => setTimeout(r, 2000)); // 2s throttle
  }
}

warmUp().catch(console.error);
