/**
 * SINGLETON PATTERN — MailTransporter
 *
 * Creates one Nodemailer transporter for the application lifetime.
 * Also exposes a convenience send() method used by all controllers.
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

class MailTransporter {
  constructor() {
    if (MailTransporter._instance) {
      return MailTransporter._instance;
    }

    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    MailTransporter._instance = this;
    console.log('✅ Mail transporter initialized (Singleton)');
  }

  static getInstance() {
    if (!MailTransporter._instance) {
      new MailTransporter();
    }
    return MailTransporter._instance;
  }

  async send(to, subject, html) {
    const info = await this._transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, ''),
    });
    console.log('📧 Email sent:', info.response);
    return info;
  }
}

MailTransporter._instance = null;

module.exports = MailTransporter.getInstance();
