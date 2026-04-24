/**
 * FACTORY PATTERN — ApiResponseFactory
 *
 * Standardises every JSON response so the shape is always consistent.
 * Controllers call factory methods instead of building response objects
 * by hand, eliminating subtle inconsistencies (typos, missing fields…).
 */

class ApiResponseFactory {
  // ── Success responses ─────────────────────────────────────────────

  static success(res, { message = 'Success', data = null, statusCode = 200 } = {}) {
    const body = { success: true, message };
    if (data !== null) body.data = data;
    return res.status(statusCode).json(body);
  }

  // ── Error responses ───────────────────────────────────────────────

  static error(res, { message = 'An error occurred', error = null, statusCode = 500 } = {}) {
    const body = { success: false, message };
    if (error) body.error = error instanceof Error ? error.message : error;
    return res.status(statusCode).json(body);
  }

  // ── Convenience shortcuts ─────────────────────────────────────────

  static notFound(res, message = 'Resource not found') {
    return ApiResponseFactory.error(res, { message, statusCode: 404 });
  }

  static unauthorized(res, message = 'Unauthorized') {
    return ApiResponseFactory.error(res, { message, statusCode: 401 });
  }

  static forbidden(res, message = 'Forbidden') {
    return ApiResponseFactory.error(res, { message, statusCode: 403 });
  }

  static badRequest(res, message = 'Bad request') {
    return ApiResponseFactory.error(res, { message, statusCode: 400 });
  }

  static serverError(res, error, message = 'Internal server error') {
    console.error(message, error);
    return ApiResponseFactory.error(res, { message, error, statusCode: 500 });
  }
}

module.exports = ApiResponseFactory;
