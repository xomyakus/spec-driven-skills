#!/bin/bash
# Start both frontend dev server and Rust backend
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000

trap 'kill 0' EXIT

(cd frontend && npm run dev) &
cargo run &

wait
