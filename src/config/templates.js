/**
 * Template rendering configuration
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseTemplateDir = path.join(__dirname, '../../templates');

export default {
  // Default template engine to use when not specified
  defaultEngine: 'handlebars',
  
  // Enabled template engines
  enabledEngines: ['handlebars', 'pug', 'mustache'],
  
  // Template directory paths for each engine
  templatePaths: {
    handlebars: path.join(baseTemplateDir, 'handlebars'),
    pug: path.join(baseTemplateDir, 'pug'),
    mustache: path.join(baseTemplateDir, 'mustache')
  },
  
  // Engine-specific options
  engineOptions: {
    handlebars: {
      cache: true,
      helpers: {
        // Example helpers
        uppercase: (str) => str.toUpperCase(),
        lowercase: (str) => str.toLowerCase(),
        json: (obj) => JSON.stringify(obj, null, 2),
        // Comparison helpers
        lt: (a, b) => a < b,
        gt: (a, b) => a > b,
        eq: (a, b) => a === b,
        // String helpers
        truncate: (str, len) => (typeof str === 'string' ? (str.length > len ? str.substring(0, len) : str) : '')
      }
    },
    pug: {
      pretty: process.env.NODE_ENV !== 'production',
      cache: true
    },
    mustache: {
      cache: true
    }
  },
  
  // Map content types to template engines
  contentTypeMap: {
    'dynamic': 'handlebars',
    'list': 'handlebars',
    'news': 'pug',
    'project': 'pug',
    'event': 'mustache'
  },
  
  // Default templates for different content types
  defaultTemplates: {
    page: {
      default: 'pages/default',
      dynamic: 'pages/dynamic',
      news: 'pages/news',
      project: 'pages/project',
      event: 'pages/event'
    },
    item: {
      default: 'items/default',
      dynamic: 'items/dynamic',
      list: 'items/list',
      news: 'items/news',
      project: 'items/project',
      event: 'items/event'
    },
    error: {
      'default': 'errors/default',
      '404': 'errors/404',
      '500': 'errors/500'
    }
  }
};