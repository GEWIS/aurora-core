import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCallback = vi.fn();
let strategyFn: (req: any, callback: any) => Promise<void>;
const mockError = vi.fn();
const mockGetOIDCConfig = vi.fn();
const mockFetch = vi.fn();

vi.mock('passport', () => ({
  default: { use: vi.fn() },
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
  HttpStatusCode: { InternalServerError: 500 },
}));

vi.mock('@gewis/aurora-core/ports/logger', () => ({
  resolveLogger: () => ({ error: mockError }),
}));

vi.mock('@gewis/aurora-core/helpers/security', () => ({
  parseRoles: vi.fn((roles: string[]) => roles.map((r) => r)),
}));

vi.mock('../auth-service', () => ({
  default: class MockAuthService {
    getOIDCConfig = mockGetOIDCConfig;
  },
}));

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn((token: string) =>
    JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()),
  ),
}));

vi.stubGlobal('fetch', mockFetch);

await import('./oidc-strategy');

const validEnv = {
  OIDC_PROVIDER: 'KEYCLOAK',
  OIDC_CONFIG: 'https://example.com/.well-known/openid',
  OIDC_CLIENT_ID: 'client',
  OIDC_CLIENT_SECRET: 'secret',
  OIDC_REDIRECT_URI: 'https://app.example.com/callback',
};

function makeJwt(payload: Record<string, any>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  return `${header}.${body}.sig`;
}

describe('passport oidc strategy', () => {
  beforeEach(() => {
    mockCallback.mockReset();
    mockError.mockReset();
    mockGetOIDCConfig.mockReset();
    mockFetch.mockReset();
    Object.assign(process.env, validEnv);
  });

  describe('missing request fields', () => {
    it('calls callback with error when state/session_state/code are missing', async () => {
      await strategyFn({ body: {} }, mockCallback);
      expect(mockError).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    });
  });

  describe('missing env vars', () => {
    it('calls callback with error when OIDC env vars are not set', async () => {
      delete process.env.OIDC_PROVIDER;
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockError).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    });
  });

  describe('invalid OIDC_PROVIDER', () => {
    it('calls callback with error when provider is not recognized', async () => {
      process.env.OIDC_PROVIDER = 'UNKNOWN_PROVIDER';
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockError).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    });
  });

  describe('getOIDCConfig failure', () => {
    it('calls callback with error when config fetch throws', async () => {
      mockGetOIDCConfig.mockRejectedValue(new Error('network error'));
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockError).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    });

    it('calls callback with error when config is null', async () => {
      mockGetOIDCConfig.mockResolvedValue(null);
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockError).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    });
  });

  describe('KEYCLOAK provider', () => {
    beforeEach(() => {
      mockGetOIDCConfig.mockResolvedValue({
        authorization_endpoint: 'https://auth',
        token_endpoint: 'https://token',
      });
    });

    it('calls callback with false when no roles assigned', async () => {
      const payload = {
        preferred_username: 'user1',
        given_name: 'User',
        resource_access: { client: { roles: [] } },
      };
      const jwt = makeJwt(payload);
      mockFetch.mockResolvedValue({ json: vi.fn().mockResolvedValue({ id_token: jwt }) });
      const { parseRoles } = await import('@gewis/aurora-core/helpers/security');
      (parseRoles as ReturnType<typeof vi.fn>).mockReturnValue([]);
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(null, false);
    });

    it('calls callback with user when roles are assigned', async () => {
      const payload = {
        preferred_username: 'user2',
        given_name: 'Alice',
        resource_access: { client: { roles: ['admin'] } },
      };
      const jwt = makeJwt(payload);
      mockFetch.mockResolvedValue({ json: vi.fn().mockResolvedValue({ id_token: jwt }) });
      const { parseRoles } = await import('@gewis/aurora-core/helpers/security');
      (parseRoles as ReturnType<typeof vi.fn>).mockReturnValue(['admin']);
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          id: 'user2',
          name: 'Alice',
        }),
      );
    });

    it('uses empty roles when resource_access is undefined', async () => {
      const payload = {
        preferred_username: 'user4',
        given_name: 'NoAccess',
        resource_access: undefined,
      };
      const jwt = makeJwt(payload);
      mockFetch.mockResolvedValue({ json: vi.fn().mockResolvedValue({ id_token: jwt }) });
      const { parseRoles } = await import('@gewis/aurora-core/helpers/security');
      (parseRoles as ReturnType<typeof vi.fn>).mockReturnValue([]);
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(null, false);
    });

    it('calls callback with error when token parsing throws', async () => {
      mockFetch.mockResolvedValue({ json: vi.fn().mockResolvedValue({ id_token: 'bad.token' }) });
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
    });
  });

  describe('ENTRA_ID provider', () => {
    beforeEach(() => {
      process.env.OIDC_PROVIDER = 'ENTRA_ID';
      mockGetOIDCConfig.mockResolvedValue({
        authorization_endpoint: 'https://auth',
        token_endpoint: 'https://token',
      });
    });

    it('uses roles from token root for ENTRA_ID', async () => {
      const payload = {
        preferred_username: 'user3',
        given_name: 'Bob',
        roles: ['board'],
      };
      const jwt = makeJwt(payload);
      mockFetch.mockResolvedValue({ json: vi.fn().mockResolvedValue({ id_token: jwt }) });
      const { parseRoles } = await import('@gewis/aurora-core/helpers/security');
      (parseRoles as ReturnType<typeof vi.fn>).mockReturnValue(['board']);
      await strategyFn({ body: { state: 's', session_state: 'ss', code: 'c' } }, mockCallback);
      expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({ id: 'user3' }));
    });
  });
});
