---
name: sdx-project-kickoff
description: |
  Initialize a new spec-driven project from a concept document. Sets up the repository structure, 
  OpenSpec configuration, tech stack scaffolding, testing infrastructure, agent configs, and creates 
  the initial set of OpenSpec changes based on the concept.
---

# SDX Project Kickoff

Initialize a fully configured, spec-driven project repository from a concept document and a chosen tech stack.

---

## Inputs

The user MUST provide:
1. **Concept document** — a markdown file describing the project (what it does, core features, architecture ideas). Can be an existing file path or inline content.
2. **Tech stack** — one of: `react-node`, `react-rust` (see `references/stacks/` for details).
3. **Project name** — short kebab-case name used for directory, package name, and references.

Optional:
- **Project description** — one-line summary (defaults to first heading from concept).
- **Target directory** — where to create the project (defaults to `~/dev/<project-name>`).

If the user hasn't specified these, ask for them before proceeding.

---

## Steps

### 1. Validate Inputs

- Confirm the concept document exists and is readable.
- Confirm the tech stack is one of: `react-node`, `react-rust`.
- Confirm the target directory doesn't already contain a git repo (warn if it does).
- Read the stack's README at `references/stacks/<stack>/README.md` for structure reference.

### 2. Initialize Repository

```bash
mkdir -p <target-directory>
cd <target-directory>
git init
```

### 3. Create Project Structure

Read `references/stacks/<stack>/README.md` for the exact directory tree.

Create all directories listed in the structure. Create `.gitkeep` files in empty directories that need to be tracked (e.g., `data/pglite/.gitkeep`, `crates/.gitkeep`).

### 4. Copy & Adapt Template Files

For each template file in `references/stacks/<stack>/`:
1. Read the template file
2. Replace all `{{PLACEHOLDER}}` values:
   - `{{PROJECT_NAME}}` — the project name (kebab-case)
   - `{{PROJECT_DESCRIPTION}}` — one-line description
3. Write the adapted file to the correct location in the target project

Also copy common files from `references/common/`:
- `mcp.json` → `.mcp.json`
- `AGENTS.md` → `AGENTS.md`

### 5. Generate OpenSpec Config

Read the OpenSpec config template at `references/stacks/<stack>/openspec-config.yaml`.

Replace placeholders:
- `{{PROJECT_NAME}}` — project name
- `{{PROJECT_DESCRIPTION}}` — one-line description
- `{{CONCEPT_SUMMARY}}` — 2-3 sentence summary derived from the concept document
- `{{ARCHITECTURE_SUMMARY}}` — architecture description derived from the concept document

Write to `openspec/config.yaml`.

### 6. Generate CLAUDE.md

Read the CLAUDE.md template at `references/stacks/<stack>/CLAUDE.md`.
Copy it to the project root as `CLAUDE.md`.

### 7. Initialize OpenSpec

Run OpenSpec initialization to set up the project with agent tooling:

```bash
cd <target-directory>
openspec init --tools claude,antigravity
```

This creates the OpenSpec directory structure and installs agent instructions for Claude and Antigravity.

If the user requests support for additional AI tools, use `--tools all` instead (covers Cursor, Gemini, Codex, Windsurf, and others).

### 8. Copy Concept Document

Copy the concept document to `openspec/concept.md`.

### 9. Generate Roadmap

Analyze the concept document and create `openspec/roadmap.md` based on the template at `references/common/roadmap-template.md`.

**Derive from the concept:**
- Phased implementation plan (3-5 phases)
- Each phase has a milestone description
- Changes listed in dependency order
- First phase focuses on foundation (project structure, data model, basic API, minimal UI)
- Use checkbox format: `- [ ] \`change-name\` — description`

### 10. Create Initial OpenSpec Changes

Based on the concept document and roadmap, create the **first phase** of OpenSpec changes using the `openspec` CLI.

**For each change in Phase 1:**

```bash
openspec new change "<change-name>"
```

Then get the artifact instructions and create the first artifact (proposal):

```bash
openspec status --change "<change-name>" --json
openspec instructions proposal --change "<change-name>" --json
```

Read the instructions JSON and create the `proposal.md` artifact for each change based on:
- The `template` field from instructions (use as structure)
- The `context` and `rules` fields (apply as constraints, do NOT copy into the file)
- The concept document for content

**The proposal.md for each change should include:**

```markdown
## Why
<Why this change is needed — derived from concept>

## What Changes
<Bullet list of what this change introduces>

## Capabilities
### New Capabilities
<List of new capabilities with short descriptions>

### Modified Capabilities
(none — for initial changes)

## Impact
<Tables, APIs, or infrastructure affected>
```

**The first phase should typically include changes like:**
1. **`foundation`** — project structure, package configs, dev tooling, health check endpoint
2. **`data-model`** — database schema, models, migrations
3. **`core-api`** — basic REST endpoints for the primary domain entity
4. **`ui-shell`** — minimal frontend with navigation skeleton
5. **First vertical feature** — one end-to-end feature slice from the concept

> **Important:** Only create the `proposal.md` artifact for each change. Do NOT create specs, design, or tasks — those will be created during implementation using `/opsx:new` or `/opsx:ff`.

### 11. Generate README

Create `README.md` with:
- Project name and description (from concept)
- Tech stack summary table
- Getting started instructions:
  - Clone / install dependencies
  - Run dev server
  - Run tests
- Project structure overview
- Link to `openspec/concept.md` for full details
- Link to `openspec/roadmap.md` for implementation plan

### 12. Generate TESTING.md

Create `TESTING.md` adapted to the stack, documenting:
- Quick reference commands (stack-specific)
- Unit test conventions and locations
- Integration test setup
- E2E test setup with Playwright
- Database strategy (PGLite for dev/test, Postgres for production)
- Environment variables for test isolation

### 13. Create Initial Commit

```bash
git add -A
git commit -m "feat: initialize <project-name> with spec-driven configuration"
```

### 14. Summary

Print a summary of what was created:
- Target directory
- Tech stack configured
- OpenSpec initialized with agent tooling
- Number of Phase 1 changes created (with names)
- Next steps:
  1. `cd <target-directory>`
  2. Install dependencies (`npm install` / `cargo build`)
  3. Start with the first change: `openspec show foundation` or use `/opsx:apply foundation`

---

## Database Strategy

All stacks use the same database strategy:
- **PGLite** for development and testing — lightweight, in-process PostgreSQL with full PG syntax
- **PostgreSQL** for production — standard Postgres server

This means all SQL, migrations, and queries use PostgreSQL syntax and are portable between PGLite and production Postgres.

---

## Important Rules

- **Read the stack README first** — `references/stacks/<stack>/README.md` has the complete structure and template file list.
- **Use `openspec` CLI for changes** — always use `openspec new change` to create changes, never manually create the directory structure.
- **Use `openspec init` for setup** — this handles all the agent instruction files across all supported AI tools.
- **Don't install dependencies** during kickoff — only create config files. Tell the user to run install commands after.
- **Concept document is king** — derive everything (architecture, data model hints, feature phases) from the concept.
- **First change should be runnable** — after implementing the `foundation` change, the user should be able to start the dev server and see something.
- **PGLite everywhere for dev/test** — never require a running PostgreSQL server for local development or testing.
- **PostgreSQL syntax always** — PGLite supports full PG syntax, so all SQL should be production-grade PostgreSQL.
- **Only create proposals** — for initial changes, only create the proposal artifact. Specs, design, and tasks are created later during implementation via the openspec workflow (`/opsx:new`, `/opsx:ff`, `/opsx:apply`).
