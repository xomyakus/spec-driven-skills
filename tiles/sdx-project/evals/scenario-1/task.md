# Payment Gateway Kickoff

## Problem/Feature Description

We are starting a new project for a payment gateway microservice to handle external credit card validations. The technical leads and DBAs have already mapped out the high-level architecture and necessary data models. Please initiate the project named `payment-gateway` using the `react-node` stack inside a directory of the same name. We want everything standard, fully configured, and ready for development.

## Output Specification

Expected output is an initialized project in the `payment-gateway` directory, configured with all initial setup.

## Input Files

The following files are provided as inputs.

=============== FILE: concept.md ===============
# Payment Gateway
A service to validate external credit card transactions.
It needs a resilient API, a webhook processor, and an admin UI.

=============== FILE: datamodel.md ===============
# Schema
1. Payments: id, amount, currency, status.
2. Webhooks: id, payment_id, payload, timestamp.
3. Users: id, email, role.

=============== FILE: architecture.md ===============
# Architecture
This service uses a Core Engine for validations and a Webhook Consumer for callbacks.
The Core Engine exposes REST HTTP endpoints.
The Webhook Consumer operates via queues.
