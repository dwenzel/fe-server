# Template Rendering Architecture

This document describes the architecture for the template rendering system in the Frontend Server.

## Overview

The template rendering system provides a flexible and extensible way to render content using different template engines (Handlebars, Pug, Mustache, etc.). It allows for content to be rendered with the most appropriate template engine based on configuration, content type, or client requirements.

## Key Components

### 1. Template Renderer Service

The core service that provides a unified interface for template rendering. It:
- Manages multiple template engines through adapters
- Selects the appropriate engine based on configuration or request
- Handles template loading, compilation, and rendering
- Provides error handling and logging for the rendering process

### 2. Template Engine Adapters

Each supported template engine has its own adapter that implements a common interface. The adapters:
- Encapsulate engine-specific functionality
- Manage engine-specific configuration
- Handle engine-specific template compilation and caching
- Provide additional helpers or extensions for each engine

### 3. Template Registry

Manages templates and provides template lookup functionality:
- Loads templates from filesystem or other sources
- Caches templates for performance
- Supports template inheritance and partials
- Enforces template naming conventions

### 4. Configuration System

Provides flexible configuration for the template rendering system:
- Maps content types to template engines
- Configures engine-specific options
- Defines template locations and naming conventions
- Controls caching behavior

## Class Structure

```
TemplateRenderer
├── Engine adapters
│   ├── HandlebarsAdapter
│   ├── PugAdapter
│   └── MustacheAdapter
├── TemplateRegistry
└── TemplateConfig
```

## Flow Diagram

```
Request → Content Retrieval → Template Selection → Engine Selection → Data Transformation → Rendering → Response
```

## Template Selection Logic

Templates are selected based on several factors:
1. Content type (page, item, type of content)
2. Explicit template configuration in content
3. Client preference (via Accept headers or query parameters)
4. Fallback to default templates

## Engine Selection Logic

The engine to use for rendering is determined by:
1. Explicit engine specification in the request
2. Content type mapping to engines in configuration
3. Template extension
4. Default engine configuration

## Directory Structure

```
/src
  /services
    /templates
      template-renderer.js     # Main renderer service
      template-registry.js     # Template registry
      handlebars-adapter.js    # Handlebars adapter
      pug-adapter.js           # Pug adapter
      mustache-adapter.js      # Mustache adapter
  /templates                   # Template files
    /handlebars
      /pages
        default.hbs
        news.hbs
      /items
        default.hbs
        list.hbs
    /pug
      /pages
        default.pug
      /items
        default.pug
    /mustache
      /pages
        default.mustache
      /items
        default.mustache
  /config
    templates.js               # Template configuration
```

## Configuration Example

```javascript
{
  defaultEngine: 'handlebars',
  enabledEngines: ['handlebars', 'pug', 'mustache'],
  templatePaths: {
    handlebars: './templates/handlebars',
    pug: './templates/pug',
    mustache: './templates/mustache'
  },
  engineOptions: {
    handlebars: {
      cache: true,
      helpers: ['./helpers/handlebars-helpers.js']
    },
    pug: {
      pretty: false,
      cache: true
    }
  },
  contentTypeMap: {
    'dynamic': 'handlebars',
    'news': 'pug',
    'project': 'mustache'
  },
  defaultTemplates: {
    'page': 'pages/default',
    'item': 'items/default',
    'error': 'error/default'
  }
}
```

## Implementation Considerations

### Security

- All template input is sanitized to prevent injection attacks
- Output encoding is applied to prevent XSS vulnerabilities
- Templates have limited access to system resources
- Untrusted content is properly escaped

### Performance

- Templates are compiled once and cached for reuse
- Rendering results can be cached for frequently accessed content
- Monitoring is in place to detect slow rendering templates
- Lazy loading of template engines and templates

### Error Handling

- Comprehensive error handling for:
  - Missing templates
  - Template compilation errors
  - Runtime rendering errors
  - Configuration errors
- Fallback templates for error conditions
- Detailed logging for troubleshooting

### Internationalization

- Templates support internationalization
- Language selection based on content or client preferences
- Locale-specific formatting for dates, numbers, etc.

### Extensibility

- New template engines can be added by implementing the adapter interface
- Custom helpers can be registered for each engine
- Content processing can be extended with additional transformations
- Support for template inheritance and composition

## Future Enhancements

- Support for additional template engines (EJS, Nunjucks, etc.)
- Server-side rendering of JavaScript frameworks (React, Vue)
- Template precompilation during build process
- Advanced caching strategies (Redis, memory cache)
- Template version control and A/B testing support