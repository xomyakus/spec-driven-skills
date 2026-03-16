# react-rust — React Frontend + Rust Backend

## When to use
Performance-critical backends, data-intensive applications, systems programming. React SPA embedded into Rust binary via `rust-embed`.

## Project Structure

```
{{PROJECT_NAME}}/
├── frontend/                    # React frontend (Vite)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── vite-env.d.ts
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api/
│   ├── index.html
│   ├── package.json             → see frontend-package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── eslint.config.js
├── src/
│   ├── main.rs                  # Rocket server entry
│   ├── lib.rs                   # Library root
│   ├── routes/                  # API route handlers
│   │   └── mod.rs
│   ├── db/                      # Database layer
│   │   ├── mod.rs
│   │   └── migrations/          # SQL migration files
│   └── models/                  # Data models
│       └── mod.rs
├── crates/                      # Workspace crates (for larger projects)
│   └── .gitkeep
├── tests/                       # Integration + E2E tests
│   ├── common/
│   │   └── mod.rs               # Shared test utilities
│   └── e2e_basic.rs             # Basic E2E test
├── data/
│   ├── pglite/                  # Dev database (gitignored)
│   │   └── .gitkeep
│   └── .gitkeep
├── openspec/                    # OpenSpec (created by openspec init)
├── design-system/
│   └── {{PROJECT_NAME}}/        # Design reference screenshots
├── Cargo.toml                   → see Cargo.toml
├── Rocket.toml                  → see Rocket.toml
├── dev.sh                       → see dev.sh
├── .env.example                 → see .env.example
├── .gitignore                   → see .gitignore
├── .mcp.json
├── CLAUDE.md
├── AGENTS.md
├── README.md
└── TESTING.md
```

## Dev Server Ports

| Service | Port |
|---------|------|
| Frontend (Vite) | 5173 |
| Backend (Rocket) | 8000 |

## Testing

| Tier | Tool | Location | Command |
|------|------|----------|---------|
| Unit (backend) | `cargo test` | `src/`, `crates/` | `cargo test --lib --workspace` |
| Unit (frontend) | Vitest + Testing Library | `frontend/src/__tests__/` | `cd frontend && npm test` |
| Integration | reqwest | `tests/` | `cargo test --test <test-name>` |
| E2E | Playwright (optional) | `e2e/` | `npx playwright test` |

## Template Files

- `Cargo.toml` — workspace root with Rocket, sqlx, tokio, serde, rust-embed
- `Rocket.toml` — Rocket server configuration
- `frontend-package.json` — React frontend package.json
- `dev.sh` — dev startup script (runs frontend + backend concurrently)
- `.env.example` — example environment variables
- `.gitignore` — comprehensive gitignore for Rust + frontend
