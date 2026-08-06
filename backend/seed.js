const DB = require('./database')

const user = DB.findOrCreateUser({
  id: 'testuser1',
  username: 'tester',
  displayName: 'Test User',
  profileUrl: 'https://github.com/tester'
})

console.log('Seeded user:', user)
