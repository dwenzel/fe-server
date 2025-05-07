# Test Fixtures

This directory contains JSON fixtures used for testing the API endpoints.

## Files

### pages.json
Contains sample page objects with the following structure:
- `id`: UUID for the page
- `name`: Display name of the page
- `attributes`: Object containing page attributes
- `metadata`: SEO and page metadata
- `parent`: (Optional) Parent page UUID

### items.json
Contains sample item objects with the following structure:
- `id`: UUID for the item
- `parent`: UUID of the parent page or item
- `type`: Item type (dynamic, list, news, project, event)
- `name`: Display name of the item
- `attributes`: Object containing item attributes
- `content`: Content text for the item

## Usage

These fixtures can be used in tests to verify API functionality without needing to create new test data for each test run.

Example usage in a test file:
```javascript
const pages = require('../fixtures/pages.json');
const items = require('../fixtures/items.json');

describe('API Tests', () => {
  it('should return a valid page', async () => {
    // Use the first page from the fixtures
    const testPage = pages[0];
    // Test code...
  });
});
```