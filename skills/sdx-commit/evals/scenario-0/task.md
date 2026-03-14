# Commit a Sprint's Accumulated Changes

## Problem Description

A small SaaS team just finished a sprint that touched three unrelated areas: a new authentication middleware, a new Stripe payment integration, and an update to the CI pipeline. All the code landed in the working directory without being committed — the developer had to context-switch and left everything unstaged.

The tech lead wants the git history to be clean and reviewable. Write up your plan in a `commit-plan.md` (what you intend to commit and in what groups, with proposed messages) and then execute the commits. When you're done, capture the recent git history in `commit-log.txt`.

## Output Specification

- `commit-plan.md` — your commit plan with proposed groupings and messages, written before any git staging.
- `commit-log.txt` — output of `git log --oneline -5` after all commits are complete.

The output files should be created in the `project/` directory (alongside the repo).

## Input Files

Extract the files below, then run `setup.sh` to initialize the repository with all pending changes.

=============== FILE: setup.sh ===============
#!/usr/bin/env bash
set -e
mkdir -p project && cd project
git init -q
git config user.email "dev@example.com"
git config user.name "Dev"

# Create an initial commit so HEAD exists
echo "# Acme App" > README.md
git add README.md
git commit -q -m "chore: initial commit"

# Auth feature (unstaged)
mkdir -p src/auth tests
cat > src/auth/middleware.js << 'EOF'
const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
EOF

cat > src/auth/utils.js << 'EOF'
const bcrypt = require('bcrypt');
const ROUNDS = 12;

exports.hashPassword = (pw) => bcrypt.hash(pw, ROUNDS);
exports.verifyPassword = (pw, hash) => bcrypt.compare(pw, hash);
EOF

cat > tests/auth.test.js << 'EOF'
const middleware = require('../src/auth/middleware');
describe('authMiddleware', () => {
  it('rejects requests with no token', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    middleware({ headers: {} }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
EOF

# Payments feature (unstaged)
mkdir -p src/payments
cat > src/payments/processor.js << 'EOF'
const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.chargeCard = async (amount, currency, source) => {
  return stripe.charges.create({ amount, currency, source });
};
EOF

cat > src/payments/webhook.js << 'EOF'
const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.handleWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('Received event:', event.type);
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};
EOF

cat > tests/payments.test.js << 'EOF'
const { chargeCard } = require('../src/payments/processor');
describe('chargeCard', () => {
  it('calls stripe.charges.create with correct params', async () => {
    // stub test placeholder
  });
});
EOF

# CI config (unstaged)
mkdir -p .github/workflows
cat > .github/workflows/ci.yml << 'EOF'
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
EOF

echo "Repo ready. All changes are unstaged."
