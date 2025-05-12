/**
 * Unit tests for InMemoryAdapter
 */
import { InMemoryAdapter } from '../../../../src/services/database/memory-adapter.js';
import { v4 as uuidv4 } from 'uuid';

describe('InMemoryAdapter', () => {
  let adapter;
  const testPageId = uuidv4();
  const testItemId = uuidv4();
  
  beforeEach(async () => {
    adapter = new InMemoryAdapter();
    await adapter.connect();
  });
  
  afterEach(async () => {
    await adapter.disconnect();
  });
  
  describe('basic CRUD operations', () => {
    test('should create a page', async () => {
      const page = { id: testPageId, title: 'Test Page', isRoot: true, slug: '' };
      const id = await adapter.create('pages', page);
      
      expect(id).toBe(testPageId);
      expect(await adapter.exists('pages', testPageId)).toBe(true);
    });
    
    test('should read a page', async () => {
      const page = { id: testPageId, title: 'Test Page', isRoot: true, slug: '' };
      await adapter.create('pages', page);
      
      const result = await adapter.read('pages', testPageId);
      expect(result).toEqual(page);
    });
    
    test('should return null when reading non-existent page', async () => {
      const result = await adapter.read('pages', 'non-existent-id');
      expect(result).toBeNull();
    });
    
    test('should update a page', async () => {
      const page = { id: testPageId, title: 'Test Page', isRoot: true, slug: '' };
      await adapter.create('pages', page);
      
      const updatedPage = { ...page, title: 'Updated Title' };
      const result = await adapter.update('pages', testPageId, updatedPage);
      
      expect(result).toBe(true);
      const storedPage = await adapter.read('pages', testPageId);
      expect(storedPage.title).toBe('Updated Title');
    });
    
    test('should return false when updating non-existent page', async () => {
      const result = await adapter.update('pages', 'non-existent-id', {});
      expect(result).toBe(false);
    });
    
    test('should delete a page', async () => {
      const page = { id: testPageId, title: 'Test Page' };
      await adapter.create('pages', page);
      
      const result = await adapter.delete('pages', testPageId);
      
      expect(result).toBe(true);
      expect(await adapter.exists('pages', testPageId)).toBe(false);
    });
    
    test('should return false when deleting non-existent page', async () => {
      const result = await adapter.delete('pages', 'non-existent-id');
      expect(result).toBe(false);
    });
  });
  
  describe('query operations', () => {
    beforeEach(async () => {
      // Create test data
      await adapter.create('pages', { id: uuidv4(), title: 'Page 1', isRoot: true, slug: '' });
      await adapter.create('pages', { id: uuidv4(), title: 'Page 2', isRoot: false, parent: testPageId, slug: 'page2' });
      await adapter.create('pages', { id: uuidv4(), title: 'Page 3', isRoot: false, parent: testPageId, slug: 'page3' });
      
      await adapter.create('items', { id: testItemId, title: 'Item 1', type: 'news' });
      await adapter.create('items', { id: uuidv4(), title: 'Item 2', type: 'news' });
      await adapter.create('items', { id: uuidv4(), title: 'Item 3', type: 'project' });
    });
    
    test('should find all records in a collection', async () => {
      const pages = await adapter.find('pages');
      const items = await adapter.find('items');
      
      expect(pages.length).toBe(3);
      expect(items.length).toBe(3);
    });
    
    test('should find records by simple query', async () => {
      const newsItems = await adapter.find('items', { type: 'news' });
      expect(newsItems.length).toBe(2);
      expect(newsItems[0].type).toBe('news');
      
      const rootPages = await adapter.find('pages', { isRoot: true });
      expect(rootPages.length).toBe(1);
      expect(rootPages[0].isRoot).toBe(true);
    });
    
    test('should find records by complex query with operators', async () => {
      // Create items with numeric properties for testing
      await adapter.create('items', { id: uuidv4(), price: 10, inStock: true });
      await adapter.create('items', { id: uuidv4(), price: 20, inStock: true });
      await adapter.create('items', { id: uuidv4(), price: 30, inStock: false });
      
      // Test $eq operator
      const exactPrice = await adapter.find('items', { price: { $eq: 20 } });
      expect(exactPrice.length).toBe(1);
      expect(exactPrice[0].price).toBe(20);
      
      // Test $gt operator
      const expensiveItems = await adapter.find('items', { price: { $gt: 15 } });
      expect(expensiveItems.length).toBe(2);
      
      // Test $in operator
      const specificItems = await adapter.find('items', { price: { $in: [10, 30] } });
      expect(specificItems.length).toBe(2);
    });
    
    test('should sort and paginate results', async () => {
      // Create more items for pagination testing
      for (let i = 4; i <= 10; i++) {
        await adapter.create('items', { 
          id: uuidv4(), 
          title: `Item ${i}`, 
          sortOrder: i // Make sure sortOrder is explicitly set
        });
      }
      
      // Test sorting - find items specifically with sortOrder
      const sortedItems = await adapter.find(
        'items', 
        { sortOrder: { $gt: 0 } }, // Find items that have sortOrder
        { sort: { field: 'sortOrder', order: 'desc' } }
      );
      
      expect(sortedItems.length).toBeGreaterThan(0);
      expect(sortedItems[0].sortOrder).toBe(10);
      
      // Test pagination
      const paginatedItems = await adapter.find('items', {}, { skip: 2, limit: 3 });
      expect(paginatedItems.length).toBe(3);
    });
  });
  
  describe('transactions', () => {
    test('should support transaction commit', async () => {
      const transaction = await adapter.beginTransaction();
      
      // Create a page within transaction
      await adapter.create('pages', { id: testPageId, title: 'Transaction Test' });
      
      // Commit the transaction
      await adapter.commitTransaction(transaction);
      
      // Page should exist after commit
      expect(await adapter.exists('pages', testPageId)).toBe(true);
    });
    
    test('should support transaction rollback', async () => {
      const transaction = await adapter.beginTransaction();
      
      // Create a page within transaction
      await adapter.create('pages', { id: testPageId, title: 'Transaction Test' });
      
      // Verify the page exists before rollback
      expect(await adapter.exists('pages', testPageId)).toBe(true);
      
      // Rollback the transaction
      await adapter.rollbackTransaction(transaction);
      
      // Page should not exist after rollback
      expect(await adapter.exists('pages', testPageId)).toBe(false);
    });
  });
  
  describe('error cases', () => {
    test('should throw error when performing operations without connecting', async () => {
      const disconnectedAdapter = new InMemoryAdapter();
      
      await expect(disconnectedAdapter.create('pages', {}))
        .rejects.toThrow('Database adapter is not connected');
    });
  });
});