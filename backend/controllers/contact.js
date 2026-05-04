/**
 * Contact Controller
 * Handles submission of contact messages from users.
 */

const ApiResponseFactory = require("../patterns/factory/ApiResponseFactory");
const mailSender = require("../utils/mailSender");

exports.sendContactMessage = async (req, res) => {
  try {
    const { firstname, lastname, email, countrycode, phoneNo, message } = req.body;

    if (!firstname || !email || !message) {
      return ApiResponseFactory.badRequest(res, "First name, email, and message are required");
    }

    const fullName = `${firstname.trim()} ${lastname ? lastname.trim() : ""}`.trim();
    const phoneText = phoneNo ? `${countrycode || ""} ${phoneNo}`.trim() : "Not provided";
    const recipient = process.env.CONTACT_EMAIL || process.env.MAIL_FROM;

    if (!recipient) {
      return ApiResponseFactory.serverError(res, null, "Contact email is not configured");
    }

    const subject = `New contact message from ${fullName || email}`;
    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${fullName || "Not provided"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneText}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    `;

    await mailSender(recipient, subject, html);

    return ApiResponseFactory.success(res, {
      message: "Your message has been sent successfully. We will be in touch soon.",
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, "Error while sending contact message");
  }
};
