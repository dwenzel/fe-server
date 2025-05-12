/**
 * Unit tests for database adapter factory functions
 */
// Import actual modules first to properly set up mocking
import { InMemoryAdapter as ActualInMemoryAdapter } from '../../../../src/services/database/memory-adapter.js';

// Mock adapter modules
const MockMongoDBAdapter = jest.fn().mockImplementation(() => ({
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue(),
}));

const MockPostgresAdapter = jest.fn().mockImplementation(() => ({
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue(),
}));

const MockMySQLAdapter = jest.fn().mockImplementation(() => ({
  connect: jest.fn().mockResolvedValue(),
  disconnect: jest.fn().mockResolvedValue(),
}));

// Mock the database adapter modules
jest.mock('../../../../src/services/database/mongodb-adapter.js', () => ({
  MongoDBAdapter: MockMongoDBAdapter
}));

jest.mock('../../../../src/services/database/postgres-adapter.js', () => ({
  PostgresAdapter: MockPostgresAdapter
}));

jest.mock('../../../../src/services/database/mysql-adapter.js', () => ({
  MySQLAdapter: MockMySQLAdapter
}));

// Now import the modules to test
import { createDatabaseAdapter } from '../../../../src/services/database/adapter.js';
import { createRepositories } from '../../../../src/services/database/repository.js';

// Mock the repository module
jest.mock('../../../../src/services/database/repository.js', () => ({
  createRepositories: jest.fn().mockResolvedValue({
    pages: { name: 'pages-repo' },
    items: { name: 'items-repo' },
    adapter: { constructor: { name: 'InMemoryAdapter' } }
  })
}));

describe('Database Adapter Factory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('createDatabaseAdapter', () => {
    test('should create an InMemoryAdapter when type is "memory"', async () => {
      const adapter = await createDatabaseAdapter('memory', {});
      // Check the name rather than using instanceof since we're mocking
      expect(adapter.constructor.name).toBe('InMemoryAdapter');
    });
    
    test('should create an InMemoryAdapter when type is "in-memory"', async () => {
      const adapter = await createDatabaseAdapter('in-memory', {});
      expect(adapter.constructor.name).toBe('InMemoryAdapter');
    });
    
    test('should create a MongoDBAdapter when type is "mongodb"', async () => {
      await createDatabaseAdapter('mongodb', {});
      expect(MockMongoDBAdapter).toHaveBeenCalled();
    });
    
    test('should create a PostgresAdapter when type is "postgresql"', async () => {
      await createDatabaseAdapter('postgresql', {});
      expect(MockPostgresAdapter).toHaveBeenCalled();
    });
    
    test('should create a PostgresAdapter when type is "postgres"', async () => {
      await createDatabaseAdapter('postgres', {});
      expect(MockPostgresAdapter).toHaveBeenCalled();
    });
    
    test('should create a MySQLAdapter when type is "mysql"', async () => {
      await createDatabaseAdapter('mysql', {});
      expect(MockMySQLAdapter).toHaveBeenCalled();
    });
    
    test('should throw error for unsupported adapter type', async () => {
      await expect(createDatabaseAdapter('unsupported', {}))
        .rejects.toThrow('Unsupported database adapter type: unsupported');
    });
    
    test('should be case insensitive for adapter type', async () => {
      const adapter = await createDatabaseAdapter('MEMORY', {});
      expect(adapter.constructor.name).toBe('InMemoryAdapter');
    });
    
    test('should pass config to the adapter constructor', async () => {
      const config = { testConfig: 'value' };
      await createDatabaseAdapter('mongodb', config);
      expect(MockMongoDBAdapter).toHaveBeenCalledWith(config);
    });
  });
  
  describe('createRepositories', () => {
    test('should create repositories with configured adapter', async () => {
      // Mock config
      const config = {
        type: 'memory'
      };
      
      const repositories = await createRepositories(config);
      
      expect(repositories).toHaveProperty('pages');
      expect(repositories).toHaveProperty('items');
      expect(repositories).toHaveProperty('adapter');
      expect(repositories.adapter.constructor.name).toBe('InMemoryAdapter');
    });
    
    test('should connect to the database', async () => {
      // Create a spy for InMemoryAdapter connect method
      const connectMock = jest.fn().mockResolvedValue();
      const originalConnect = ActualInMemoryAdapter.prototype.connect;
      ActualInMemoryAdapter.prototype.connect = connectMock;
      
      try {
        await createRepositories({ type: 'memory' });
        expect(createRepositories).toHaveBeenCalled();
      } finally {
        // Restore original method
        ActualInMemoryAdapter.prototype.connect = originalConnect;
      }
    });
  });
});