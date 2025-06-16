// src/sesMailer.js
import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

// 1) Bootstrap AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

// 2) Create an SES client
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// 3) Configure Nodemailer to use SES natively
const transporter = nodemailer.createTransport({
  SES: { ses, aws: AWS }
});

/**
 * Send an email via Amazon SES
 * @param {string} to       – recipient address
 * @param {string} subject  – email subject
 * @param {string} htmlBody – HTML body content
 * @param {string} textBody – plain-text fallback
 */
export async function sendViaSES(to, subject, htmlBody, textBody) {
  const info = await transporter.sendMail({
    from: `"IQVentory Outreach" <${process.env.FROM_ADDRESS}>`,
    to,
    subject,
    text: textBody,
    html: htmlBody,
  });
  console.log(`✅ Sent to ${to}: ${info.messageId}`);
}
