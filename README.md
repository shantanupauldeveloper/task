# To-Do List (MERN)

Mobile-first to-do app: tasks grouped by week (Mon–Sun) with open/completed counts, create/edit/delete, status toggle, swipe-left to delete, and keyword search.

- `backend/` — Express + Mongoose REST API (`/api/tasks`, `?q=` search)
- `frontend/` — React (Vite) + Tailwind

## Run locally
```bash
cd backend && npm install && npm start      # :5001, uses in-memory MongoDB if MONGODB_URI is unset
cd frontend && npm install && npm run dev   # :5173, proxies /api to :5001
```

## API
| Method | Path | |
|---|---|---|
| GET | `/api/tasks?q=` | list / search title+description |
| POST | `/api/tasks` | `title`*, `dueAt`*, `description`, `priority` (Low/Medium/High) |
| PUT | `/api/tasks/:id` | partial update, incl. `status` (In Progress/Completed) |
| DELETE | `/api/tasks/:id` | |

## Deploy (everything on Netlify)
The API runs as a Netlify Function (`netlify/functions/api.mjs`, wrapping the Express app) and `/api/*` is redirected to it, so frontend and backend share one site and one URL. `netlify.toml` has all the config.

1. Create a free MongoDB Atlas cluster, add a database user, and allow network access from `0.0.0.0/0` (Netlify IPs vary). Copy the connection string.
2. Push this repo to GitHub, then on Netlify: **Add new site → Import from Git** (no settings to change; they come from `netlify.toml`).
3. Site settings → Environment variables: add `MONGODB_URI` = your Atlas string. Redeploy.

Leave `VITE_API_URL` unset in production (the frontend calls `/api` on the same domain).

Note: the Figma file needed sign-in, so the UI was built from the written spec rather than pixel-matched to it.
