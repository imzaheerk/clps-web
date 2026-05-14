# Checknown Web Application ✅

A modern React + Vite web application for Checknown — connect with people in your area.

## Features

- Responsive UI built with **React** and **TypeScript**
- Fast dev experience using **Vite** and Tailwind CSS
- Authentication (OTP), Profiles, Search, Notifications, Subscriptions
- Modular services, contexts, and typed navigation

## Tech stack 🔧

- React, TypeScript, Vite
- Tailwind CSS
- Vitest / React Testing Library (recommended)
- Backend: `clsp-web-api` (REST)

## Quick start — Local development 🚀

**Prerequisites:** Node 18+ and `pnpm` (or `npm`/`yarn`)

1. Install dependencies:

```bash
cd clsp-web
pnpm install
```

2. Run the dev server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
```

4. Preview the production build:

```bash
pnpm preview
```

## Environment

Copy `.env.example` to `.env` and set the following (example):

```
VITE_API_BASE_URL="http://localhost:3000"
```

## Tests & linting ✅

Run tests and linters:

```bash
pnpm test
pnpm lint
```

## Contributing

Contributions are welcome — please open issues or PRs. Follow the existing code style, run tests, and add small, focused commits.

## License

MIT

---

_This README was expanded to include setup instructions, tech stack, and development notes._