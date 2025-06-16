// src/outreach.js

import ExcelJS from 'exceljs';
import { sendViaSES } from './sesMailer.js';
import { templates } from './templates.js';

/**
 * Safely extract a string email from an ExcelJS Cell
 */
function getEmail(cell) {
  const v = cell.value;
  if (!v) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'object') return (v.text || v.hyperlink || '').trim();
  return String(v).trim();
}

async function sendOutreach() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('contacts.xlsx');
  const sheet = wb.getWorksheet('Outreach');

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row    = sheet.getRow(i);
    const status = (row.getCell('C').value || '').toString().toLowerCase();
    if (status !== 'not yet') continue;

    const to        = getEmail(row.getCell('B'));
    if (!to) {
      console.warn(`Row ${i}: no valid email, skipping.`);
      continue;
    }

    const name      = row.getCell('A').value || '';
    const niche     = (row.getCell('E').value || '').toString();
    const contactor = (row.getCell('F').value || '').toString();
    const role      = (row.getCell('G').value || '').toString();
    const campaign  = (row.getCell('I').value || '').toString().toLowerCase();

    const tpl = templates[campaign];
    if (!tpl) {
      console.warn(`Row ${i}: unknown campaign "${campaign}", skipping.`);
      continue;
    }

    // Build subject, html and text via the selected template
    const subject = tpl.subject;
    const { html, text } = tpl.build({ name, niche, contactor, role });

    try {
      await sendViaSES(to, subject, html, text);

      // mark initial outreach as sent
      row.getCell('C').value = 'sent';
      // increment NumSent
      const prev = parseInt(row.getCell('D').value || 0, 10);
      row.getCell('D').value = prev + 1;
      // flag follow-up needed
      row.getCell('H').value = 'needed';

      console.log(`Row ${i}: Outreach sent to ${to}`);
    } catch (err) {
      console.error(`Row ${i}: Outreach failed for ${to}:`, err);
    }

    // write back to file and throttle next send
    await wb.xlsx.writeFile('contacts.xlsx');
    await new Promise(res => setTimeout(res, 3000)); // 3s pause
  }
}

sendOutreach().catch(console.error);
