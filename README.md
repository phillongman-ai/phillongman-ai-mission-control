# Mission Control 2.0 — React Fix

This release fixes the blank screen by:

- Adding the official Vite React plugin configuration
- Making React explicitly available in JSX modules
- Temporarily removing the manifest link that generated private-site 401 warnings

## Replace the current GitHub files

Upload all contents of this package into the existing repository and allow GitHub to replace matching files.

The most important new file is:

- `vite.config.js`

Netlify will redeploy automatically.

# Mission Control 2.0

React/Vite rebuild of Phil's Mission Control.

## Deploy to the existing GitHub repository

Replace the current repository contents with this project's contents, preserving the repository itself.

Netlify should detect:
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

The included `netlify.toml` sets these automatically.

## Existing environment variables

Keep:
- SITE_URL
- APP_SECRET

Add later:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- STRAVA_CLIENT_ID
- STRAVA_CLIENT_SECRET

## Local development

```bash
npm install
npm run dev
```
