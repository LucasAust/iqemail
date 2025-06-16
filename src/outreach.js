// src/outreach.js
import ExcelJS from 'exceljs';
import { sendViaSES } from './sesMailer.js';

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
    if (!to) continue;  // skip rows without a valid email

    const name      = row.getCell('A').value;
    const niche     = row.getCell('E').value || '';
    const contactor = row.getCell('F').value || '';
    const role      = row.getCell('G').value || '';
    const subject   = 'Exciting Opportunity from IQVentory';

    // build HTML & text bodies...
    let html = `<p>Hello ${name},</p>`;
    html += `<p>My name is <b>${contactor}</b>, the <b>${role}</b> at IQVentory...</p>`;
    if (niche) html += `<p>We noticed you in the <b>${niche}</b> space...</p>`;
    html += `<p>Reply to book a quick call or visit <a href="https://iqventory.web.app">iqventory.web.app</a>.</p>`;
    html += `<p>Thanks,<br><b>${contactor}</b></p>`;
    const text = html.replace(/<[^>]+>/g, '');

    try {
      await sendViaSES(to, subject, html, text);
      row.getCell('C').value = 'sent';
      row.getCell('D').value = (parseInt(row.getCell('D').value || 0, 10) + 1);
      row.getCell('H').value = 'needed';
      console.log(`Outreach email sent to ${to}, row ${i} updated.`);
    } catch (err) {
      console.error(`Outreach failed for ${to}:`, err);
    }

    await wb.xlsx.writeFile('contacts.xlsx');
    await new Promise(r => setTimeout(r, 3000)); // 3s throttle
  }
}

sendOutreach().catch(console.error);
