import axios from 'axios'

const loginBtn = document.getElementById('login')
const profilePre = document.getElementById('profile')

loginBtn.addEventListener('click', () => {
  // Redirect to backend OAuth route
  window.location.href = '/auth/github'
})

// Try to load profile if already logged in
async function loadProfile(){
  try{
    const res = await axios.get('/api/profile')
    profilePre.textContent = JSON.stringify(res.data, null, 2)
  }catch(e){
    profilePre.textContent = 'Not logged in.'
  }
}

loadProfile()
