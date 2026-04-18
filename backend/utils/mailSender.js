/**
 * mailSender — thin wrapper kept for backward-compat.
 * Real logic lives in the MailTransporter Singleton.
 */

const mailer = require('../config/MailTransporter');

const mailSender = (to, subject, html) => mailer.send(to, subject, html);

module.exports = mailSender;
