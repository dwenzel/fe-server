/**
 * Pug template engine adapter
 */
import fs from 'fs';
import path from 'path';
import pug from 'pug';

class PugAdapter {
  /**
   * Create a new PugAdapter instance
   * @param {Object} config - Configuration object
   * @param {Object} logger - Logger instance
   */
  constructor(config, logger) {
    this.engine = pug;
    this.config = config;
    this.logger = logger;
    this.templateCache = {};
    this.templatePath = config.templatePaths.pug;
    
    // Get engine options
    this.options = {
      ...config.engineOptions?.pug,
      basedir: this.templatePath
    };
  }

  /**
   * Get template file path
   * @param {string} templateName - Template name
   * @returns {string} - Full template file path
   */
  getTemplatePath(templateName) {
    // Add .pug extension if not present
    if (!templateName.endsWith('.pug')) {
      templateName = `${templateName}.pug`;
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
      this.logger.error(`Error loading Pug template: ${templatePath}`, err);
      throw new Error(`Template not found: ${templateName}`);
    }
  }

  /**
   * Compile a template
   * @param {string} templateSource - Template source
   * @param {string} filename - Template filename for includes
   * @returns {Function} - Compiled template function
   */
  compile(templateSource, filename) {
    try {
      return this.engine.compile(templateSource, {
        ...this.options,
        filename
      });
    } catch (err) {
      this.logger.error(`Error compiling Pug template`, err);
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
    const useCache = this.options.cache !== false;
    
    if (useCache && this.templateCache[templateName]) {
      return this.templateCache[templateName];
    }
    
    // For Pug we can use the built-in compileFile function
    const templatePath = this.getTemplatePath(templateName);
    
    try {
      const compiled = this.engine.compileFile(templatePath, this.options);
      
      // Cache the compiled template if caching is enabled
      if (useCache) {
        this.templateCache[templateName] = compiled;
      }
      
      return compiled;
    } catch (err) {
      this.logger.error(`Error compiling Pug template: ${templatePath}`, err);
      throw new Error(`Template compilation error: ${err.message}`);
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
      const template = this.getCompiledTemplate(templateName);
      
      // Check if the template already has an extends clause (layout)
      return template({
        ...data,
        basedir: this.templatePath // Make sure includes work
      });
    } catch (err) {
      this.logger.error(`Error rendering Pug template: ${templateName}`, err);
      throw new Error(`Template rendering error: ${err.message}`);
    }
  }
}

export default PugAdapter;