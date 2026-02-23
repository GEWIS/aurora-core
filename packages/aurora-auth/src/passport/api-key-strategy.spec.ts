import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCallback = vi.fn();
const mockUse = vi.fn();

let strategyFn: (req: any, callback: any) => Promise<void>;

vi.mock('passport', () => ({
  default: {
    use: vi.fn((name: string, strategy: any) => {
      mockUse(name, strategy);
    }),
  },
}));

vi.mock('passport-custom', () => ({
  Strategy: class CustomStrategy {
    constructor(fn: any) {
      strategyFn = fn;
    }
  },
}));

vi.mock('@gewis/aurora-core/helpers/custom-error', () => ({
  HttpApiException: class HttpApiException extends Error {
    constructor(
      public status: number,
      message?: string,
    ) {
      super(message);
    }
  },
}));

const mockFindOne = vi.fn();
vi.mock('@gewis/aurora-core/ports/data-source', () => ({
  resolveDataSource: () => ({
    getRepository: () => ({ findOne: mockFindOne }),
  }),
}));

vi.mock('../entities/index', () => ({
  ApiKey: class ApiKey {},
}));

await import('./api-key-strategy');

describe('passport api-key strategy', () => {
  beforeEach(() => {
    mockFindOne.mockReset();
    mockCallback.mockReset();
  });

  describe('when req.body is missing or has no key', () => {
    it('calls callback with BadRequest error when body is missing', async () => {
      await strategyFn({ body: null }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({ status: 400 }),
        undefined,
      );
    });

    it('calls callback with BadRequest error when body has no key', async () => {
      await strategyFn({ body: {} }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({ status: 400 }),
        undefined,
      );
    });
  });

  describe('when key is provided', () => {
    it('calls callback with NotFound error when key is not found in DB', async () => {
      mockFindOne.mockResolvedValue(null);
      await strategyFn({ body: { key: 'unknown-key' } }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({ status: 404 }),
        undefined,
      );
    });

    it('calls callback with auth user when key is found', async () => {
      const authUser = { id: 'ak1', name: 'ApiKey', roles: [] };
      mockFindOne.mockResolvedValue({ asAuthUser: () => authUser });
      await strategyFn({ body: { key: 'valid-key' } }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(null, authUser);
    });
  });
});
