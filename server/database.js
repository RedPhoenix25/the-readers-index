const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    if (process.env.NODE_ENV !== 'production') {
      // Create Books Table
      db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        cover TEXT,
        rating REAL DEFAULT 0,
        genre TEXT,
        mood TEXT,
        review TEXT,
        quote TEXT,
        pages INTEGER DEFAULT 0,
        year INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Currently Reading table (single row, updated by admin)
      db.run(`CREATE TABLE IF NOT EXISTS currently_reading (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        cover TEXT,
        progress INTEGER DEFAULT 0,
        thoughts TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Curated Lists table
      db.run(`CREATE TABLE IF NOT EXISTS curated_lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        gradient TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Newsletter subscribers table
      db.run(`CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        source TEXT DEFAULT 'Newsletter',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email, source)
      )`);

      // Junction table for curated list books
      db.run(`CREATE TABLE IF NOT EXISTS list_books (
        list_id INTEGER,
        book_id INTEGER,
        PRIMARY KEY (list_id, book_id),
        FOREIGN KEY (list_id) REFERENCES curated_lists(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )`);

      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        isAdmin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // User's personal book lists
      db.run(`CREATE TABLE IF NOT EXISTS user_books (
        user_id INTEGER,
        book_id INTEGER,
        status TEXT DEFAULT 'Want to Read', -- 'Want to Read', 'Reading', 'Read'
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, book_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )`);

      // Book Likes
      db.run(`CREATE TABLE IF NOT EXISTS book_likes (
        user_id INTEGER,
        book_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, book_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )`);

      // Book Comments
      db.run(`CREATE TABLE IF NOT EXISTS book_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        book_id INTEGER,
        content TEXT NOT NULL,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )`);
    }
  }
});

module.exports = db;
