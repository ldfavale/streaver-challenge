# Project Assumptions

Key decisions made during development not explicitly specified in requirements.

## Architecture

*   **A.1:** TypeScript strict mode enabled for compile-time error prevention and better maintainability.
*   **A.2:** App Router used over Pages Router for better performance and developer experience.
*   **A.3:** Server Components by default, Client Components only when interactivity required.

## Database

*   **A.4:** Foreign key constraints enforced for data integrity.
*   **A.5:** Posts ordered by creation date (newest first) for better UX.
*   **A.6:** Hard delete implemented instead of soft delete for simplicity.

## Unstable Connections (Core Requirement)

*   **A.7:** Optimistic updates implemented for delete operations to improve perceived performance.
*   **A.8:** Network status detection with offline indicators and "Connection Restored" notification.
*   **A.9:** Loading states prevent multiple simultaneous requests.

## API Design

*   **A.10:** RESTful conventions with consistent error response structure.
*   **A.11:** Input validation using Zod schemas for runtime type safety.
*   **A.12:** Database queries optimized with Prisma `include` to prevent N+1 problems.
*   **A.13:** Proper HTTP status codes (200, 404, 500) for client error handling.

## User Experience

*   **A.14:** Filter state managed via URL parameters for shareable links.
*   **A.15:** Confirmation modals for destructive actions (delete).
*   **A.16:** Toast notifications for user feedback on actions.
*   **A.17:** Responsive design for mobile users who travel frequently.

## Quality & Testing

*   **A.18:** Jest for unit/integration tests, Playwright for E2E.
*   **A.19:** API routes tested with mocked dependencies for isolation.
*   **A.20:** Edge Runtime environment for API tests to match production.
*   **A.21:** Pre-commit hooks enforce code quality standards (Prettier + ESLint).
*   **A.22:** Testing pyramid implemented: unit tests (isolated components/hooks), integration tests (component + router interactions, hook compositions), E2E tests (critical user flows).