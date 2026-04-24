/**
 * Auth Middleware
 *
 * Patterns in use:
 *   • Strategy — TokenExtractionStrategy picks the token from
 *                whichever source it lives in (header / cookie / body)
 *   • Factory  — ApiResponseFactory for consistent error responses
 */

const jwt                     = require('jsonwebtoken');
const { TokenExtractionStrategy } = require('../patterns/strategy/TokenExtractionStrategy');
const ApiResponseFactory      = require('../patterns/factory/ApiResponseFactory');
require('dotenv').config();

// ── STRATEGY: use default priority order (header → cookie → body) ─────────
const tokenExtractor = TokenExtractionStrategy.default();


// ================ AUTH ================
exports.auth = (req, res, next) => {
  try {
    // ── STRATEGY: extract token using configured strategies ──────────
    const token = tokenExtractor.extract(req);

    if (!token) {
      return ApiResponseFactory.unauthorized(res, 'Authentication token is missing');
    }

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return ApiResponseFactory.unauthorized(res, 'Invalid or expired token');
    }

    next();
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error during authentication');
  }
};


// ── Role guards ───────────────────────────────────────────────────────────

const _requireRole = (role) => (req, res, next) => {
  try {
    if (req.user?.accountType !== role) {
      return ApiResponseFactory.forbidden(res, `This route is restricted to ${role}s only`);
    }
    next();
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, `Error checking ${role} role`);
  }
};

exports.isStudent    = _requireRole('Student');
exports.isInstructor = _requireRole('Instructor');
exports.isAdmin      = _requireRole('Admin');
