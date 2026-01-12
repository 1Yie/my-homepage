# AGENTS.md

This document provides guidelines for AI coding agents working on the ichiyo.in project. It contains build/lint/test commands, code style guidelines, and project-specific conventions.

## Project Overview

This is a monorepo project with two main workspaces:

- `web/`: React + TypeScript frontend using Vite, Tailwind CSS, and React Router
- `server/`: Elysia backend server using TypeScript

## Build/Lint/Test Commands

### Global Commands (run from project root)

```bash
# Install all dependencies
bun install

# Build all workspaces
bun run build

# Start development servers for all workspaces
bun run dev

# Lint all code
bun run lint

# Auto-fix linting issues and format code
bun run format
```

### Workspace-Specific Commands

#### Web Frontend (`web/` directory)

```bash
# Build production bundle
cd web && bun run build

# Start development server
cd web && bun run dev

# Lint web code
cd web && bun run lint
```

#### Server Backend (`server/` directory)

```bash
# Start development server with hot reload
cd server && bun run dev
```

### Testing

**Note:** Testing is not currently configured in this project. When tests are added:

- Frontend tests would likely use Vitest (integrated with Vite)
- Backend tests would use a testing framework compatible with Elysia/Bun

## Code Style Guidelines

### Language and Framework Usage

- **Frontend:** React 19 with TypeScript, functional components with hooks
- **Backend:** Elysia framework with TypeScript
- **Styling:** Tailwind CSS with class-variance-authority for component variants
- **State Management:** React hooks and context (no external state libraries currently used)

### TypeScript Configuration

- **Strict mode:** Enabled - no implicit any, strict null checks, etc.
- **Target:** ES2022 (frontend), ES2021 (backend)
- **Module resolution:** Bundler mode (frontend), Node (backend)
- **JSX:** React JSX transform
- **No explicit any:** Error level - avoid `any` type
- **Unused code:** Error level - remove unused locals and parameters

### Import and Module Organization

- **Path aliases:**
  - `@/*` → `./web/src/*` (frontend)
  - `@server/*` → `../server/src/*` (from web)
- **Import sorting:** Natural ascending order (enforced by perfectionist ESLint plugin)
- **Import grouping:** External imports first, then internal imports with aliases

### Naming Conventions

- **Files:**
  - Frontend: kebab-case (e.g., `user-profile.tsx`, `api-client.ts`)
  - Backend: camelCase (e.g., `userService.ts`, `authMiddleware.ts`)
  - Special: `App.tsx`, `index.ts` files allowed in PascalCase/camelCase
- **Components:** PascalCase (e.g., `UserProfile`, `ApiClient`)
- **Hooks:** camelCase with `use` prefix (e.g., `useMobile`, `useAuth`)
- **Functions:** camelCase (e.g., `fetchUserData`, `validateInput`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)
- **Types/Interfaces:** PascalCase (e.g., `UserProfile`, `ApiResponse<T>`)

### Code Formatting (Prettier)

- **Indentation:** Tabs (not spaces)
- **Line width:** 80 characters
- **Quotes:** Single quotes for strings
- **Semicolons:** Required
- **Trailing commas:** ES5 style (required for multiline arrays/objects)
- **JSX:** Props sorted naturally ascending
- **JSON sorting:** Enabled (recursive)
- **Tailwind classes:** Auto-sorted by prettier-plugin-tailwindcss
- **Package.json:** Auto-sorted by prettier-plugin-pkg

### ESLint Rules

#### Core Rules

- No explicit `any` types (error)
- No unused variables/parameters (error)
- React hooks rules enforced
- React refresh patterns followed

#### Import/Export Rules

- Imports sorted naturally ascending
- JSX props sorted naturally ascending

#### File Naming Rules

- Frontend files: kebab-case (error)
- Backend files: camelCase (warn)

### Component Patterns

#### Coss UI Components

This project uses Coss UI components. Key differences from shadcn/ui:

- **Button component**: Uses `render` prop instead of `asChild` for custom rendering
- **Sheet component**: Uses `render` prop for trigger instead of `asChild`
- **Example usage**:

```typescript
import { Button } from '@/components/ui/button';

// Correct usage with Coss UI
<Button
  render={<Link to="/path">Link Text</Link>}
  variant="ghost"
  size="sm"
/>

// NOT: asChild prop (not supported)
<Button asChild variant="ghost" size="sm">
  <Link to="/path">Link Text</Link>
</Button>
```

#### Header and Footer Components

The project includes standardized Header and Footer components:

- **Header**: Sticky navigation with responsive design
  - Desktop: Horizontal navigation menu
  - Mobile: Hamburger menu with Sheet overlay from top
  - Consistent styling with Footer (same height, padding)

- **Footer**: Social media links and copyright information
  - Responsive layout matching Header design
  - Social icons using emoji (adaptable without external icon libraries)
  - Copyright with dynamic year display

#### React Components

#### React Components

```typescript
import { useState } from 'react';

interface UserCardProps {
	name: string;
	email: string;
	avatarUrl?: string;
}

function UserCard({ name, email, avatarUrl }: UserCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return <div className="user-card">{/* Component JSX */}</div>;
}

export default UserCard;
```

#### Utility Functions

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

### Error Handling

