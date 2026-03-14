# Organize and Commit a Large Multi-Area Release

## Problem Description

A platform engineering team is preparing a release that includes work across several areas: a new notification service, a reporting module, updates to shared infrastructure (logging and database pooling), and documentation changes. All of it landed in the working tree across 12+ files — none of it staged or committed.

The engineering manager needs a clean, browsable git history before the release branch is cut. She's particularly concerned that the history doesn't collapse everything into one giant commit, but she also doesn't want a commit per file. The goal is a well-organized set of commits that group changes logically.

Commit all pending changes. Write a `commit-plan.md` in the `project/` directory showing your grouping decisions and proposed messages before you begin committing, then carry out the commits. Save `git log --oneline -8` to `commit-log.txt` when done.

## Output Specification

- `commit-plan.md` — your proposed groupings and commit messages, written to `project/` before staging begins.
- `commit-log.txt` — output of `git log --oneline -8` after all commits, written to `project/`.

## Input Files

Extract the files below and run `setup.sh` to initialize the repository.

=============== FILE: setup.sh ===============
#!/usr/bin/env bash
set -e
mkdir -p project && cd project
git init -q
git config user.email "dev@example.com"
git config user.name "Dev"

echo "# Platform" > README.md
git add README.md
git commit -q -m "chore: initial commit"

# --- Feature: notifications ---
mkdir -p src/notifications src/notifications/templates tests/notifications

cat > src/notifications/service.js << 'EOF'
const mailer = require('./mailer');
const { renderTemplate } = require('./templates');

exports.send = async ({ to, template, data }) => {
  const html = renderTemplate(template, data);
  return mailer.send({ to, subject: data.subject, html });
};
EOF

cat > src/notifications/mailer.js << 'EOF'
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST });

exports.send = ({ to, subject, html }) =>
  transport.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
EOF

cat > src/notifications/templates/index.js << 'EOF'
const { readFileSync } = require('fs');
const { join } = require('path');
const Handlebars = require('handlebars');

exports.renderTemplate = (name, data) => {
  const src = readFileSync(join(__dirname, `${name}.hbs`), 'utf8');
  return Handlebars.compile(src)(data);
};
EOF

cat > src/notifications/templates/welcome.hbs << 'EOF'
<p>Welcome, {{name}}! Your account is ready.</p>
EOF

cat > tests/notifications/service.test.js << 'EOF'
const { send } = require('../../src/notifications/service');
describe('notification service', () => {
  it('renders and sends email', async () => {
    // stub
  });
});
EOF

# --- Feature: reporting ---
mkdir -p src/reporting tests/reporting

cat > src/reporting/builder.js << 'EOF'
const db = require('../db');

exports.buildReport = async ({ from, to, metric }) => {
  const rows = await db.query(
    'SELECT date_trunc($1, ts) AS period, SUM(value) FROM events WHERE ts BETWEEN $2 AND $3 GROUP BY 1 ORDER BY 1',
    [metric, from, to]
  );
  return rows.rows;
};
EOF

cat > src/reporting/formatter.js << 'EOF'
exports.toCsv = (rows) =>
  ['period,value', ...rows.map(r => `${r.period},${r.value}`)].join('\n');

exports.toJson = (rows) => JSON.stringify(rows, null, 2);
EOF

cat > src/reporting/routes.js << 'EOF'
const { buildReport } = require('./builder');
const { toCsv, toJson } = require('./formatter');

module.exports = async (req, res) => {
  const data = await buildReport(req.query);
  const accept = req.headers.accept || 'application/json';
  if (accept.includes('text/csv')) {
    res.setHeader('Content-Type', 'text/csv');
    return res.send(toCsv(data));
  }
  res.json(toJson(data));
};
EOF

cat > tests/reporting/builder.test.js << 'EOF'
const { buildReport } = require('../../src/reporting/builder');
describe('buildReport', () => {
  it('returns aggregated rows', async () => {
    // stub
  });
});
EOF

# --- Shared infra: logging ---
mkdir -p src/infra

cat > src/infra/logger.js << 'EOF'
const pino = require('pino');
module.exports = pino({ level: process.env.LOG_LEVEL || 'info' });
EOF

cat > src/infra/db-pool.js << 'EOF'
const { Pool } = require('pg');
module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});
EOF

# --- Docs ---
mkdir -p docs

cat > docs/notifications.md << 'EOF'
# Notification Service

Send transactional emails using Handlebars templates.

## Usage

\`\`\`js
await send({ to: 'user@example.com', template: 'welcome', data: { name: 'Alice', subject: 'Welcome!' } });
\`\`\`
EOF

cat > docs/reporting.md << 'EOF'
# Reporting

Query aggregated event metrics over a date range.

## Endpoints

GET /api/reports?metric=day&from=2024-01-01&to=2024-01-31
EOF

echo "Repo ready. All 12 files are unstaged."
