/**
 * SINGLETON PATTERN — StripeService
 *
 * Creates one Stripe SDK instance for the entire application.
 * Prevents multiple initializations and keeps credentials in one place.
 */

const stripe = require("stripe");
require("dotenv").config();

class StripeService {
  constructor() {
    if (StripeService._instance) {
      return StripeService._instance;
    }

    this._client = new stripe(process.env.STRIPE_SECRET_KEY);

    StripeService._instance = this;
    console.log("✅ Stripe initialized (Singleton)");
  }

  static getInstance() {
    if (!StripeService._instance) {
      new StripeService();
    }
    return StripeService._instance;
  }

  /**
   * Create a Payment Intent
   * @param {number} amount - Amount in cents (e.g., 2000 for $20.00)
   * @param {string} currency - Currency code (e.g., 'usd', 'inr')
   * @param {object} metadata - Additional metadata
   * @returns {Promise<Object>} PaymentIntent object
   */
  async createPaymentIntent(amount, currency = "usd", metadata = {}) {
    return await this._client.paymentIntents.create({
      amount,
      currency,
      metadata,
    });
  }

  /**
   * Create a Stripe Checkout Session
   * @param {Array} lineItems - Stripe line items
   * @param {object} options - Success/cancel URLs and metadata
   * @returns {Promise<Object>} Checkout Session object
   */
  async createCheckoutSession(lineItems, options = {}) {
    return await this._client.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      metadata: options.metadata || {},
    });
  }

  /**
   * Retrieve Payment Intent
   * @param {string} paymentIntentId
   * @returns {Promise<Object>} PaymentIntent object
   */
  async retrievePaymentIntent(paymentIntentId) {
    return await this._client.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Retrieve Stripe Checkout Session
   * @param {string} sessionId
   * @returns {Promise<Object>} Checkout Session object
   */
  async retrieveCheckoutSession(sessionId) {
    return await this._client.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
  }

  /**
   * Confirm Payment Intent
   * @param {string} paymentIntentId
   * @param {string} paymentMethodId
   * @returns {Promise<Object>} Confirmed PaymentIntent
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    return await this._client.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
  }

  /**
   * Construct event from webhook
   * @param {string} body - Raw request body
   * @param {string} signature - Stripe signature header
   * @returns {Object} Stripe event
   */
  constructEvent(body, signature) {
    return this._client.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }

  get client() {
    return this._client;
  }
}

StripeService._instance = null;

module.exports = StripeService.getInstance();
