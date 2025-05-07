# URLs and Routing

This document outlines the URL structure and routing approach used in the Frontend Server.

## Overview

The Frontend Server provides different types of URLs to access content:

1. **Backend API URLs** - Used for administrative operations with authentication
2. **Frontend URLs** - Public-facing URLs for content delivery

## URL Structure

### Backend API URLs

All backend API endpoints require authentication via X-Api-Key header.

| Pattern | Description | Notes |
|---------|-------------|-------|
| `/backend/pages` | Create, list pages | POST, GET |
| `/backend/pages/:id` | Get, update, delete page by ID | GET, PUT, DELETE |
| `/backend/items` | Create, list items | POST, GET |
| `/backend/items/:id` | Get, update, delete item by ID | GET, PUT, DELETE |

### Frontend URLs

Frontend URLs are public-facing and don't require authentication.

| Pattern | Description | Notes |
|---------|-------------|-------|
| `/frontend/pages` | List all pages | Supports HTML/JSON content negotiation |
| `/frontend/pages/:id` | Get page by ID | UUID-based access, supports HTML/JSON |
| `/frontend/pages/by-slug/:slug` | Get page by slug | User-friendly URL path segment |
| `/frontend/items` | List all items | Supports HTML/JSON content negotiation |
| `/frontend/items/:id` | Get item by ID | UUID-based access, supports HTML/JSON |

## Slugs and URL Path Segments

Pages can have an optional `slug` property that represents a URL-friendly path segment. This provides more user-friendly access to pages compared to UUIDs.

Slug requirements:
- Must only contain letters, numbers, hyphens, and underscores
- Must match the pattern: `^[a-z0-9-_]+$`
- Should be unique across all pages
- Should be lowercase for consistency

Example page with slug:
```json
{
  "id": "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
  "name": "About Us",
  "slug": "about",
  "attributes": { ... }
}
```

## Content Negotiation

Frontend URLs support content negotiation to serve different formats:

- HTML format: For browser rendering
- JSON format: For API consumers

Content format is determined by:
1. Query parameter: `?format=html` or `?format=json`
2. Accept header: `Accept: text/html` or `Accept: application/json`

## Routing Implementation

Routes are handled by:
- Express routing for request handling
- Middleware for request processing
- Templating system for HTML responses
- Direct JSON serialization for API responses

## Future Enhancements

- Support for nested slugs (e.g., `/products/categories`)
- Implementation of URL rewriting for cleaner URLs
- SEO optimization for generated URLs
- Support for localized URLs (i18n)