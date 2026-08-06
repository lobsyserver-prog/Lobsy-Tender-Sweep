const DB = require('./database')

async function seed() {
  const user = await DB.findOrCreateUser({
    id: 'testuser1',
    username: 'tester',
    displayName: 'Test User',
    profileUrl: 'https://github.com/tester'
  })

  console.log('Seeded user:', user)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
