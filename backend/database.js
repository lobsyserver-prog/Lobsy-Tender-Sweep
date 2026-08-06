const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbFile = process.env.SQLITE_FILE || path.join(__dirname, 'data.sqlite')
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err)
  }
})

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    displayName TEXT,
    profileUrl TEXT
  )`, (err) => {
    if (err) {
      console.error('Failed to create users table:', err)
    }
  })
})

const runAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err)
      resolve(this)
    })
  })

const getAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err)
      resolve(row)
    })
  })

const allAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })

module.exports = {
  findOrCreateUser: async ({id, username, displayName, profileUrl}) => {
    const row = await getAsync('SELECT * FROM users WHERE id = ?', [id])
    if (row) return row
    await runAsync('INSERT INTO users (id, username, displayName, profileUrl) VALUES (?,?,?,?)', [id, username, displayName, profileUrl])
    return getAsync('SELECT * FROM users WHERE id = ?', [id])
  },
  getUserById: async (id) => getAsync('SELECT * FROM users WHERE id = ?', [id]),
  allUsers: async () => allAsync('SELECT * FROM users', [])
}
