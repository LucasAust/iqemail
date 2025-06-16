// src/followup.js
import ExcelJS from 'exceljs';
import { sendViaSES } from './sesMailer.js';

function getEmail(cell) {
  const v = cell.value;
  if (!v) return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'object') return (v.text || v.hyperlink || '').trim();
  return String(v).trim();
}

async function sendFollowUps() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('contacts.xlsx');
  const sheet = wb.getWorksheet('Outreach');

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row          = sheet.getRow(i);
    const followStatus = (row.getCell('H').value || '').toString().toLowerCase();
    if (followStatus !== 'needed') continue;

    const to      = getEmail(row.getCell('B'));
    if (!to) continue;

    const name      = row.getCell('A').value;
    const contactor = row.getCell('F').value || '';
    const subject   = 'Following up: Opportunity from IQVentory';
    const html      = `<p>Hi ${name},</p><p>I wanted to follow up on my last email...<br><b>${contactor}</b></p>`;
    const text      = html.replace(/<[^>]+>/g, '');

    try {
      await sendViaSES(to, subject, html, text);
      row.getCell('H').value = 'yes';
      row.getCell('D').value = (parseInt(row.getCell('D').value || 0, 10) + 1);
      console.log(`Follow-up sent to ${to}, row ${i} marked yes.`);
    } catch (err) {
      console.error(`Follow-up failed for ${to}:`, err);
    }

    await wb.xlsx.writeFile('contacts.xlsx');
    await new Promise(r => setTimeout(r, 3000));
  }
}

sendFollowUps().catch(console.error);
