/**
 * Unit tests for Repository classes
 */
import { Repository, PagesRepository, ItemsRepository } from '../../../../src/services/database/repository.js';
import { InMemoryAdapter } from '../../../../src/services/database/memory-adapter.js';
import { v4 as uuidv4 } from 'uuid';
import {afterEach, beforeEach, describe, expect, test} from "@jest/globals";

describe('Repository', () => {
  let adapter;
  let repository;
  const testId = uuidv4();

  beforeEach(async () => {
    adapter = new InMemoryAdapter();
    await adapter.connect();
    repository = new Repository('test-entity', adapter);
  });

  afterEach(async () => {
    await adapter.disconnect();
  });

  test('should create an entity', async () => {
    const data = { id: testId, name: 'Test Entity' };
    const id = await repository.create(data);

    expect(id).toBe(testId);
    expect(await repository.exists(testId)).toBe(true);
  });

  test('should get an entity by ID', async () => {
    const data = { id: testId, name: 'Test Entity' };
    await repository.create(data);

    const result = await repository.getById(testId);
    expect(result).toEqual(data);
  });

  test('should update an entity', async () => {
    const data = { id: testId, name: 'Test Entity' };
    await repository.create(data);

    const updatedData = { ...data, name: 'Updated Entity' };
    const result = await repository.update(testId, updatedData);

    expect(result).toBe(true);
    const storedEntity = await repository.getById(testId);
    expect(storedEntity.name).toBe('Updated Entity');
  });

  test('should delete an entity', async () => {
    const data = { id: testId, name: 'Test Entity' };
    await repository.create(data);

    const result = await repository.delete(testId);

    expect(result).toBe(true);
    expect(await repository.exists(testId)).toBe(false);
  });

  test('should get all entities', async () => {
    // Create multiple entities
    await repository.create({ id: uuidv4(), name: 'Entity 1', type: 'A' });
    await repository.create({ id: uuidv4(), name: 'Entity 2', type: 'A' });
    await repository.create({ id: uuidv4(), name: 'Entity 3', type: 'B' });

    // Get all entities
    const allEntities = await repository.getAll();
    expect(allEntities.length).toBe(3);

    // Get entities with query
    const typeAEntities = await repository.getAll({ type: 'A' });
    expect(typeAEntities.length).toBe(2);
    expect(typeAEntities[0].type).toBe('A');
  });
});

describe('PagesRepository', () => {
  let adapter;
  let pagesRepo;
  const rootPageId = uuidv4();
  const parentPageId = uuidv4();

  beforeEach(async () => {
    adapter = new InMemoryAdapter();
    await adapter.connect();
    pagesRepo = new PagesRepository(adapter);

    // Create test pages
    await pagesRepo.create({
      id: rootPageId,
      title: 'Root Page',
      isRoot: true,
      slug: ''
    });

    await pagesRepo.create({
      id: parentPageId,
      title: 'Parent Page',
      isRoot: false,
      parent: rootPageId,
      slug: 'parent'
    });

    await pagesRepo.create({
      id: uuidv4(),
      title: 'Child Page 1',
      isRoot: false,
      parent: parentPageId,
      slug: 'child1'
    });

    await pagesRepo.create({
      id: uuidv4(),
      title: 'Child Page 2',
      isRoot: false,
      parent: parentPageId,
      slug: 'child2'
    });
  });

  afterEach(async () => {
    await adapter.disconnect();
  });

  test('should find the root page', async () => {
    const rootPage = await pagesRepo.findRootPage();

    expect(rootPage).not.toBeNull();
    expect(rootPage.isRoot).toBe(true);
    expect(rootPage.id).toBe(rootPageId);
  });

  test('should find child pages', async () => {
    const childPages = await pagesRepo.findChildPages(parentPageId);

    expect(childPages.length).toBe(2);
    expect(childPages[0].parent).toBe(parentPageId);
    expect(childPages[1].parent).toBe(parentPageId);
  });

  test('should check if a page has children', async () => {
    const hasChildren = await pagesRepo.hasChildren(parentPageId);
    const noChildren = await pagesRepo.hasChildren(uuidv4()); // Non-existent page

    expect(hasChildren).toBe(true);
    expect(noChildren).toBe(false);
  });
});

describe('ItemsRepository', () => {
  let adapter;
  let itemsRepo;

  beforeEach(async () => {
    adapter = new InMemoryAdapter();
    await adapter.connect();
    itemsRepo = new ItemsRepository(adapter);

    // Create test items
    await itemsRepo.create({
      id: uuidv4(),
      title: 'News Item 1',
      type: 'news',
      content: 'News content'
    });

    await itemsRepo.create({
      id: uuidv4(),
      title: 'News Item 2',
      type: 'news',
      content: 'More news'
    });

    await itemsRepo.create({
      id: uuidv4(),
      title: 'Project Item',
      type: 'project',
      description: 'Project description'
    });

    await itemsRepo.create({
      id: uuidv4(),
      title: 'Event Item',
      type: 'event',
      date: '2023-05-15'
    });
  });

  afterEach(async () => {
    await adapter.disconnect();
  });

  test('should find items by type', async () => {
    const newsItems = await itemsRepo.findByType('news');
    const projectItems = await itemsRepo.findByType('project');
    const nonExistentType = await itemsRepo.findByType('non-existent');

    expect(newsItems.length).toBe(2);
    expect(newsItems[0].type).toBe('news');

    expect(projectItems.length).toBe(1);
    expect(projectItems[0].type).toBe('project');

    expect(nonExistentType.length).toBe(0);
  });
});
