const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Book = require('./models/Book');
const CuratedList = require('./models/CuratedList');
const CurrentlyReading = require('./models/CurrentlyReading');
const User = require('./models/User');

const migrate = async () => {
  try {
    console.log('🚀 Starting Data Teleportation (Safe Mode)...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('💎 Connected to MongoDB');

    const dbPath = path.join(__dirname, 'database.sqlite');
    const db = new sqlite3.Database(dbPath);
    console.log('📁 Connected to legacy SQLite');

    // Promisify sqlite3 functions
    const all = (query, params = []) => new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });

    const get = (query, params = []) => new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) reject(err); else resolve(row);
      });
    });

    // 1. Migrate Books
    console.log('📖 Teleporting Books...');
    const sqliteBooks = await all('SELECT * FROM books');
    const mongoBooks = [];

    for (const b of sqliteBooks) {
      const book = await Book.create({
        title: b.title,
        author: b.author,
        cover: b.cover,
        rating: b.rating,
        genre: b.genre,
        mood: b.mood,
        review: b.review,
        quote: b.quote,
        pages: b.pages,
        year: b.year,
        featured: Boolean(b.featured)
      });
      mongoBooks.push({ oldId: b.id, newId: book._id });
    }
    console.log(`✅ ${mongoBooks.length} Books teleported.`);

    // 2. Migrate Currently Reading
    console.log('🛌 Teleporting Currently Reading...');
    const sqliteReading = await get('SELECT * FROM currently_reading WHERE id = 1');
    if (sqliteReading) {
      await CurrentlyReading.create({
        title: sqliteReading.title,
        author: sqliteReading.author,
        cover: sqliteReading.cover,
        progress: sqliteReading.progress,
        thoughts: sqliteReading.thoughts
      });
      console.log('✅ Currently Reading teleported.');
    }

    // 3. Migrate Curated Lists
    console.log('📋 Teleporting Curated Lists...');
    const sqliteLists = await all('SELECT * FROM curated_lists');
    for (const l of sqliteLists) {
      const listBooks = await all('SELECT book_id FROM list_books WHERE list_id = ?', [l.id]);
      const newBookIds = listBooks.map(lb => {
        const match = mongoBooks.find(mb => mb.oldId === lb.book_id);
        return match ? match.newId : null;
      }).filter(id => id);

      await CuratedList.create({
        title: l.title,
        description: l.description,
        icon: l.icon,
        gradient: l.gradient,
        books: newBookIds
      });
    }
    console.log(`✅ ${sqliteLists.length} Lists teleported.`);

    console.log('\n✨ ALL DATA TELEPORTED SUCCESSFULLY! ✨');
    process.exit(0);
  } catch (err) {
    console.error('❌ Teleportation Failed:', err);
    process.exit(1);
  }
};

migrate();
