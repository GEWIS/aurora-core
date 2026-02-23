import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockConnect = vi.fn().mockReturnThis();
class MockTypeormStore {
  connect = mockConnect;
}
const mockGetRepository = vi.fn(() => ({}));
const mockSession = vi.fn().mockReturnValue(vi.fn());

vi.mock('@gewis/aurora-core/ports/data-source', () => ({
  resolveDataSource: () => ({ getRepository: mockGetRepository }),
}));

vi.mock('connect-typeorm', () => ({
  TypeormStore: MockTypeormStore,
}));

vi.mock('express-session', () => ({
  default: mockSession,
}));

vi.mock('./entities/index', () => ({ Session: class Session {} }));

describe('SessionMiddleware', () => {
  beforeEach(() => {
    vi.resetModules();
    mockSession.mockReturnValue(vi.fn());
    mockGetRepository.mockClear();
    mockConnect.mockClear();
  });

  describe('getInstance', () => {
    it('returns the same instance on subsequent calls', async () => {
      const { default: SessionMiddleware } = await import('./session-middleware');
      (SessionMiddleware as any).instance = undefined;
      const a = SessionMiddleware.getInstance();
      const b = SessionMiddleware.getInstance();
      expect(a).toBe(b);
    });
  });

  describe('get', () => {
    it('returns the express middleware function', async () => {
      const { default: SessionMiddleware } = await import('./session-middleware');
      (SessionMiddleware as any).instance = undefined;
      const handler = vi.fn();
      mockSession.mockReturnValue(handler);
      const inst = new SessionMiddleware();
      expect(inst.get()).toBe(handler);
    });
  });

  describe('constructor', () => {
    it('creates session with SESSION_SECRET env var', async () => {
      process.env.SESSION_SECRET = 'test-secret';
      const { default: SessionMiddleware } = await import('./session-middleware');
      (SessionMiddleware as any).instance = undefined;
      new SessionMiddleware();
      expect(mockSession).toHaveBeenCalledWith(expect.objectContaining({ secret: 'test-secret' }));
      delete process.env.SESSION_SECRET;
    });

    it('falls back to "secret" when SESSION_SECRET is not set', async () => {
      delete process.env.SESSION_SECRET;
      const { default: SessionMiddleware } = await import('./session-middleware');
      (SessionMiddleware as any).instance = undefined;
      new SessionMiddleware();
      expect(mockSession).toHaveBeenCalledWith(expect.objectContaining({ secret: 'secret' }));
    });
  });
});
