/**
 * SINGLETON PATTERN — StripeService
 *
 * Creates one Stripe SDK instance for the entire application.
 * Prevents multiple initializations and keeps credentials in one place.
 */

const Stripe = require('stripe');
require('dotenv').config();

class StripeService {
  constructor() {
    if (StripeService._instance) {
      return StripeService._instance;
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey.includes('your_stripe')) {
      console.warn('⚠️ Stripe secret key is missing or set to a placeholder. Stripe is not enabled.');
      this._client = null;
    } else {
      this._client = new Stripe(secretKey, {
        apiVersion: '2022-11-15',
      });
      console.log('✅ Stripe initialized (Singleton)');
    }

    StripeService._instance = this;
  }

  static getInstance() {
    if (!StripeService._instance) {
      new StripeService();
    }
    return StripeService._instance;
  }

  get client() {
    if (!this._client) {
      throw new Error('Stripe client is not configured. Please set STRIPE_SECRET_KEY in .env');
    }
    return this._client;
  }

  async createCheckoutSession(line_items, options) {
    return this.client.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      ...options,
    });
  }

  async retrieveCheckoutSession(sessionId) {
    return this.client.checkout.sessions.retrieve(sessionId);
  }
}

StripeService._instance = null;

module.exports = StripeService.getInstance();
