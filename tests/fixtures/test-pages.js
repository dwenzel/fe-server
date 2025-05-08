/**
 * Common test data for hierarchical routing tests
 * Using fixed UUIDs to make debugging easier and ensure test isolation
 */

// Test page IDs - consistent across all tests
export const rootId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
export const aboutId = 'c47ac10b-58cc-4372-a567-0e02b2c3d479';
export const teamId = 'a47ac10b-58cc-4372-a567-0e02b2c3d479';
export const productsId = 'b47ac10b-58cc-4372-a567-0e02b2c3d479';
export const productDetailId = 'd47ac10b-58cc-4372-a567-0e02b2c3d479';
export const itemId = 'eaaaaaaa-bbbb-cccc-dddd-222222222222';

// IDs for other tests
export const generalPageId = 'g47ac10b-58cc-4372-a567-0e02b2c3d479'; 
export const newsPageId = 'h47ac10b-58cc-4372-a567-0e02b2c3d479';
export const generalItemId = 'i47ac10b-58cc-4372-a567-0e02b2c3d479';

// Test pages
export const rootPage = {
  id: rootId,
  name: 'Root Page',
  isRoot: true,
  slug: '',
  metadata: {
    title: 'Root Page',
    description: 'Root page for testing',
    keywords: ['root', 'test']
  },
  attributes: {
    layout: 'default',
    visible: 1,
    status: 'Option1',
    author: 'Test Author', 
    category: 'Root Category'
  },
  items: []
};

export const aboutPage = {
  id: aboutId,
  name: 'Test Template Page', // Use consistent name across tests
  parent: rootId,
  slug: 'template-page',
  metadata: {
    title: 'Template Test Page',
    description: 'A test page for template rendering',
    keywords: ['test', 'template', 'rendering']
  },
  attributes: {
    layout: 'default',
    visible: 1,
    status: 'Option1',
    author: 'Test Author',
    category: 'Test Category'
  },
  items: []
};

export const teamPage = {
  id: teamId,
  name: 'Team Page',
  parent: aboutId,
  slug: 'team',
  metadata: {
    title: 'Our Team',
    description: 'Meet our awesome team',
    keywords: ['team', 'staff']
  },
  attributes: {
    layout: 'default',
    visible: 1,
    status: 'Option1',
    author: 'Team Author',
    category: 'Team Category'
  },
  items: []
};

export const productsPage = {
  id: productsId,
  name: 'Products Page',
  parent: rootId,
  slug: 'products',
  metadata: {
    title: 'Our Products',
    description: 'View our product catalog',
    keywords: ['products', 'catalog']
  },
  attributes: {
    layout: 'default',
    visible: 1,
    status: 'Option1',
    author: 'Products Author',
    category: 'Products Category'
  },
  items: []
};

export const productDetailPage = {
  id: productDetailId,
  name: 'Product X',
  parent: productsId,
  slug: 'product-x',
  metadata: {
    title: 'Product X Details',
    description: 'Details about Product X',
    keywords: ['product', 'details']
  },
  attributes: {
    layout: 'default',
    visible: 1,
    status: 'Option1',
    author: 'Product Author',
    category: 'Product Category'
  },
  items: []
};

export const testItem = {
  id: itemId,
  name: 'Test Template Item',
  parent: aboutId,
  type: 'dynamic',
  content: '<p>This is <strong>formatted</strong> content for template testing</p>',
  attributes: {
    position: 1,
    visibility: 'Option1',
    priority: 'high',
    status: 'Option1'
  }
};

// General test data for other functional tests
export const generalPage = {
  id: generalPageId,
  name: 'General Test Page',
  slug: 'general',
  parent: rootId,
  metadata: {
    title: 'General Test Page',
    description: 'A general test page for functional tests',
    keywords: ['test', 'general']
  },
  attributes: {
    layout: 'default',
    visible: 1,
    status: 'Option1',
    author: 'Test Author',
    category: 'General Category'
  },
  items: []
};

export const newsPage = {
  id: newsPageId,
  name: 'News Page',
  slug: 'news',
  parent: rootId,
  metadata: {
    title: 'News Page',
    description: 'News page for testing',
    keywords: ['news', 'test']
  },
  attributes: {
    layout: 'default',
    visible: 1,
    status: 'Option1',
    author: 'News Author',
    category: 'News Category'
  },
  items: []
};

export const generalItem = {
  id: generalItemId,
  name: 'General Test Item',
  parent: generalPageId,
  type: 'dynamic', // Use valid enum value from the schema
  content: '<p>This is a general test item</p>',
  attributes: {
    position: 1,
    visibility: 'Option1',
    priority: 'medium',
    status: 'Option1'
  }
};