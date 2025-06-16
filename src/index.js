// src/index.js
import { sendViaSES } from './sesMailer.js';

async function main() {
  const contacts = [
    { email: 'ljaust7@hotmail.com', name: 'Lucas' },
    
  ];

  for (const { email, name } of contacts) {
    const subject = `Hello ${name}, from IQVentory`;
    const html = `<p>Hi ${name},</p>
                  <p>This is a test email sent via Amazon SES.</p>`;
    const text = `Hi ${name},\n\nThis is a test email sent via Amazon SES.`;

    try {
      await sendViaSES(email, subject, html, text);
    } catch (err) {
      console.error(`❌ Failed to send to ${email}:`, err);
    }
  }
}

main();
