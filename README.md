# Crewbridge — Frontend

AI-assisted managed workforce platform for New Zealand hospitality.

This repository contains the React single-page application: four role-based interfaces
(job seeker, employer, administrator, trainer) built against the Crewbridge REST API.

---

## Contents

- [Stack](#stack)
- [Prerequisites](#prerequisites)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Conventions](#conventions)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Stack

| Component | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (CSS-based configuration) |
| Components | shadcn/ui (vendored), Radix UI primitives |
| Icons | lucide-react |
| Routing | react-router-dom |
| HTTP | axios |
| Testing | Vitest, React Testing Library, @testing-library/user-event |
| Linting | ESLint |

---

## Prerequisites

- Node.js 20 or later
- A running instance of the Crewbridge backend API

---

## Local setup

```bash
git clone <repository-url>
cd crewbridge-frontend

npm install
cp .env.example .env       # then set VITE_API_BASE_URL
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Environment variables

Create a `.env` file in the project root. **Never commit this file.**

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:8000/api` |

Vite only exposes variables prefixed with `VITE_` to client code.

---

## Available scripts

```bash
npm run dev            # start the development server
npm run build          # type-check and build for production
npm run preview        # preview the production build locally
npm test               # run the test suite once
npm run test:watch     # run tests in watch mode
npm run test:coverage  # run tests with a coverage report
npm run lint           # run ESLint
```

> **Run `npm run build` before pushing.** The pre-commit hook runs lint and tests but
> **not** the build, so type errors can otherwise reach the remote branch and fail CI.

---

## Project structure

```
src/
├── components/
│   ├── common/          # ConfirmDialog, ChangePasswordCard — shared app components
│   ├── layout/          # AppShell, Sidebar, TopBar, NotificationsPanel
│   └── ui/              # Vendored shadcn/ui primitives (excluded from lint and tsc)
├── context/
│   └── AuthContext.tsx  # Authentication state, current user, login/logout
├── lib/
│   ├── api.ts           # Configured axios instance with auth interceptor
│   ├── utils.ts         # cn(), formatTime(), jobRef()
│   ├── navConfig.ts     # Role-based navigation definitions
│   └── useNotifications.ts  # Notification polling hook
├── pages/
│   ├── jobseeker/       # Dashboard, MyCV, Documents, ScreeningInterview,
│   │   │                # BrowseJobs, MyApplications, MyPlacements, Profile
│   │   └── interview/   # useInterviewTimer — server-driven timing logic
│   ├── employer/        # Dashboard, PostJob, MyJobs, CandidateShortlist, Profile
│   ├── admin/           # Dashboard, Accounts, ReviewQueue, AllJobs
│   ├── RoleDashboard.tsx  # Dispatches to the correct dashboard by user role
│   ├── RoleProfile.tsx    # Dispatches to the correct profile by user role
│   ├── LandingPage.tsx, LoginPage.tsx, RegisterPage.tsx, Notifications.tsx
├── styles/
│   └── theme.css        # Tailwind v4 configuration and design tokens
├── routes.tsx           # Route definitions
└── main.tsx             # Entry point
```

### Path alias

`@/` resolves to `src/`. It is configured in **both** `vite.config.ts` (for runtime and
tests) and `tsconfig.app.json` (for type checking). Both must be kept in sync.

---

## Conventions

### Page width

- **List and table pages** (Browse Jobs, My Jobs, Applications, Accounts, dashboards) —
  `max-w-6xl mx-auto`
- **Forms and focused pages** (Post a Job, profiles, the interview question screen) —
  `max-w-2xl` to `max-w-4xl`

Forms deliberately stay narrower; a text input stretched across a wide screen is poor
usability.

### Design tokens

Defined in `src/styles/theme.css`:

- Navy `#0f172a` — sidebar, hero sections
- Emerald `#10b981` — primary accent and actions
- Border radius `0.75rem`

### Every page handles four states

A page is not complete until it handles loading, empty, error, and populated states. An
empty state should explain *why* it is empty where that is not obvious — for example, the
candidate shortlist explains that candidates appear only once they have applied, completed
screening, are verified as eligible, and have no scheduling conflict.

### Destructive actions

Use the themed `ConfirmDialog` component, never the browser's `confirm()`. The dialog
should state the consequence, not merely ask for confirmation.

### Role terminology

The backend role value is `WORKER`. It is displayed throughout the interface as
**"Job Seeker"**. This is a presentation-layer label only — never change the stored value.

### Server-authoritative timing

The screening interview derives its countdown from the `served_at` timestamp returned by
the API, not from a local timer. This means refreshing the page mid-question resumes at
the correct remaining time rather than resetting it. Do not replace this with a client-side
countdown.

---

## Testing

```bash
npm test
npm run test:coverage
```

### Conventions

**Mock the API module, not the network.**

```ts
vi.mock('@/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
```

**Mock at the boundary the component cares about.** Components treat a failed request as
"no data", so mocks should resolve with an empty payload rather than reject. Rejected
promises created inside a mock implementation can be observed by the test runner before
the component attaches its handler, producing unhandled-rejection failures that are
unrelated to the behaviour under test.

```ts
// Preferred — models "no data" without a rejection
function notFound() {
  return Promise.resolve({ data: null });
}
```

**Test the states, not the implementation.** Each page test should cover the empty state,
the populated state, and any blocked or error state that carries business meaning.

Coverage excludes `src/components/ui/**` (vendored third-party components), `main.tsx`
and `routes.tsx`.

---

## Deployment

The application is deployed to **Azure Static Web Apps** and builds automatically on push
to the `develop` branch via GitHub Actions.

```bash
npm run build      # outputs to dist/
```

Confirm before pushing:

```bash
npm test && npm run lint && npm run build
```

Environment variables for the deployed environment are configured in the Azure Static Web
App settings, not in the repository.

---

## Troubleshooting

**Red type errors in the editor but `npm run build` succeeds**
The TypeScript server is stale. In VS Code: `Cmd/Ctrl+Shift+P` → *TypeScript: Restart TS
Server*. A passing build means the code is correct.

**Tailwind classes have no effect**
Tailwind v4 requires **two** pieces of configuration: `@import "tailwindcss";` at the top
of `src/styles/theme.css`, **and** the `tailwindcss()` plugin registered in
`vite.config.ts`. Omitting the plugin silently produces unstyled output.

**`Cannot find name 'describe' / 'it' / 'expect'`**
Add `"vitest/globals"` to the `types` array in `tsconfig.app.json`.

**Unhandled promise rejection in tests**
A mock is rejecting a promise. See [Testing conventions](#conventions) — resolve with an
empty payload instead.

**Dynamic Tailwind class names do not apply**
Tailwind cannot see class names constructed at runtime, such as
`` `bg-${color}-50` ``. Use complete static class strings.

**CI fails on a build error after a green pre-commit**
The pre-commit hook runs lint and tests but not the build. Run `npm run build` locally
before pushing.
