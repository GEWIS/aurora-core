import { describe, it, expect, vi } from 'vitest';

const mockSerializeUser = vi.fn();
const mockDeserializeUser = vi.fn();

vi.mock('passport', () => ({
  default: {
    serializeUser: mockSerializeUser,
    deserializeUser: mockDeserializeUser,
    use: vi.fn(),
  },
}));

vi.mock('./oidc-strategy', () => ({}));
vi.mock('./api-key-strategy', () => ({}));
vi.mock('./mock-strategy', () => ({}));
vi.mock('@gewis/aurora-core/modules/auth/auth-user', () => ({}));

await import('./index');

describe('passport/index', () => {
  describe('serializeUser', () => {
    it('serializes user to JSON string', () => {
      const user = { id: 'u1', name: 'Test', roles: [] };
      const done = vi.fn();
      const serializeFn = mockSerializeUser.mock.calls[0][0];
      serializeFn(user, done);
      expect(done).toHaveBeenCalledWith(null, JSON.stringify(user));
    });
  });

  describe('deserializeUser', () => {
    it('returns false when user JSON is null', () => {
      const done = vi.fn();
      const deserializeFn = mockDeserializeUser.mock.calls[0][0];
      deserializeFn(JSON.stringify(null), done);
      expect(done).toHaveBeenCalledWith(null, false);
    });

    it('returns parsed AuthUser when valid JSON', () => {
      const user = { id: 'u2', name: 'User', roles: [] };
      const done = vi.fn();
      const deserializeFn = mockDeserializeUser.mock.calls[0][0];
      deserializeFn(JSON.stringify(user), done);
      expect(done).toHaveBeenCalledWith(null, user);
    });
  });

  describe('authResponse', () => {
    it('sends 200 with req.user', async () => {
      const { authResponse } = await import('./index');
      const user = { id: 'u3', name: 'User', roles: [] };
      const req = { user } as any;
      const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as any;
      authResponse(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(user);
    });
  });
});
