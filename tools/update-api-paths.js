#!/usr/bin/env node

/**
 * Update API paths in test files
 * 
 * This script updates the API paths in test files from the old format
 * (/backend/*, /frontend/*) to the new versioned format (/api/v1/backend/*, /api/v1/frontend/*)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../src/config.js';

// Get the directory name for ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testsDir = path.join(__dirname, '..', 'tests');

// Files to update (all functional test files)
const testFiles = [
  path.join(testsDir, 'functional', 'frontend.test.js'),
  path.join(testsDir, 'functional', 'auth.test.js'),
  path.join(testsDir, 'functional', 'items.test.js'),
  path.join(testsDir, 'functional', 'pages.test.js'),
  path.join(testsDir, 'functional', 'template-rendering.test.js'),
  path.join(testsDir, 'functional', 'integration.test.js'),
  path.join(testsDir, 'functional', 'schema-validation.test.js'),
  path.join(testsDir, 'functional', 'openapi-spec.test.js')
];

// Version prefix
const apiVersionPrefix = `/api/${config.api.version}`;

// Process each file
let totalUpdates = 0;

for (const filePath of testFiles) {
  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    let fileUpdates = 0;
    
    // Replace frontend paths
    const frontendRegex = /(["'`])(\/frontend\/[^"'`]*)(["'`])/g;
    content = content.replace(frontendRegex, (match, prefix, path, suffix) => {
      fileUpdates++;
      return `${prefix}${apiVersionPrefix}${path}${suffix}`;
    });
    
    // Replace backend paths
    const backendRegex = /(["'`])(\/backend\/[^"'`]*)(["'`])/g;
    content = content.replace(backendRegex, (match, prefix, path, suffix) => {
      fileUpdates++;
      return `${prefix}${apiVersionPrefix}${path}${suffix}`;
    });
    
    // Replace health and version endpoints
    const healthRegex = /(["'`])(\/health)(["'`])/g;
    content = content.replace(healthRegex, (match, prefix, path, suffix) => {
      fileUpdates++;
      return `${prefix}${apiVersionPrefix}${path}${suffix}`;
    });
    
    const versionRegex = /(["'`])(\/version)(["'`])/g;
    content = content.replace(versionRegex, (match, prefix, path, suffix) => {
      fileUpdates++;
      return `${prefix}${apiVersionPrefix}${path}${suffix}`;
    });
    
    // Write the updated content back to the file
    if (fileUpdates > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalUpdates += fileUpdates;
      console.log(`Updated ${fileUpdates} paths in ${path.basename(filePath)}`);
    } else {
      console.log(`No changes needed in ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

console.log(`\nTotal updates: ${totalUpdates}`);
console.log('Done!');