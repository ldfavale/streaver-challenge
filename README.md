# Streaver Challenge - Posts Management System

A modern, responsive web application for managing posts with advanced UX features for unstable network conditions. Built with Next.js 14, TypeScript, and Prisma.

## ✨ Key Features

- **Posts Management**: View, filter by user, and delete posts with confirmation modals
- **Offline-First UX**: Network status detection, optimistic updates, and connection restoration feedback
- **Responsive Design**: Mobile-first approach with accessibility compliance (WCAG 2.1 AA)
- **API Documentation**: Interactive Swagger UI at `/api-docs`
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Testing**: Comprehensive test suite (unit, integration, E2E)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/ldfavale/streaver-challenge.git
cd streaver-challenge
npm install

# Set up database and seed data
npx prisma db push
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000/posts](http://localhost:3000/posts) to view the application.

## 🧪 Testing

```bash
# Unit & Integration tests
npm test

# E2E tests
npm run test:e2e

# Run all tests (CI mode)
npm run test:ci
```

## 📚 API Documentation

Interactive API documentation available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Available Endpoints
- `GET /api/posts` - List all posts (with optional `userId` filter)
- `DELETE /api/posts/[id]` - Delete a specific post
- `GET /api/users` - List all users

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development)
- **Testing**: Jest, React Testing Library, Playwright
- **Quality**: ESLint, Prettier, Husky pre-commit hooks
- **Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── posts/          # Posts page
│   └── api-docs/       # Swagger UI
├── components/         # React components (Atomic Design)
│   ├── atoms/          # Basic UI elements
│   └── molecules/      # Composite components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions
```


## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Populate database with sample data
npm test             # Run unit/integration tests
npm run test:e2e     # Run E2E tests
npm run test:ci      # Run all tests (CI mode)
```

## 🔍 Design Decisions

See [assumptions.md](./assumptions.md) for detailed architectural decisions and implementation rationale.
