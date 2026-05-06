# CB Routes (Ceske Budejovice)

Static site + serverless API for route information in South Bohemia.

## Project Structure

- public/ - Static website (HTML, CSS, JS, images)
- api/ - Server-side API (Express app for Vercel + local dev)

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js + Express (serverless on Vercel)
- Data: Firebase Realtime Database
- Hosting: Vercel (static + serverless functions)

## How It Works

- The routes pages load data via `public/js/render-rutas.js`.
- `render-rutas.js` calls `leerDatos()` in `public/js/firebase-crud.js`.
- The API is served at `/api/data/:collection` and reads from Firebase RTDB.
- Admin writes use POST/PUT/DELETE with an admin token (`ADMIN_TOKEN`).

Optional: you can override the API base in the browser by defining
`window.__CB_ROUTES_API_BASE__` before `firebase-crud.js` is loaded.

## Environment Variables

Create a `.env` file locally using `.env.example` and fill in values:

- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN
- FIREBASE_DATABASE_URL
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID
- ADMIN_TOKEN
- CORS_ORIGIN (optional, comma-separated)

On Vercel, add the same variables in Project Settings -> Environment Variables.

## Local Development

1. Install dependencies

	npm install

2. Create `.env` from `.env.example` and fill your values.

3. Start the server

	npm start

4. Open http://localhost:3000

The Express server serves the static site from `public/` and the API from `/api`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add environment variables (same as `.env.example`).
4. Deploy.

Routing is defined in `vercel.json` so:

- `/` serves `public/index.html`
- `/api/*` routes to the Express API in `api/index.js`

## Admin Usage

1. Open `/login.html`.
2. Enter the `ADMIN_TOKEN` value.
3. You will be redirected to `/admin.html`.
4. Create/update/delete routes.

Note: the token is stored in localStorage for the session.

## Data Import (Firebase RTDB)

If you have a JSON export (like `cb-routes-default-rtdb-export.json`):

1. Open Firebase Console -> Realtime Database.
2. Use the Import JSON option.
3. Import at the root to create `rutas_naturales` and `rutas_urbanas`.

The public pages will render the routes immediately after the import.