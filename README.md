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
