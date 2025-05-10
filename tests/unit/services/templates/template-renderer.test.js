import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import TemplateRenderer from '../../../../src/services/templates/template-renderer.js';

// Mock dependencies
jest.mock('../../../../src/services/templates/handlebars-adapter.js');
jest.mock('../../../../src/services/templates/pug-adapter.js');
jest.mock('../../../../src/services/templates/mustache-adapter.js');
jest.mock('fs');

// Import mocks
import HandlebarsAdapter from '../../../../src/services/templates/handlebars-adapter.js';
import PugAdapter from '../../../../src/services/templates/pug-adapter.js';
import MustacheAdapter from '../../../../src/services/templates/mustache-adapter.js';
import fs from 'fs';

describe('TemplateRenderer', () => {
  // Test configuration
  const mockConfig = {
    defaultEngine: 'handlebars',
    enabledEngines: ['handlebars', 'pug', 'mustache'],
    templatePaths: {
      handlebars: '/templates/handlebars',
      pug: '/templates/pug',
      mustache: '/templates/mustache'
    },
    defaultTemplates: {
      page: {
        default: 'pages/default',
        dynamic: 'pages/dynamic'
      },
      item: {
        default: 'items/default',
        list: 'items/list'
      },
      error: {
        default: 'errors/default',
        '404': 'errors/404'
      }
    },
    contentTypeMap: {
      'dynamic': 'handlebars',
      'list': 'pug',
      'news': 'mustache'
    }
  };

  // Mock logger
  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  };

  // Mock adapter instances
  let handlebarsAdapter;
  let pugAdapter;
  let mustacheAdapter;
  let templateRenderer;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock implementations
    fs.existsSync.mockImplementation(() => true);
    fs.mkdirSync.mockImplementation(() => undefined);
    
    // Create mock adapter instances
    handlebarsAdapter = {
      render: jest.fn().mockReturnValue('<div>Handlebars rendered content</div>')
    };
    
    pugAdapter = {
      render: jest.fn().mockReturnValue('<div>Pug rendered content</div>')
    };
    
    mustacheAdapter = {
      render: jest.fn().mockReturnValue('<div>Mustache rendered content</div>')
    };
    
    // Configure mock constructors
    HandlebarsAdapter.mockImplementation(() => handlebarsAdapter);
    PugAdapter.mockImplementation(() => pugAdapter);
    MustacheAdapter.mockImplementation(() => mustacheAdapter);
    
    // Create template renderer instance
    templateRenderer = new TemplateRenderer(mockConfig, mockLogger);
  });

  describe('initialization', () => {
    test('should initialize with the provided config', () => {
      expect(templateRenderer.config).toBe(mockConfig);
      expect(templateRenderer.logger).toBe(mockLogger);
      expect(HandlebarsAdapter).toHaveBeenCalledWith(mockConfig, mockLogger);
      expect(PugAdapter).toHaveBeenCalledWith(mockConfig, mockLogger);
      expect(MustacheAdapter).toHaveBeenCalledWith(mockConfig, mockLogger);
    });

    test('should log initialization of engines', () => {
      expect(mockLogger.info).toHaveBeenCalledWith('Initialized template engine: handlebars');
      expect(mockLogger.info).toHaveBeenCalledWith('Initialized template engine: pug');
      expect(mockLogger.info).toHaveBeenCalledWith('Initialized template engine: mustache');
    });
  });

  describe('determineTemplate', () => {
    test('should use template from content if specified', () => {
      const content = { template: 'custom-template' };
      const result = templateRenderer.determineTemplate(content, 'page');
      expect(result).toBe('custom-template');
    });

    test('should use default template based on content type', () => {
      const content = { type: 'dynamic' };
      const result = templateRenderer.determineTemplate(content, 'page');
      expect(result).toBe('pages/dynamic');
    });

    test('should fallback to default template if content type is not matched', () => {
      const content = { type: 'unknown-type' };
      const result = templateRenderer.determineTemplate(content, 'page');
      expect(result).toBe('pages/default');
    });
  });

  describe('determineEngine', () => {
    test('should use engine from options if specified', () => {
      const content = {};
      const templateName = 'template';
      const options = { engine: 'pug' };
      const result = templateRenderer.determineEngine(content, templateName, options);
      expect(result).toBe('pug');
    });

    test('should use preferred engine from content if specified', () => {
      const content = { preferredEngine: 'mustache' };
      const result = templateRenderer.determineEngine(content, 'template');
      expect(result).toBe('mustache');
    });

    test('should use engine from content type mapping if available', () => {
      const content = { type: 'dynamic' };
      const result = templateRenderer.determineEngine(content, 'template');
      expect(result).toBe('handlebars');
    });

    test('should determine engine from template name extension', () => {
      const content = {};
      const result = templateRenderer.determineEngine(content, 'template.pug');
      expect(result).toBe('pug');
    });

    test('should fallback to default engine if no other criteria matches', () => {
      const content = {};
      const result = templateRenderer.determineEngine(content, 'template');
      expect(result).toBe('handlebars');
    });
  });

  describe('renderContent', () => {
    test('should render page content with the appropriate engine', () => {
      const content = { name: 'Test Page', type: 'dynamic' };
      const result = templateRenderer.renderContent(content, 'page');
      
      expect(handlebarsAdapter.render).toHaveBeenCalled();
      expect(result).toBe('<div>Handlebars rendered content</div>');
    });

    test('should render item content with the appropriate engine', () => {
      const content = { name: 'Test Item', type: 'list' };
      const result = templateRenderer.renderContent(content, 'item');
      
      expect(pugAdapter.render).toHaveBeenCalled();
      expect(result).toBe('<div>Pug rendered content</div>');
    });

    test('should transform data for templates', () => {
      const content = { 
        name: 'Test Content',
        metadata: { title: 'Test Title', description: 'Test Description' }
      };
      
      templateRenderer.renderContent(content, 'page');
      
      // Extract the transformed data argument from the render call
      const transformedData = handlebarsAdapter.render.mock.calls[0][1];
      
      expect(transformedData.meta.title).toBe('Test Title');
      expect(transformedData.meta.description).toBe('Test Description');
      expect(transformedData.helpers).toBeDefined();
    });

    test('should throw an error if the engine is not available', () => {
      // Create a renderer with no enabled engines
      const emptyRenderer = new TemplateRenderer({
        ...mockConfig,
        enabledEngines: []
      }, mockLogger);
      
      expect(() => {
        emptyRenderer.renderContent({ name: 'Test' }, 'page');
      }).toThrow('Template engine not available');
    });

    test('should handle errors in rendering', () => {
      handlebarsAdapter.render.mockImplementation(() => {
        throw new Error('Rendering error');
      });
      
      expect(() => {
        templateRenderer.renderContent({ name: 'Test' }, 'page');
      }).toThrow('Rendering error');
      
      expect(mockLogger.error).toHaveBeenCalled();
    });

    test('should attempt to render error template if provided', () => {
      handlebarsAdapter.render.mockImplementationOnce(() => {
        throw new Error('Rendering error');
      });
      
      try {
        templateRenderer.renderContent({ name: 'Test' }, 'page', {
          errorTemplate: 'errors/default'
        });
      } catch (error) {
        // Error is still thrown after attempting to render error template
      }
      
      // Verify that it tried to render the error template
      expect(handlebarsAdapter.render).toHaveBeenCalledWith(
        expect.stringContaining('errors/default'),
        expect.objectContaining({ error: expect.any(String) })
      );
    });
  });

  describe('helper methods', () => {
    test('renderPage should call renderContent with page type', () => {
      const spy = jest.spyOn(templateRenderer, 'renderContent');
      const page = { name: 'Test Page' };
      
      templateRenderer.renderPage(page);
      
      expect(spy).toHaveBeenCalledWith(page, 'page', expect.objectContaining({
        errorTemplate: expect.any(String)
      }));
    });

    test('renderItem should call renderContent with item type', () => {
      const spy = jest.spyOn(templateRenderer, 'renderContent');
      const item = { name: 'Test Item' };
      
      templateRenderer.renderItem(item);
      
      expect(spy).toHaveBeenCalledWith(item, 'item', expect.objectContaining({
        errorTemplate: expect.any(String)
      }));
    });

    test('renderError should render an error page', () => {
      const error = new Error('Test error');
      templateRenderer.renderError(error, 404);

      expect(handlebarsAdapter.render).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          statusCode: 404,
          message: 'Test error'
        })
      );
    });
  });
});