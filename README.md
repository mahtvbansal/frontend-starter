# InvoicePro Frontend

A modern React + TypeScript frontend for invoice management, with authentication, role/permission-based access control, testing, and CI workflows.

## Overview

This app provides an end-to-end invoice UI flow:

- Auth: sign up and log in
- Invoice list: search, filter, pagination, and responsive list/table views
- Invoice details: view invoice data and delete (permission-gated)
- Invoice create/edit: validated forms with API integration
- Route protection with authentication and permission checks

## Features

### Authentication

- Login and signup flows
- Session bootstrap via refresh + me endpoint
- Automatic logout redirect on unauthorized API state

### Authorization (RBAC)

- Central `PrivateRoute` with auth + permission checks
- Permission-gated actions/components (create, update, delete)
- Admin role override and permission matching

### Invoices

- List invoices with:
  - text search
  - status filters (`Draft`, `Sent`, `Paid`)
  - pagination
  - responsive desktop/mobile layouts
- Create invoices with client name and amount validation
- Edit invoices with status transitions and payload diffing
- View invoice details and delete with confirmation dialog

### Developer Experience

- TypeScript + Vite
- ESLint (Airbnb + TypeScript + hooks)
- Prettier formatting
- Husky + lint-staged pre-commit checks
- Commitizen conventional commit helper
- Vitest + React Testing Library test suite
- GitHub Actions CI pipeline

## Tech Stack

- React 18
- TypeScript
- Vite
- Material UI (MUI)
- React Router
- Vitest + Testing Library
- ESLint + Prettier
- Husky + lint-staged + Commitizen

## Project Structure

```text
src/
	components/          # Shared reusable components
	context/             # Auth context and auth state logic
	hooks/               # Shared hooks
	pages/               # Feature/page modules (auth + invoices)
	routes/              # Router config, layouts, private route guards
	services/            # API service layer
	test/                # Test providers and mocks
```

## Routes

- Public:
  - `/login`
  - `/signup`
- Protected:
  - `/invoices`
  - `/invoices/new` (requires `invoices:create`)
  - `/invoices/:id` (requires `invoices:read`)
  - `/invoices/:id/edit` (requires `invoices:update`)

## Environment Variables

Create a `.env` file in project root:

```bash
VITE_API_BASE_URL=https://your-backend-url
```

Example used locally:

```bash
VITE_API_BASE_URL=https://backend-starter-nu.vercel.app
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install and Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Available Scripts

- `pnpm dev` - start dev server
- `pnpm build` - type-check and production build
- `pnpm preview` - preview production build
- `pnpm test` - run unit tests once
- `pnpm test:watch` - run tests in watch mode
- `pnpm lint` - lint source files
- `pnpm lint:fix` - auto-fix lint issues
- `pnpm format` - format source files
- `pnpm format:check` - verify formatting
- `pnpm commit` - commit using Commitizen prompt

## Code Quality and Commit Workflow

### Pre-commit (automatic)

Husky runs on every `git commit`:

- `.husky/pre-commit` -> `pnpm lint-staged`

`lint-staged` tasks:

- `*.{ts,tsx}` -> `eslint --fix`, `prettier --write`
- `*.{json,css,md}` -> `prettier --write`

### Commit Message Helper

- Use `pnpm commit` to open Commitizen and generate conventional commit messages.

## CI/CD

### CI (`.github/workflows/ci.yml`)

Runs on `push`, `pull_request`, and manual trigger:

- Lint
- Unit tests
- Build
- Upload build artifact (`dist`)

### Deploy (`.github/workflows/deploy.yml`)

Current status: scaffold only.

- Triggers after successful CI on `main`/`master` or manually
- Rebuilds project
- AWS S3 + CloudFront deployment

## Testing

The test suite includes:

- shared components
- route/layout behavior
- auth and invoice pages
- custom hooks
- API client and service layer

Run all tests:

```bash
pnpm test
```

## Deployment Plan (AWS)

When ready, replace deploy placeholder with:

1. Upload `dist` to S3 bucket
2. Invalidate CloudFront cache
3. Secure auth via GitHub OIDC or AWS credentials in repository secrets

## License

This project is currently private/internal.
