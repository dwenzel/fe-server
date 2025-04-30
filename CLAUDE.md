# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Run server: `node ./server/index.mjs`
- Preview: `npm run preview` (uses nitro preview command)

## Code Style Guidelines

### General
- Project type: Nuxt 3 application with Vue 3
- Use ES Modules (import/export) syntax
- Maintain TypeScript type safety
- Follow Vue 3 Composition API patterns

### Naming Conventions
- Components: PascalCase (e.g., `PageView.vue`)
- Files/directories: kebab-case (e.g., `page-view.ts`)
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE

### API Structure
- RESTful API pattern for pages and items
- Consistent error handling (HTTP status codes)
- Authentication via X-Api-Key header
- UUID format for all IDs

### Schema Validation
- Follow OpenAPI 3.0.2 schema definitions
- Validate request/response bodies against schemas
- Respect required fields in Page/Item schemas