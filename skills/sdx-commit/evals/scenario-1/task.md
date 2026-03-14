# Commit Changes for Two Tracked Features

## Problem Description

A backend team maintains a project that tracks planned changes in an `openspec/changes/` directory — each subdirectory there represents a named feature or spec change. When implementation work lands, they want commit history to make it easy to trace which commits belong to which tracked feature.

Two features were implemented this sprint: `customer-import` (a CSV-based bulk importer for customer records) and `audit-log` (event logging for compliance). Both are now in the working tree, unstaged. The team cares deeply about being able to filter git history by feature name later, so commit messages should reflect the feature they implement.

Commit all pending changes. Save the output of `git log --oneline -5` to `commit-log.txt` in the `project/` directory when done.

## Output Specification

- `commit-log.txt` — the output of `git log --oneline -5` after all commits are complete, written to the `project/` directory.

## Input Files

Extract the files below and run `setup.sh` to initialize the repository.

=============== FILE: setup.sh ===============
#!/usr/bin/env bash
set -e
mkdir -p project && cd project
git init -q
git config user.email "dev@example.com"
git config user.name "Dev"

echo "# Backend Service" > README.md
git add README.md
git commit -q -m "chore: initial commit"

# openspec feature: customer-import
mkdir -p openspec/changes/customer-import
cat > openspec/changes/customer-import/spec.md << 'EOF'
# customer-import

Allow bulk import of customer records from CSV files via the admin API.

## Acceptance Criteria
- POST /admin/import accepts a CSV file upload
- Rows are validated before insertion
- Returns a summary of imported / skipped rows
EOF

mkdir -p src/importers tests
cat > src/importers/csv.js << 'EOF'
const { parse } = require('csv-parse/sync');

exports.parseCustomers = (csvBuffer) => {
  const records = parse(csvBuffer, { columns: true, skip_empty_lines: true });
  return records.filter(r => r.email && r.name);
};
EOF

cat > src/routes/import.js << 'EOF'
const { parseCustomers } = require('../importers/csv');
const db = require('../db');

module.exports = async (req, res) => {
  const customers = parseCustomers(req.file.buffer);
  const inserted = await db.customers.bulkInsert(customers);
  res.json({ imported: inserted.length, skipped: customers.length - inserted.length });
};
EOF

cat > tests/csv.test.js << 'EOF'
const { parseCustomers } = require('../src/importers/csv');
describe('parseCustomers', () => {
  it('filters rows missing email or name', () => {
    const csv = Buffer.from('name,email\nAlice,alice@x.com\nBob,\n');
    expect(parseCustomers(csv)).toHaveLength(1);
  });
});
EOF

# openspec feature: audit-log
mkdir -p openspec/changes/audit-log
cat > openspec/changes/audit-log/spec.md << 'EOF'
# audit-log

Log all write operations (create/update/delete) to an audit table for compliance.

## Acceptance Criteria
- Every mutation logs actor, action, resource type, resource id, and timestamp
- Logs are queryable via GET /admin/audit?resource=<type>
EOF

mkdir -p src/audit
cat > src/audit/logger.js << 'EOF'
const db = require('../db');

exports.log = async ({ actor, action, resource, resourceId }) => {
  await db.auditLogs.insert({
    actor,
    action,
    resource,
    resource_id: resourceId,
    timestamp: new Date(),
  });
};
EOF

cat > src/routes/audit.js << 'EOF'
const db = require('../db');

module.exports = async (req, res) => {
  const logs = await db.auditLogs.findAll({ resource: req.query.resource });
  res.json(logs);
};
EOF

cat > tests/audit.test.js << 'EOF'
const { log } = require('../src/audit/logger');
const db = require('../src/db');
jest.mock('../src/db');

describe('audit logger', () => {
  it('inserts a log record with all required fields', async () => {
    await log({ actor: 'user-1', action: 'delete', resource: 'customer', resourceId: '42' });
    expect(db.auditLogs.insert).toHaveBeenCalledWith(
      expect.objectContaining({ actor: 'user-1', action: 'delete' })
    );
  });
});
EOF

echo "Repo ready. All changes are unstaged."
