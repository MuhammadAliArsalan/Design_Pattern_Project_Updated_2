/**
 * STRATEGY PATTERN — TokenExtractionStrategy
 *
 * Defines a family of interchangeable algorithms for extracting a JWT
 * from an HTTP request.  The auth middleware picks whichever strategy
 * succeeds first, without knowing (or caring) how each one works.
 *
 * Adding a new source (e.g. query-string) = adding one strategy here.
 * The middleware stays untouched.
 */

// ── Individual strategies ────────────────────────────────────────────

const fromBody = (req) => req.body?.token || null;

const fromCookie = (req) => req.cookies?.token || null;

const fromHeader = (req) => {
  const auth = req.header('Authorization');
  if (!auth) return null;
  return auth.startsWith('Bearer ') ? auth.replace('Bearer ', '') : auth;
};

// ── Context: tries strategies in priority order ──────────────────────

class TokenExtractionStrategy {
  /**
   * @param {Function[]} strategies  ordered list of extractor functions
   */
  constructor(strategies = [fromHeader, fromCookie, fromBody]) {
    this._strategies = strategies;
  }

  /**
   * Returns the first non-null token found, or null if all strategies fail.
   * @param {import('express').Request} req
   * @returns {string|null}
   */
  extract(req) {
    for (const strategy of this._strategies) {
      const token = strategy(req);
      if (token) return token;
    }
    return null;
  }

  // ── Convenience factory for the default (header → cookie → body) order
  static default() {
    return new TokenExtractionStrategy([fromHeader, fromCookie, fromBody]);
  }
}

module.exports = { TokenExtractionStrategy, fromBody, fromCookie, fromHeader };
