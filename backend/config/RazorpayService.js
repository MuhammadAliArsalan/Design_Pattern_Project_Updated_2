/**
 * SINGLETON PATTERN — RazorpayService
 *
 * Creates one Razorpay SDK instance for the entire application.
 * Prevents multiple initializations and keeps credentials in one place.
 */

const Razorpay = require('razorpay');
require('dotenv').config();

class RazorpayService {
  constructor() {
    if (RazorpayService._instance) {
      return RazorpayService._instance;
    }

    this._client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    RazorpayService._instance = this;
    console.log('✅ Razorpay initialized (Singleton)');
  }

  static getInstance() {
    if (!RazorpayService._instance) {
      new RazorpayService();
    }
    return RazorpayService._instance;
  }

  get orders() {
    return this._client.orders;
  }

  get payments() {
    return this._client.payments;
  }
}

RazorpayService._instance = null;

module.exports = RazorpayService.getInstance();
