#!/usr/bin/env node

/**
 * Import test data tool
 * 
 * This script imports test fixture data into a running server instance.
 * It reads from the test fixtures directory and sends the data to the server
 * using the appropriate API endpoints.
 * 
 * Usage: 
 *   node tools/import-data.js [options]
 * 
 * Options:
 *   --host     Server host (default: http://localhost)
 *   --port     Server port (default: 8080)
 *   --key      API key (default: test-api-key)
 *   --pages    Path to pages fixture file (default: tests/fixtures/pages.json)
 *   --items    Path to items fixture file (default: tests/fixtures/items.json)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get the directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  host: 'http://localhost',
  port: 8080,
  key: 'test-api-key',
  pages: path.join(projectRoot, 'tests/fixtures/pages.json'),
  items: path.join(projectRoot, 'tests/fixtures/items.json')
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg.startsWith('--')) {
    const option = arg.substring(2);
    const value = args[++i];
    
    if (options.hasOwnProperty(option)) {
      options[option] = value;
    }
  }
}

// Log configuration
console.log('Import configuration:');
console.log(`- Server: ${options.host}:${options.port}`);
console.log(`- API Key: ${options.key.substring(0, 4)}...`);
console.log(`- Pages fixture: ${options.pages}`);
console.log(`- Items fixture: ${options.items}`);
console.log('\n');

// Load fixture data
let pages = [];
let items = [];

try {
  const pagesData = fs.readFileSync(options.pages, 'utf8');
  pages = JSON.parse(pagesData);
  console.log(`Loaded ${pages.length} pages from fixture`);
} catch (error) {
  console.error(`Error loading pages fixture: ${error.message}`);
  process.exit(1);
}

try {
  const itemsData = fs.readFileSync(options.items, 'utf8');
  items = JSON.parse(itemsData);
  console.log(`Loaded ${items.length} items from fixture`);
} catch (error) {
  console.error(`Error loading items fixture: ${error.message}`);
  process.exit(1);
}

/**
 * Send data to server
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to send
 * @returns {Promise<Object>} - Server response
 */
async function sendToServer(endpoint, data) {
  const url = `${options.host}:${options.port}/backend/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': options.key
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error sending data to ${endpoint}: ${error.message}`);
    return null;
  }
}

/**
 * Import data in the correct order
 */
async function importData() {
  // First import all pages
  console.log('Importing pages...');
  const pageResults = [];
  
  for (const page of pages) {
    console.log(`- Importing page "${page.name}" (${page.id})`);
    const result = await sendToServer('pages', page);
    pageResults.push({
      id: page.id,
      name: page.name,
      success: !!result
    });
  }
  
  // Then import all items (which may reference pages as parents)
  console.log('\nImporting items...');
  const itemResults = [];
  
  for (const item of items) {
    console.log(`- Importing item "${item.name}" (${item.id}), parent: ${item.parent}`);
    const result = await sendToServer('items', item);
    itemResults.push({
      id: item.id,
      name: item.name,
      success: !!result
    });
  }
  
  // Summary
  console.log('\nImport Results:');
  console.log('---------------');
  console.log(`Pages: ${pageResults.filter(r => r.success).length}/${pages.length} imported successfully`);
  console.log(`Items: ${itemResults.filter(r => r.success).length}/${items.length} imported successfully`);
  
  // List failures if any
  const failedPages = pageResults.filter(r => !r.success);
  const failedItems = itemResults.filter(r => !r.success);
  
  if (failedPages.length > 0 || failedItems.length > 0) {
    console.log('\nFailed imports:');
    
    if (failedPages.length > 0) {
      console.log('Pages:');
      failedPages.forEach(p => console.log(`- ${p.name} (${p.id})`));
    }
    
    if (failedItems.length > 0) {
      console.log('Items:');
      failedItems.forEach(i => console.log(`- ${i.name} (${i.id})`));
    }
  } else {
    console.log('\nAll data imported successfully!');
  }
}

// Run the import
importData().catch(error => {
  console.error(`Import failed: ${error.message}`);
  process.exit(1);
});