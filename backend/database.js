const path = require('path')
const Database = require('better-sqlite3')

const dbFile = process.env.SQLITE_FILE || path.join(__dirname, 'data.sqlite')
const db = new Database(dbFile)

db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT,
  displayName TEXT,
  profileUrl TEXT
)`).run()

module.exports = {
  findOrCreateUser: ({id, username, displayName, profileUrl}) => {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
    if(row) return row
    db.prepare('INSERT INTO users (id, username, displayName, profileUrl) VALUES (?,?,?,?)').run(id, username, displayName, profileUrl)
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  },
  getUserById: (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id),
  allUsers: () => db.prepare('SELECT * FROM users').all()
}
