# Page Hierarchy and Routing

This document outlines the hierarchical page structure and slug-based routing in the Frontend Server.

## Hierarchy Concept

Pages in the Frontend Server are organized in a hierarchical structure:

- A single **root page** serves as the entry point for the page hierarchy
- Child pages are linked to their parent via the `parent` property
- Each non-root page has a `slug` property that represents its URL path segment
- The complete URL path to a page is formed by concatenating the slugs of all its ancestors

## Root Page

The root page is a special page that:

- Has `isRoot: true` property
- Must have an empty slug or no slug property
- Cannot have a parent
- Cannot be deleted while it has children
- Is the starting point for hierarchical slug-based routing
- Only one root page can exist in the system
- Is served at the base URL (e.g., `http://example.com/`)

## Non-Root Pages

Non-root pages must:

- Have a non-empty slug
- Have a parent page
- Not have `isRoot: true` property
- Form part of the hierarchical URL structure

## Slug-based Routing

Hierarchical paths are resolved by:

1. Starting at the root page (which has an empty slug)
2. Traversing the hierarchy by matching slugs to child pages
3. Rendering the page at the end of the path

For example, given these pages:
- Root page (isRoot: true, slug: "")
- Products page (parent: rootId, slug: "products")
- Product detail page (parent: productsId, slug: "widget-x")

The page URLs would be:
- Root page: `/`
- Products page: `/products`
- Product detail page: `/products/widget-x`

## Rules for Pages

1. Root page:
   - Must have `isRoot: true`
   - Must have an empty slug or no slug property
   - Cannot have a parent
   - Only one root page can exist

2. Non-root pages:
   - Must have a parent
   - Cannot have `isRoot: true`
   - Must have a valid, non-empty `slug` property

3. Deletion rules:
   - Root page cannot be deleted if it has child pages
   - Child pages can be deleted regardless of their children

## API Structure

The Frontend Server provides two types of endpoints:

1. **API Endpoints** (`/api/v1/`):
   - Used for backend operations (CRUD)
   - Authentication required
   - Return JSON responses

2. **Frontend Endpoints**:
   - Public endpoints for retrieving pages/items
   - Support both JSON and HTML responses via content negotiation
   - Include hierarchical slug-based routing directly on the root path
   
Examples:
- API endpoint: `/api/v1/backend/pages/{id}`
- Page by ID: `/api/v1/pages/{id}`
- Page by slug: `/{slug}` (e.g., `/products/widget-x`)
- Root page: `/`