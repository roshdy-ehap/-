const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../database/pos.db')
    : path.join(process.env.APPDATA, 'islam-library-pos/pos.db');

if (!fs.existsSync(path.dirname(dbPath))) { fs.mkdirSync(path.dirname(dbPath), { recursive: true }); }

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

function initializeDatabase() {
    const schema = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
    db.exec(schema);

    if (!db.prepare('SELECT id FROM users WHERE username = ?').get('admin')) {
        const bcrypt = require('bcryptjs');
        const hash = bcrypt.hashSync('admin123', 10);
        db.prepare('INSERT INTO users (username, password_hash, role, full_name) VALUES (?, ?, ?, ?)').run('admin', hash, 'admin', 'Admin');
    }
    if (!db.prepare('SELECT id FROM branches LIMIT 1').get()) {
        db.prepare('INSERT INTO branches (name, is_main) VALUES (?, ?)').run('Main Branch', 1);
    }
}

module.exports = { db, dbPath, initializeDatabase };
