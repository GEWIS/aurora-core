import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthService from './auth-service';

const mockFindOne = vi.fn();
const mockSave = vi.fn();
const mockGetRepository = vi.fn(() => ({ findOne: mockFindOne, save: mockSave }));

vi.mock('@gewis/aurora-core/ports/data-source', () => ({
  resolveDataSource: () => ({ getRepository: mockGetRepository }),
}));

vi.mock('./entities/index', () => ({
  ApiKey: class ApiKey {},
}));

vi.mock('./integration/entities/index', () => ({
  IntegrationUser: class IntegrationUser {},
}));

vi.mock('@gewis/aurora-core/modules/root/entities', () => ({
  Audio: class Audio {},
  Screen: class Screen {},
  LightsController: class LightsController {},
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    mockFindOne.mockReset();
    mockSave.mockReset();
    mockFetch.mockReset();
  });

  describe('createApiKey', () => {
    it('saves an api key with generated key and given params', async () => {
      const audio = { id: 1, name: 'A' } as any;
      mockSave.mockResolvedValue({ key: 'some-hex', audio });
      const result = await service.createApiKey({ audio });
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({ audio, key: expect.stringMatching(/^[a-f0-9]{64}$/) }),
      );
      expect(result).toEqual({ key: 'some-hex', audio });
    });

    it('saves with null params when nothing is provided', async () => {
      mockSave.mockResolvedValue({});
      await service.createApiKey({});
      expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({ key: expect.any(String) }));
    });
  });

  describe('getAudioApiKey', () => {
    it('finds by audio id', async () => {
      const audio = { id: 2 } as any;
      const key = { key: 'abc' };
      mockFindOne.mockResolvedValue(key);
      const result = await service.getAudioApiKey(audio);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { audio: { id: 2 } } });
      expect(result).toBe(key);
    });
  });

  describe('getScreenApiKey', () => {
    it('finds by screen id', async () => {
      const screen = { id: 3 } as any;
      mockFindOne.mockResolvedValue(null);
      const result = await service.getScreenApiKey(screen);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { screen: { id: 3 } } });
      expect(result).toBeNull();
    });
  });

  describe('getLightsControllerApiKey', () => {
    it('finds by lightsController id', async () => {
      const lc = { id: 4 } as any;
      mockFindOne.mockResolvedValue(null);
      await service.getLightsControllerApiKey(lc);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { lightsController: { id: 4 } } });
    });
  });

  describe('getIntegrationUserApiKey', () => {
    it('finds by integrationUser id', async () => {
      const iu = { id: 5 } as any;
      mockFindOne.mockResolvedValue(null);
      await service.getIntegrationUserApiKey(iu);
      expect(mockFindOne).toHaveBeenCalledWith({ where: { integrationUser: { id: 5 } } });
    });
  });

  describe('getOIDCConfig', () => {
    it('fetches the OIDC config URL and returns parsed JSON', async () => {
      process.env.OIDC_CONFIG = 'https://example.com/.well-known/openid-configuration';
      const config = { authorization_endpoint: 'https://auth', token_endpoint: 'https://token' };
      mockFetch.mockResolvedValue({ json: vi.fn().mockResolvedValue(config) });
      const result = await service.getOIDCConfig();
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/.well-known/openid-configuration',
      );
      expect(result).toEqual(config);
    });
  });
});
