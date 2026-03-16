# Project Rules

## Servers & Environments

- **Dev server** (`npm run dev`): Use for all manual testing, debugging, and browser checks.
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:3000`
- **E2E server**: Only started automatically by Playwright during `npx playwright test`. Never start or interact with E2E servers manually.
  - Frontend: `http://localhost:5174`
  - Backend: `http://localhost:3100`

## Testing

- **Always run E2E tests** (`npx playwright test`) before marking a spec as complete.
- Run backend tests with `cd server && npx vitest run`.
- Run frontend tests with `cd client && npx vitest run`.
- E2E tests use isolated ports and database — see `playwright.config.ts`.

## Database

- Uses PGLite (in-process PostgreSQL) for development and testing.
- Full PostgreSQL syntax — all SQL is production-portable.
- Database files stored in `data/pglite/` (gitignored).

## General

- Do not start separate servers for debugging. Use the already-running dev server.
- If the dev server is not running, start it with `npm run dev` from the project root.

@AGENTS.md
