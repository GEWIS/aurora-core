import { describe, it, expect, vi, beforeEach } from 'vitest';
import IntegrationEndpointManager from './integration-endpoint-manager';

class MockIntegrationUser {
  id: number = 1;
  name: string = 'TestUser';
  endpoints: string[] = ['ep1'];
  lastSeen: Date | null = null;
}

vi.mock('./entities/integration-user', () => ({
  default: MockIntegrationUser,
}));

vi.mock('./entities/index', () => ({
  IntegrationUser: MockIntegrationUser,
  default: MockIntegrationUser,
}));

const mockSave = vi.fn();
const mockFind = vi.fn();
const mockFindOne = vi.fn();
const mockDelete = vi.fn();

vi.mock('@gewis/aurora-core/ports/data-source', () => ({
  resolveDataSource: () => ({
    getRepository: () => ({
      save: mockSave,
      find: mockFind,
      findOne: mockFindOne,
      delete: mockDelete,
    }),
  }),
}));

const mockCreateApiKey = vi.fn();
vi.mock('../auth-service', () => ({
  default: class MockAuthService {
    createApiKey = mockCreateApiKey;
  },
}));

vi.mock('@gewis/aurora-core/helpers/custom-error', () => ({
  HttpApiException: class HttpApiException extends Error {
    constructor(
      public status: number,
      message: string,
    ) {
      super(message);
    }
  },
}));

const { default: IntegrationUserService } = await import('./integration-user-service');

function makeUser(overrides: Partial<MockIntegrationUser> = {}): MockIntegrationUser {
  return Object.assign(new MockIntegrationUser(), overrides);
}

describe('IntegrationUserService', () => {
  let service: InstanceType<typeof IntegrationUserService>;
  const mockRepo = { save: mockSave, find: mockFind, findOne: mockFindOne, delete: mockDelete };

  beforeEach(() => {
    service = new IntegrationUserService(mockRepo as any);
    mockSave.mockReset();
    mockFind.mockReset();
    mockFindOne.mockReset();
    mockDelete.mockReset();
    mockCreateApiKey.mockReset();
    (IntegrationEndpointManager as any).instance = undefined;
  });

  describe('asResponse (static)', () => {
    it('formats user with lastSeen as ISO string', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      const user = makeUser({ lastSeen: date });
      const result = IntegrationUserService.asResponse(user as any);
      expect(result.lastSeen).toBe('2024-01-01T00:00:00.000Z');
    });

    it('formats user with null lastSeen', () => {
      const user = makeUser({ lastSeen: null });
      const result = IntegrationUserService.asResponse(user as any);
      expect(result.lastSeen).toBeNull();
    });
  });

  describe('asResponse (instance)', () => {
    it('delegates to static asResponse', () => {
      const user = makeUser();
      const result = service.asResponse(user as any);
      expect(result.id).toBe(user.id);
      expect(result.name).toBe(user.name);
    });
  });

  describe('constructor', () => {
    it('uses resolveDataSource when no repo is injected', async () => {
      const svcFromDataSource = new IntegrationUserService();
      mockFind.mockResolvedValue([]);
      const result = await svcFromDataSource.getAllIntegrationUsers();
      expect(result).toEqual([]);
    });
  });

  describe('getAllIntegrationUsers', () => {
    it('returns all users from repo', async () => {
      const users = [makeUser()];
      mockFind.mockResolvedValue(users);
      const result = await service.getAllIntegrationUsers();
      expect(result).toEqual(users);
    });
  });

  describe('getSingleIntegrationUser', () => {
    it('returns user when found', async () => {
      const user = makeUser();
      mockFindOne.mockResolvedValue(user);
      const result = await service.getSingleIntegrationUser(1);
      expect(result).toBe(user);
    });

    it('throws HttpApiException when not found', async () => {
      mockFindOne.mockResolvedValue(null);
      await expect(service.getSingleIntegrationUser(99)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('createIntegrationUser', () => {
    it('saves user and creates api key', async () => {
      const user = makeUser();
      mockSave.mockResolvedValue(user);
      mockCreateApiKey.mockResolvedValue({});
      const result = await service.createIntegrationUser({ name: 'TestUser', endpoints: ['ep1'] });
      expect(mockSave).toHaveBeenCalledWith({ name: 'TestUser', endpoints: ['ep1'] });
      expect(mockCreateApiKey).toHaveBeenCalledWith({ integrationUser: user });
      expect(result).toBe(user);
    });
  });

  describe('updateIntegrationUser', () => {
    it('updates name and endpoints', async () => {
      const user = makeUser({ name: 'Old', endpoints: ['old'] });
      mockFindOne.mockResolvedValue(user);
      mockSave.mockResolvedValue({ ...user, name: 'New', endpoints: ['new'] });
      await service.updateIntegrationUser(1, { name: 'New', endpoints: ['new'] });
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New', endpoints: ['new'] }),
      );
    });

    it('only updates provided fields', async () => {
      const user = makeUser({ name: 'Old', endpoints: ['old'] });
      mockFindOne.mockResolvedValue(user);
      mockSave.mockResolvedValue(user);
      await service.updateIntegrationUser(1, { name: 'New' });
      expect(user.name).toBe('New');
      expect(user.endpoints).toEqual(['old']);
    });

    it('does not update name or endpoints when neither is provided', async () => {
      const user = makeUser({ name: 'Old', endpoints: ['old'] });
      mockFindOne.mockResolvedValue(user);
      mockSave.mockResolvedValue(user);
      await service.updateIntegrationUser(1, {});
      expect(user.name).toBe('Old');
      expect(user.endpoints).toEqual(['old']);
    });

    it('throws when user not found', async () => {
      mockFindOne.mockResolvedValue(null);
      await expect(service.updateIntegrationUser(99, {})).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('deleteIntegrationUser', () => {
    it('calls repo.delete with the id', async () => {
      mockDelete.mockResolvedValue({});
      await service.deleteIntegrationUser(1);
      expect(mockDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('getIntegrationEndpoints', () => {
    it('returns methods from IntegrationEndpointManager', () => {
      IntegrationEndpointManager.getInstance().addIntegrationMethod('testEndpoint');
      const result = service.getIntegrationEndpoints();
      expect(result).toContain('testEndpoint');
    });
  });

  describe('validateEndpoints', () => {
    it('does not throw when all endpoints are valid', () => {
      IntegrationEndpointManager.getInstance().addIntegrationMethod('ep1');
      expect(() => service.validateEndpoints(['ep1'])).not.toThrow();
    });

    it('throws HttpApiException when some endpoints are invalid', () => {
      IntegrationEndpointManager.getInstance().addIntegrationMethod('ep1');
      expect(() => service.validateEndpoints(['ep1', 'invalid'])).toThrow();
    });

    it('throws with all invalid endpoints listed', () => {
      expect(() => service.validateEndpoints(['bad1', 'bad2'])).toThrow(/bad1/);
    });
  });
});
