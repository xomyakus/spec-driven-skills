# react-node — React + Node.js Backend

## When to use
Web applications with JavaScript/TypeScript full stack. Simpler setup, faster iteration.

## Project Structure

```
{{PROJECT_NAME}}/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── vite-env.d.ts
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── api/                 # API client
│   │   └── __tests__/           # Frontend unit tests
│   ├── index.html
│   ├── package.json             → see client-package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── index.ts             # Express server entry
│   │   ├── app.ts               # Express app setup (for testability)
│   │   ├── routes/              # Route handlers
│   │   ├── db/                  # Database setup + migrations
│   │   │   ├── index.ts         # PGLite initialization
│   │   │   └── migrations/      # SQL migration files
│   │   └── services/            # Business logic
│   ├── tests/                   # Backend unit tests (vitest)
│   │   └── integration/         # Integration tests (supertest)
│   ├── package.json             → see server-package.json
│   └── tsconfig.json
├── e2e/                         # Playwright E2E tests
│   └── example.spec.ts
├── data/
│   ├── pglite/                  # PGLite database files (gitignored)
│   │   └── .gitkeep
│   └── .gitkeep
├── openspec/                    # OpenSpec (created by openspec init)
├── design-system/
│   └── {{PROJECT_NAME}}/        # Design reference screenshots
├── package.json                 → see root-package.json
├── tsconfig.base.json           → see tsconfig.base.json
├── playwright.config.ts         → see playwright.config.ts
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
| Backend (Express) | 3000 |
| E2E Frontend | 5174 |
| E2E Backend | 3100 |

## Testing

| Tier | Tool | Location | Command |
|------|------|----------|---------|
| Unit (backend) | Vitest | `server/tests/` | `cd server && npx vitest run` |
| Unit (frontend) | Vitest + Testing Library | `client/src/__tests__/` | `cd client && npx vitest run` |
| Integration | Supertest | `server/tests/integration/` | `cd server && npx vitest run` |
| E2E | Playwright | `e2e/` | `npx playwright test` |

## Template Files

- `root-package.json` — root monorepo package.json
- `server-package.json` — server package.json with PGLite, Express, Vitest
- `client-package.json` — client package.json with React, Vite, Testing Library
- `tsconfig.base.json` — shared TypeScript configuration
- `playwright.config.ts` — Playwright with webServer auto-start on isolated ports
- `.gitignore` — comprehensive gitignore
