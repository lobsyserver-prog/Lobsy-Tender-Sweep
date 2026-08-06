# Lobsy-Tender-Sweep
Tender Application 

Deployment scaffold
-------------------

This repository contains a minimal scaffold to deploy a static frontend to GitHub Pages and a backend (Express + GitHub OAuth + SQLite) that you can host on Render, Heroku, or another service.

What I added:
- `frontend/` — Vite-based static frontend (login button)
- `backend/` — Express backend with Passport GitHub OAuth and SQLite persistence
- `.github/workflows/deploy-pages.yml` — CI to build `frontend` and publish to GitHub Pages
- `CNAME` — LobsyTenderS.co.za (custom domain file)

Next steps (recommended):
1. Revoke any posted tokens immediately (do not share PATs in chat).
2. Install deps locally and test:

```bash
cd frontend && npm install
cd ../backend && npm install
```

3. Create a GitHub OAuth App for your account or org: Settings → Developer settings → OAuth Apps
	- Homepage URL: https://LobsyTenderS.co.za
	- Authorization callback URL: https://LobsyTenderS.co.za/auth/github/callback

4. Add repository secrets (Settings → Secrets → Actions):
	- `GITHUB_OAUTH_CLIENT_ID`
	- `GITHUB_OAUTH_CLIENT_SECRET`
	- `SESSION_SECRET` (random string)

5. Build & run backend locally for testing (set env vars or use a `.env` file in `backend/`):

```bash
cd backend
GITHUB_OAUTH_CLIENT_ID=... GITHUB_OAUTH_CLIENT_SECRET=... SESSION_SECRET=... node server.js
```

6. Push the branch to GitHub and let Actions build + deploy the frontend. To host the backend automatically consider Render (manual API key required) — instructions below.

If you want, I can now create a branch with these files (already added here) and give the exact commands to commit and push, or I can push from this environment if you run `gh auth login` in the terminal. Which do you prefer?

