# Project Rules

## Development

- **Run dev environment**: `./dev.sh` — starts both Rust backend and frontend dev server.
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:8000`
- Build with `cargo build` from root.

## Testing

- Unit tests: `cargo test --lib --workspace`
- Integration tests: `cargo test --test <test-name>`
- Frontend tests: `cd frontend && npm test`
- See TESTING.md for full testing guide.

## Database

- Uses embedded PostgreSQL via `postgresql_embedded` for development.
- Standard PostgreSQL for production (set `DATABASE_URL` env var).
- All SQL migrations in `src/db/migrations/`.

## General

- API routes are prefixed with `/api/`.
- Environment variables loaded from `.env` file (see `.env.example`).
- See `openspec/concept.md` for project details.

@AGENTS.md
