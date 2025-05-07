/**
 * Handlebars template engine adapter
 */
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

class HandlebarsAdapter {
  /**
   * Create a new HandlebarsAdapter instance
   * @param {Object} config - Configuration object
   * @param {Object} logger - Logger instance
   */
  constructor(config, logger) {
    this.engine = Handlebars;
    this.config = config;
    this.logger = logger;
    this.templateCache = {};
    this.partialsCache = {};
    this.templatePath = config.templatePaths.handlebars;
    
    this.setupHelpers(config.engineOptions?.handlebars?.helpers || {});
  }

  /**
   * Register Handlebars helpers
   * @param {Object} helpers - Map of helper name to helper function
   */
  setupHelpers(helpers) {
    Object.entries(helpers).forEach(([name, fn]) => {
      this.engine.registerHelper(name, fn);
    });
  }

  /**
   * Get template file path
   * @param {string} templateName - Template name
   * @returns {string} - Full template file path
   */
  getTemplatePath(templateName) {
    // Add .hbs extension if not present
    if (!templateName.endsWith('.hbs')) {
      templateName = `${templateName}.hbs`;
    }
    
    return path.resolve(this.templatePath, templateName);
  }

  /**
   * Load a template from file
   * @param {string} templateName - Template name
   * @returns {string} - Template source
   */
  loadTemplate(templateName) {
    const templatePath = this.getTemplatePath(templateName);
    
    try {
      return fs.readFileSync(templatePath, 'utf8');
    } catch (err) {
      this.logger.error(`Error loading Handlebars template: ${templatePath}`, err);
      throw new Error(`Template not found: ${templateName}`);
    }
  }

  /**
   * Compile a template
   * @param {string} templateSource - Template source
   * @param {Object} options - Compilation options
   * @returns {Function} - Compiled template function
   */
  compile(templateSource, options = {}) {
    try {
      return this.engine.compile(templateSource, options);
    } catch (err) {
      this.logger.error(`Error compiling Handlebars template`, err);
      throw new Error(`Template compilation error: ${err.message}`);
    }
  }

  /**
   * Get or create a compiled template
   * @param {string} templateName - Template name
   * @returns {Function} - Compiled template function
   */
  getCompiledTemplate(templateName) {
    // Use cached template if available and caching is enabled
    const useCache = this.config.engineOptions?.handlebars?.cache !== false;
    
    if (useCache && this.templateCache[templateName]) {
      return this.templateCache[templateName];
    }
    
    // Load and compile the template
    const source = this.loadTemplate(templateName);
    const compiled = this.compile(source);
    
    // Cache the compiled template if caching is enabled
    if (useCache) {
      this.templateCache[templateName] = compiled;
    }
    
    return compiled;
  }

  /**
   * Register partials from a directory
   * @param {string} partialsDir - Path to partials directory
   */
  registerPartials(partialsDir = 'partials') {
    try {
      const fullPartialsDir = path.join(this.templatePath, partialsDir);
      if (fs.existsSync(fullPartialsDir)) {
        const partialFiles = fs.readdirSync(fullPartialsDir);
        
        partialFiles.forEach(file => {
          if (file.endsWith('.hbs')) {
            const partialName = path.basename(file, '.hbs');
            const partialPath = path.join(fullPartialsDir, file);
            const partialSource = fs.readFileSync(partialPath, 'utf8');
            
            this.engine.registerPartial(partialName, partialSource);
            this.logger.info(`Registered Handlebars partial: ${partialName}`);
          }
        });
      }
    } catch (err) {
      this.logger.warn(`Error registering Handlebars partials: ${err.message}`);
    }
  }

  /**
   * Render a template with data
   * @param {string} templateName - Template name
   * @param {Object} data - Data to render the template with
   * @param {Object} options - Rendering options
   * @returns {string} - Rendered template
   */
  render(templateName, data, options = {}) {
    try {
      // Register any partials
      this.registerPartials();
      
      // Get the template
      const template = this.getCompiledTemplate(templateName);
      
      // If layout is specified, use it
      if (options.layout !== false) {
        // Get the layout name from options or use default 'main'
        const layoutName = options.layout || 'layouts/main';
        
        try {
          const layoutTemplate = this.getCompiledTemplate(layoutName);
          
          // Render the content first
          const content = template(data);
          
          // Then render the layout with the content
          return layoutTemplate({
            ...data,
            body: content
          });
        } catch (layoutErr) {
          this.logger.warn(`Layout ${layoutName} not found, using template directly`);
          return template(data);
        }
      }
      
      // No layout, render the template directly
      return template(data);
    } catch (err) {
      this.logger.error(`Error rendering Handlebars template: ${templateName}`, err);
      throw new Error(`Template rendering error: ${err.message}`);
    }
  }
}

export default HandlebarsAdapter;