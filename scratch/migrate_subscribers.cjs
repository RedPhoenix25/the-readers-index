const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../server/database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Rename existing table
  db.run("ALTER TABLE subscribers RENAME TO subscribers_old", (err) => {
    if (err) {
      console.log("Maybe table already renamed or doesn't exist. Continuing...");
    }
    
    // 2. Create new table
    db.run(`CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      source TEXT DEFAULT 'Newsletter',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(email, source)
    )`, (err) => {
      if (err) {
        console.error("Error creating new table", err);
        return;
      }
      
      // 3. Copy data
      db.run("INSERT INTO subscribers (id, email, created_at) SELECT id, email, created_at FROM subscribers_old", (err) => {
        if (err) {
          console.error("Error copying data", err);
        } else {
          console.log("Data migrated successfully.");
          
          // 4. Drop old table
          db.run("DROP TABLE subscribers_old", (err) => {
            if (err) console.error("Error dropping old table", err);
            else console.log("Old table dropped.");
          });
        }
      });
    });
  });
});
