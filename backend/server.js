require('dotenv').config()
const express = require('express')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const session = require('cookie-session')
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const DB = require('./database')

const app = express()
app.use(cors())
app.use(express.json())

app.use(session({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'devsecret'],
  maxAge: 24 * 60 * 60 * 1000
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await DB.getUserById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_OAUTH_CLIENT_ID || 'CLIENT_ID',
  clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET || 'CLIENT_SECRET',
  callbackURL: process.env.GITHUB_OAUTH_CALLBACK || '/auth/github/callback'
}, async function(accessToken, refreshToken, profile, done){
  try{
    const user = await DB.findOrCreateUser({id: profile.id, username: profile.username, displayName: profile.displayName, profileUrl: profile.profileUrl})
    return done(null, user)
  }catch(err){
    return done(err)
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }))

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/')
})

app.get('/api/profile', (req, res) => {
  if(!req.user) return res.status(401).json({ error: 'not logged in' })
  res.json(req.user)
})

app.get('/api/users', async (req, res) => {
  try {
    const users = await DB.allUsers()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Could not load users' })
  }
})

// Serve frontend static build when deployed together
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
if(fs.existsSync(frontendDist)){
  app.use(express.static(frontendDist))
  app.get('*', (req,res)=>{
    res.sendFile(path.join(frontendDist,'index.html'))
  })
}

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log('Server listening on', port))
