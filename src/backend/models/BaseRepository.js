const { db } = require('../database');
class BaseRepository {
    constructor(tableName) { this.tableName = tableName; this.db = db; }
    getById(id) { return this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id); }
    create(data) {
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(', ');
        return this.db.prepare(`INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`).run(...Object.values(data)).lastInsertRowid;
    }
}
module.exports = BaseRepository;
