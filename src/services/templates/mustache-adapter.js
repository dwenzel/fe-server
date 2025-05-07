/**
 * Mustache template engine adapter
 */
import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

class MustacheAdapter {
  /**
   * Create a new MustacheAdapter instance
   * @param {Object} config - Configuration object
   * @param {Object} logger - Logger instance
   */
  constructor(config, logger) {
    this.engine = Mustache;
    this.config = config;
    this.logger = logger;
    this.templateCache = {};
    this.partialsCache = {};
    this.templatePath = config.templatePaths.mustache;
    
    // Configure Mustache
    this.options = config.engineOptions?.mustache || {};
    
    // Disable HTML escaping if specified in config
    if (this.options.escape === false) {
      this.engine.escape = (text) => text;
    }
  }

  /**
   * Get template file path
   * @param {string} templateName - Template name
   * @returns {string} - Full template file path
   */
  getTemplatePath(templateName) {
    // Add .mustache extension if not present
    if (!templateName.endsWith('.mustache')) {
      templateName = `${templateName}.mustache`;
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
      this.logger.error(`Error loading Mustache template: ${templatePath}`, err);
      throw new Error(`Template not found: ${templateName}`);
    }
  }

  /**
   * Get template source with optional caching
   * @param {string} templateName - Template name
   * @returns {string} - Template source
   */
  getTemplateSource(templateName) {
    // Use cached template if available and caching is enabled
    const useCache = this.options.cache !== false;
    
    if (useCache && this.templateCache[templateName]) {
      return this.templateCache[templateName];
    }
    
    // Load the template
    const source = this.loadTemplate(templateName);
    
    // Cache the template source if caching is enabled
    if (useCache) {
      this.templateCache[templateName] = source;
    }
    
    return source;
  }

  /**
   * Load partials recursively
   * @param {string} partialsPath - Base path for partials
   * @returns {Object} - Map of partial names to their content
   */
  loadPartials(partialsPath) {
    const partials = {};
    const partialsDir = path.join(this.templatePath, partialsPath);
    
    try {
      const files = fs.readdirSync(partialsDir);
      
      files.forEach(file => {
        if (file.endsWith('.mustache')) {
          const partialName = path.basename(file, '.mustache');
          const partialPath = path.join(partialsDir, file);
          partials[partialName] = fs.readFileSync(partialPath, 'utf8');
        }
      });
      
      return partials;
    } catch (err) {
      this.logger.warn(`Could not load Mustache partials from: ${partialsPath}`, err);
      return {};
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
      const template = this.getTemplateSource(templateName);
      
      // Load partials 
      const partialsPath = options.partialsPath || 'partials';
      const partials = this.loadPartials(partialsPath);
      
      // Mustache uses partials for layout functionality
      // The header and footer partials combine to create a layout
      // Render the template with partials
      return this.engine.render(template, data, partials);
    } catch (err) {
      this.logger.error(`Error rendering Mustache template: ${templateName}`, err);
      throw new Error(`Template rendering error: ${err.message}`);
    }
  }
}

export default MustacheAdapter;