- **Frontend:** Use React Error Boundaries for component-level errors
- **Backend:** Elysia provides built-in error handling
- **Async operations:** Always handle promise rejections
- **Type safety:** Leverage TypeScript's strict mode for error prevention

### API Integration

- **Client:** Uses `@elysiajs/eden` for type-safe API client
- **Endpoints:** RESTful conventions with TypeScript types exported from server

### Styling Conventions

- **Tailwind CSS:** Primary styling approach
- **Component variants:** Use class-variance-authority for variant props
- **Responsive design:** Mobile-first approach
- **Dark mode:** Not currently implemented, but prepare for it

### File Structure

```
web/src/
├── components/
│   ├── header/           # Header component with navigation
│   ├── footer/           # Footer component with social links
│   ├── ui/               # Reusable UI components (Coss UI style)
│   └── ...               # Feature-specific components
├── pages/                # Route components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── api/                  # API client code
├── layout/               # Layout components (AppLayout)
└── router/               # Routing configuration

server/src/
├── ...                   # Server code (Elysia framework)
```

web/src/
├── components/
│ ├── ui/ # Reusable UI components (shadcn/ui style)
│ └── ... # Feature-specific components
├── pages/ # Route components
├── hooks/ # Custom React hooks
├── lib/ # Utilities and configurations
├── api/ # API client code
└── router/ # Routing configuration

server/src/
├── ... # Server code (minimal structure currently)

````

### Git and Commit Conventions

- **Commit messages:** Conventional commits format
  - `feat:` new features
  - `fix:` bug fixes
  - `docs:` documentation
  - `style:` formatting changes
  - `refactor:` code restructuring
  - `test:` adding tests
  - `chore:` maintenance tasks

### Development Workflow

1. **Pre-commit:** Husky runs lint-staged (ESLint + Prettier on staged files)
2. **Pre-push:** Commitlint validates commit message format
3. **Build verification:** Ensure builds pass before pushing

### Performance Considerations

- **React:** Use React 19 features, optimize re-renders
- **Bundle:** Vite handles code splitting automatically
- **Images:** Not currently optimized (consider adding in future)
- **API calls:** No caching implemented yet

### Security Best Practices

- **TypeScript strict mode:** Prevents many runtime errors
- **No secrets in code:** Never commit API keys, tokens, or credentials
- **Input validation:** Validate all user inputs on both client and server
- **HTTPS:** Ensure all API calls use HTTPS in production

### Testing Guidelines (Future Implementation)

When tests are added:

- **Framework:** Vitest for frontend, native Bun test runner for backend
- **File naming:** `*.test.ts`, `*.spec.tsx`
- **Test structure:** Arrange-Act-Assert pattern
- **Coverage:** Aim for high coverage on business logic
- **Mocking:** Mock external dependencies and API calls

### Accessibility (a11y)

- **Semantic HTML:** Use proper semantic elements
- **ARIA labels:** Add when necessary for screen readers
- **Keyboard navigation:** Ensure all interactive elements are keyboard accessible
- **Color contrast:** Maintain WCAG guidelines
- **Focus management:** Proper focus indicators and management

### Internationalization (i18n)

- **Not implemented:** Currently single-language (English)
- **Future prep:** Design components to support i18n when needed

### Browser Support

- **Modern browsers:** ES2022+ features used
- **Progressive enhancement:** Core functionality works without JavaScript
- **Polyfills:** Add as needed for older browser support

### Deployment

- **Frontend:** Static hosting (Vite build output)
- **Backend:** Node.js hosting compatible with Bun
- **Environment variables:** Use Bun.env for configuration
- **Build optimization:** Vite handles minification and asset optimization

### Tooling and Editor Setup

- **Package manager:** Bun
- **Build tool:** Vite (frontend)
- **Linter:** ESLint with TypeScript and React plugins
- **Formatter:** Prettier with specialized plugins
- **Git hooks:** Husky + lint-staged for pre-commit quality checks
- **IDE:** VS Code recommended (settings provided for spell checking)

### Dependencies

#### Runtime Dependencies

- **Frontend:** React, React Router, Tailwind CSS, Coss UI components
- **Backend:** Elysia, Bun types

#### Development Dependencies

- **Linting/Formatting:** ESLint, Prettier, TypeScript ESLint
- **Git:** Husky, lint-staged, commitlint
- **Build:** Vite, TypeScript

### Code Review Checklist

- [ ] TypeScript strict mode violations resolved
- [ ] ESLint errors fixed
- [ ] Code formatted with Prettier
- [ ] Imports sorted correctly
- [ ] Naming conventions followed
- [ ] Unused code removed
- [ ] Tests added/updated (when applicable)
- [ ] Commit message follows conventional format
- [ ] Build passes successfully

### Troubleshooting

**Common Issues:**

- **Import errors:** Check path aliases and file extensions
- **TypeScript errors:** Ensure strict mode compliance
- **Linting failures:** Run `bun run format` to auto-fix
- **Build failures:** Check for missing dependencies or TypeScript errors

**Debug Commands:**

```bash
# Check TypeScript compilation
cd web && bunx tsc --noEmit

# Run ESLint with detailed output
bun run lint

# Check bundle size
cd web && bun run build && ls -lh dist/
````
