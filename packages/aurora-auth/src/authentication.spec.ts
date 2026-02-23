import { describe, it, expect, beforeEach, vi } from 'vitest';
import { expressAuthentication } from './authentication';
import { registerAuthStrategy, resolveAuthStrategy } from '@gewis/aurora-core/ports/auth-strategy';
import { container } from 'tsyringe';
import type { Request } from 'express';
import type { IAuthStrategy } from '@gewis/aurora-core/ports/auth-strategy';

function makeRequest(): Request {
  return {} as unknown as Request;
}

describe('expressAuthentication', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('delegates to registered strategy and returns AuthUser', async () => {
    const mockUser = { id: 'u1', name: 'Test', roles: [] };
    const mockStrategy: IAuthStrategy = {
      name: 'local',
      authenticate: vi.fn().mockResolvedValue(mockUser),
    };
    registerAuthStrategy(mockStrategy);

    const result = await expressAuthentication(makeRequest(), 'local', ['*']);
    expect(result).toEqual(mockUser);
    expect(mockStrategy.authenticate).toHaveBeenCalledOnce();
  });

  it('throws InternalServerError when no strategy is registered', async () => {
    await expect(expressAuthentication(makeRequest(), 'nonexistent', [])).rejects.toMatchObject({
      status: 500,
    });
  });

  it('re-throws HttpApiException from strategy', async () => {
    const { HttpApiException, HttpStatusCode } =
      await import('@gewis/aurora-core/helpers/custom-error');
    const mockStrategy: IAuthStrategy = {
      name: 'test',
      authenticate: vi.fn().mockRejectedValue(new HttpApiException(HttpStatusCode.Forbidden)),
    };
    registerAuthStrategy(mockStrategy);

    await expect(expressAuthentication(makeRequest(), 'test', [])).rejects.toMatchObject({
      status: 403,
    });
  });

  it('wraps non-HttpApiException errors in InternalServerError', async () => {
    const mockStrategy: IAuthStrategy = {
      name: 'buggy',
      authenticate: vi.fn().mockRejectedValue(new Error('unexpected')),
    };
    registerAuthStrategy(mockStrategy);

    await expect(expressAuthentication(makeRequest(), 'buggy', [])).rejects.toMatchObject({
      status: 500,
    });
  });
});
