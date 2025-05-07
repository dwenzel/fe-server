/**
 * Template Renderer Service
 *
 * Provides a unified interface for rendering templates with different engines.
 */
import fs from 'fs';
import HandlebarsAdapter from './handlebars-adapter.js';
import PugAdapter from './pug-adapter.js';
import MustacheAdapter from './mustache-adapter.js';

class TemplateRenderer {
  /**
   * Create a new TemplateRenderer instance
   * @param {Object} config - Template configuration
   * @param {Object} logger - Logger instance
   */
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.engines = {};

    // Initialize the enabled engines
    this.initEngines();
  }

  /**
   * Initialize template engines based on configuration
   */
  initEngines() {
    const { enabledEngines = [] } = this.config;

    for (const engine of enabledEngines) {
      try {
        this.engines[engine] = this.createEngineAdapter(engine);
        this.logger.info(`Initialized template engine: ${engine}`);
      } catch (err) {
        this.logger.error(`Failed to initialize template engine: ${engine}`, err);
      }
    }
  }

  /**
   * Create an adapter for the specified engine
   * @param {string} engine - Engine name
   * @returns {Object} - Engine adapter instance
   */
  createEngineAdapter(engine) {
    switch (engine) {
      case 'handlebars':
        return new HandlebarsAdapter(this.config, this.logger);

      case 'pug':
        return new PugAdapter(this.config, this.logger);

      case 'mustache':
        return new MustacheAdapter(this.config, this.logger);

      default:
        throw new Error(`Unsupported template engine: ${engine}`);
    }
  }

  /**
   * Ensure template directories exist
   */
  ensureTemplateDirs() {
    const { templatePaths } = this.config;

    Object.values(templatePaths).forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.info(`Created template directory: ${dir}`);
      }
    });
  }

  /**
   * Determine which template to use based on content and type
   * @param {Object} content - Content to render
   * @param {string} contentType - Type of content ('page' or 'item')
   * @returns {string} - Template name
   */
  determineTemplate(content, contentType) {
    // If the content specifies a template, use that
    if (content.template) {
      return content.template;
    }

    // Get the appropriate default template based on content type and content.type
    const type = content.type || 'default';

    return this.config.defaultTemplates[contentType][type] ||
           this.config.defaultTemplates[contentType].default;
  }

  /**
   * Determine which engine to use based on content, template, and request
   * @param {Object} content - Content to render
   * @param {string} templateName - Template name
   * @param {Object} options - Rendering options
   * @returns {string} - Engine name
   */
  determineEngine(content, templateName, options = {}) {
    // If engine is explicitly specified in options, use that
    if (options.engine && this.engines[options.engine]) {
      return options.engine;
    }

    // If content has a specific engine preference, use that
    if (content.preferredEngine && this.engines[content.preferredEngine]) {
      return content.preferredEngine;
    }

    // Check if there's a content type mapping
    if (content.type && this.config.contentTypeMap[content.type]) {
      const mappedEngine = this.config.contentTypeMap[content.type];
      if (this.engines[mappedEngine]) {
        return mappedEngine;
      }
    }

    // Check template extension
    const extensions = {
      '.hbs': 'handlebars',
      '.handlebars': 'handlebars',
      '.pug': 'pug',
      '.jade': 'pug',
      '.mustache': 'mustache',
      '.mu': 'mustache'
    };

    for (const [ext, engine] of Object.entries(extensions)) {
      if (templateName.endsWith(ext) && this.engines[engine]) {
        return engine;
      }
    }

    // Fall back to default engine
    return this.config.defaultEngine;
  }

  /**
   * Transform raw content data to template-friendly format
   * @param {Object} content - Raw content data
   * @param {Object} options - Transformation options
   * @returns {Object} - Transformed data
   */
  transformData(content, options = {}) {
    // Create a base object with the original content
    const transformed = {
      ...content,
      meta: {
        title: content.metadata?.title || content.name || 'Untitled',
        description: content.metadata?.description || '',
        keywords: content.metadata?.keywords || []
      }
    };

    // Add rendering helpers
    transformed.helpers = {
      formatDate: (date) => new Date(date).toLocaleDateString(),
      isActive: (path) => path === options.currentPath,
      // Add more helpers as needed
    };

    // Add request information if available
    if (options.req) {
      transformed.request = {
        path: options.req.path,
        query: options.req.query,
        params: options.req.params
      };
    }

    return transformed;
  }

  /**
   * Render content with the appropriate template and engine
   * @param {Object} content - Content to render
   * @param {string} contentType - Type of content ('page' or 'item')
   * @param {Object} options - Rendering options
   * @returns {string} - Rendered content
   */
  renderContent(content, contentType, options = {}) {
    try {
      // Determine which template to use
      const templateName = options.template ||
                           this.determineTemplate(content, contentType);

      // Determine which engine to use
      const engineName = this.determineEngine(content, templateName, options);
      const engine = this.engines[engineName];

      if (!engine) {
        throw new Error(`Template engine not available: ${engineName}`);
      }

      // Transform the data for the template
      const transformedData = this.transformData(content, options);

      // Render the template
      return engine.render(templateName, transformedData, options);
    } catch (err) {
      this.logger.error(`Error rendering ${contentType}: ${err.message}`, err);

      // Attempt to render an error template if specified
      if (options.errorTemplate) {
        try {
          const errorEngine = this.engines[this.config.defaultEngine];
          return errorEngine.render(options.errorTemplate, {
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : null
          });
        } catch (renderErr) {
          // If even the error template fails, return a basic error message
          return `<h1>Error rendering ${contentType}</h1><p>${err.message}</p>`;
        }
      }

      // No error template specified, rethrow the error
      throw err;
    }
  }

  /**
   * Render a page
   * @param {Object} page - Page object to render
   * @param {Object} options - Rendering options
   * @returns {string} - Rendered page
   */
  renderPage(page, options = {}) {
    return this.renderContent(page, 'page', {
      errorTemplate: this.config.defaultTemplates.error.default,
      ...options
    });
  }

  /**
   * Render an item
   * @param {Object} item - Item object to render
   * @param {Object} options - Rendering options
   * @returns {string} - Rendered item
   */
  renderItem(item, options = {}) {
    return this.renderContent(item, 'item', {
      errorTemplate: this.config.defaultTemplates.error.default,
      ...options
    });
  }

  /**
   * Render an error page
   * @param {Object} error - Error object or message
   * @param {number} statusCode - HTTP status code
   * @param {Object} options - Rendering options
   * @returns {string} - Rendered error page
   */
  renderError(error, statusCode = 500, options = {}) {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : null;

    // Determine which error template to use
    const templateName = this.config.defaultTemplates.error[statusCode] ||
                          this.config.defaultTemplates.error.default;

    const engineName = options.engine || this.config.defaultEngine;
    const engine = this.engines[engineName];

    if (!engine) {
      // Fallback to a basic HTML error if engine not available
      return `<h1>Error ${statusCode}</h1><p>${errorMessage}</p>`;
    }

    try {
      return engine.render(templateName, {
        statusCode,
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : null
      });
    } catch (err) {
      this.logger.error(`Error rendering error template: ${err.message}`, err);
      return `<h1>Error ${statusCode}</h1><p>${errorMessage}</p>`;
    }
  }
}

export default TemplateRenderer;
