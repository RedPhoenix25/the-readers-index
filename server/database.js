const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('REPLACE_WITH_YOUR_PASSWORD')) {
      console.warn('⚠️ MongoDB URI not set or password not replaced. Falling back to SQLite.');
      return false;
    }
    await mongoose.connect(uri);
    console.log('💎 Connected to MongoDB Atlas');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
};

// SQLite Legacy Connection
const dbPath = path.join(process.cwd(), 'server', 'database.sqlite');
let sqliteDb = null;

if (process.env.NODE_ENV !== 'production' || !process.env.MONGODB_URI) {
  try {
    const sqlite3 = require('sqlite3').verbose();
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error('SQLite Error:', err.message);
      else console.log('📁 Connected to legacy SQLite database');
    });
  } catch (err) {
    console.warn('⚠️ SQLite fallback failed to load:', err.message);
  }
}

// Export connection status and database instances
module.exports = {
  connectMongoDB,
  sqliteDb,
  mongoose
};
