const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./local-db.sqlite3');

// Create a tables (if it doesn't exist)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT DEFAULT '',
        subcategory TEXT DEFAULT '',
        sector TEXT DEFAULT '',
        children INTEGER DEFAULT 0
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        name TEXT DEFAULT '',
        sector TEXT DEFAULT ''
    )
  `)
});

module.exports = db;