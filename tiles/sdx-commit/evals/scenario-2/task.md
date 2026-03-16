# Commit a User Management Feature

## Problem Description

A developer on a small product team has just finished building the user management module for an internal dashboard. The work spans the database schema, a REST API handler, and a React component — but they all belong to the same cohesive feature and were developed together as a unit. Nothing has been staged or committed yet.

The team uses conventional commits to make their changelog generation work correctly. Commit the pending changes with an appropriate message. Save the output of `git log --oneline -3` to `commit-log.txt` in the `project/` directory when done.

## Output Specification

- `commit-log.txt` — output of `git log --oneline -3` after all commits are complete, written to the `project/` directory.

## Input Files

Extract the files below and run `setup.sh` to initialize the repository.

=============== FILE: setup.sh ===============
#!/usr/bin/env bash
set -e
mkdir -p project && cd project
git init -q
git config user.email "dev@example.com"
git config user.name "Dev"

echo "# Dashboard" > README.md
git add README.md
git commit -q -m "chore: initial commit"

# User management feature — all one logical unit, all unstaged
mkdir -p src/api src/components db

cat > db/users_migration.sql << 'EOF'
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_email ON users(email);
EOF

cat > src/api/users.js << 'EOF'
const db = require('../db');

exports.listUsers = async (req, res) => {
  const users = await db.query('SELECT * FROM users ORDER BY created_at DESC');
  res.json(users.rows);
};

exports.createUser = async (req, res) => {
  const { email, display_name, role } = req.body;
  const result = await db.query(
    'INSERT INTO users (email, display_name, role) VALUES ($1, $2, $3) RETURNING *',
    [email, display_name, role]
  );
  res.status(201).json(result.rows[0]);
};
EOF

cat > src/components/UserList.tsx << 'EOF'
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.display_name} &lt;{u.email}&gt; — {u.role}</li>
      ))}
    </ul>
  );
}
EOF

echo "Repo ready. All changes are unstaged."
