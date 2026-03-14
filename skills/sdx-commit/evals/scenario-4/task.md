# Commit Two Unrelated Changes With a Full Process Log

## Problem Description

A developer working on a data pipeline made two separate improvements: they refactored how database connections are pooled (touching three files), and they updated the project's contributing guide. The changes are ready to be committed but nothing has been staged.

The team's git hygiene standards are strict: every change needs to be reviewed before it lands in history, and they want the commit process to be documented for audit purposes. As you commit, record every git command you run (with its purpose and output) in a file called `process-log.md`. This log is part of the deliverable.

When all commits are done, capture recent history in `commit-log.txt`.

## Output Specification

- `process-log.md` — a running log of every git command executed during the commit workflow, written in the `project/` directory. Include the command, a one-line description of why it was run, and any relevant output (e.g., the stat output from git diff --cached --stat, the commit hash from git commit).
- `commit-log.txt` — output of `git log --oneline -5` after all commits are complete, written to `project/`.

## Input Files

Extract the files below and run `setup.sh` to initialize the repository.

=============== FILE: setup.sh ===============
#!/usr/bin/env bash
set -e
mkdir -p project && cd project
git init -q
git config user.email "dev@example.com"
git config user.name "Dev"

# Existing codebase
mkdir -p src/db
cat > src/db/connection.js << 'EOF'
const { Client } = require('pg');
module.exports = new Client({ connectionString: process.env.DATABASE_URL });
EOF

cat > src/db/queries.js << 'EOF'
const client = require('./connection');
exports.find = (table, id) => client.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
EOF

cat > src/pipeline/runner.js << 'EOF'
const db = require('../db/connection');
const run = async () => { await db.connect(); };
module.exports = run;
EOF

cat > CONTRIBUTING.md << 'EOF'
# Contributing

Please open a PR and get one approval before merging.
EOF

git add .
git commit -q -m "chore: initial project structure"

# --- Refactor: db connection pooling (modified files) ---
cat > src/db/connection.js << 'EOF'
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
EOF

cat > src/db/queries.js << 'EOF'
const pool = require('./connection');
exports.find = (table, id) => pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
EOF

cat > src/pipeline/runner.js << 'EOF'
const pool = require('../db/connection');
const run = async () => {
  const client = await pool.connect();
  try {
    // pipeline logic here
  } finally {
    client.release();
  }
};
module.exports = run;
EOF

# --- Docs: updated contributing guide ---
cat > CONTRIBUTING.md << 'EOF'
# Contributing

## Getting Started

1. Fork the repo and create a feature branch.
2. Run `npm test` before pushing.
3. Open a PR and get at least one approval before merging.
4. Use conventional commits for all commit messages.

## Commit Style

We follow the Conventional Commits spec: `type(scope): description`.
EOF

echo "Repo ready. src/db/connection.js, src/db/queries.js, src/pipeline/runner.js, and CONTRIBUTING.md are all modified but unstaged."
