/**
 * SINGLETON PATTERN — Database
 *
 * Guarantees only ONE Mongoose connection is ever created for the
 * lifetime of the process.  Every module that calls getInstance()
 * gets the exact same object back.
 */

const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    if (Database._instance) {
      return Database._instance;
    }
    this._isConnected = false;
    Database._instance = this;
  }

  static getInstance() {
    if (!Database._instance) {
      new Database();
    }
    return Database._instance;
  }

  async connect() {
    if (this._isConnected) {
      console.log('📦 Database already connected (Singleton)');
      return;
    }

    try {
      await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this._isConnected = true;
      console.log('✅ Database connected successfully (Singleton)');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }
  }

  isConnected() {
    return this._isConnected;
  }
}

Database._instance = null;

module.exports = Database.getInstance();
