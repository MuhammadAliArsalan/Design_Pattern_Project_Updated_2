/**
 * ResetPassword Controller
 * Patterns: Repository (UserRepository), Singleton (MailTransporter), Factory (ApiResponseFactory)
 */

const crypto             = require('crypto');
const bcrypt             = require('bcrypt');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');
const userRepo           = require('../repositories/UserRepository');
const mailer             = require('../config/MailTransporter');


// ================ GENERATE RESET TOKEN ================
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // ── REPOSITORY: look up user ────────────────────────────────────
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return ApiResponseFactory.unauthorized(res, 'Email is not registered with us');
    }

    const token     = crypto.randomBytes(20).toString('hex');
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // ── REPOSITORY: persist token ───────────────────────────────────
    await userRepo.setResetToken(email, token, expiresAt);

    const resetUrl = `https://study-notion-mern-stack.netlify.app/update-password/${token}`;

    // ── SINGLETON: send email ───────────────────────────────────────
    await mailer.send(email, 'Password Reset Link', `<p>Your password reset link: <a href="${resetUrl}">${resetUrl}</a></p>`);

    return ApiResponseFactory.success(res, {
      message: 'Password reset email sent — please check your inbox',
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while generating reset token');
  }
};


// ================ RESET PASSWORD ================
exports.resetPassword = async (req, res) => {
  try {
    const token = req.body?.token || req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
    const { password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return ApiResponseFactory.badRequest(res, 'All fields are required');
    }

    if (password !== confirmPassword) {
      return ApiResponseFactory.badRequest(res, 'Passwords do not match');
    }

    // ── REPOSITORY: find user by reset token ────────────────────────
    const userDetails = await userRepo.findByResetToken(token);
    if (!userDetails) {
      return ApiResponseFactory.unauthorized(res, 'Invalid reset token');
    }

    if (userDetails.resetPasswordTokenExpires < Date.now()) {
      return ApiResponseFactory.unauthorized(res, 'Reset token has expired — please request a new one');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ── REPOSITORY: update password ─────────────────────────────────
    await userRepo.updateOne({ token }, { password: hashedPassword });

    return ApiResponseFactory.success(res, { message: 'Password reset successfully' });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while resetting password');
  }
};
