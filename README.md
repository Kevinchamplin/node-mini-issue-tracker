# node-mini-issue-tracker

A small Node.js/Express REST API for tracking issues, designed as a focused demo of backend design, REST best practices, and pragmatic code structure.

## Tech stack

- Node.js (CommonJS modules)
- Express
- In-memory store (replaceable with SQL/NoSQL)

## API overview

Base URL: `/api/v1`

- `GET /issues` – List issues with filters and pagination.
  - Query params: `status`, `assignee`, `q`, `limit`, `offset`.
- `POST /issues` – Create a new issue.
- `GET /issues/:id` – Fetch a single issue.
- `PATCH /issues/:id` – Partially update an issue.
- `DELETE /issues/:id` – Delete an issue.

There is also a simple health check at `GET /health`.

This repository is part of a set of focused mini projects showcasing full‑stack and API design skills.
