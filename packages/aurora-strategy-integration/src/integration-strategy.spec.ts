import { describe, it, expect, beforeEach } from 'vitest';
import { IntegrationAuthStrategy } from './integration-strategy';
import type { Request } from 'express';

function makeRequest(authenticated = true, user?: any): Request {
  return {
    isAuthenticated: () => authenticated,
    user,
  } as unknown as Request;
}

describe('IntegrationAuthStrategy', () => {
  let strategy: IntegrationAuthStrategy;

  beforeEach(() => {
    strategy = new IntegrationAuthStrategy();
  });

  describe('name', () => {
    it('is "integration"', () => {
      expect(strategy.name).toBe('integration');
    });
  });

  describe('authenticate', () => {
    it('throws Unauthorized when not authenticated', async () => {
      const req = makeRequest(false, undefined);
      await expect(strategy.authenticate(req, ['someEndpoint'])).rejects.toMatchObject({
        status: 401,
      });
    });

    it('throws Unauthorized when user is null', async () => {
      const req = makeRequest(true, null);
      await expect(strategy.authenticate(req, ['someEndpoint'])).rejects.toMatchObject({
        status: 401,
      });
    });

    it('throws Forbidden when user has no integrationUserId', async () => {
      const req = makeRequest(true, { id: 'u', name: 'n', roles: [], endpoints: ['foo'] });
      await expect(strategy.authenticate(req, ['foo'])).rejects.toMatchObject({ status: 403 });
    });

    it('throws Forbidden when user has no endpoints', async () => {
      const req = makeRequest(true, {
        id: 'u',
        name: 'n',
        roles: [],
        integrationUserId: 1,
        endpoints: undefined,
      });
      await expect(strategy.authenticate(req, ['foo'])).rejects.toMatchObject({ status: 403 });
    });

    it('throws Forbidden when scopes do not match endpoints', async () => {
      const req = makeRequest(true, {
        id: 'u',
        name: 'n',
        roles: [],
        integrationUserId: 1,
        endpoints: ['bar'],
      });
      await expect(strategy.authenticate(req, ['foo'])).rejects.toMatchObject({ status: 403 });
    });

    it('returns user when scope matches an endpoint', async () => {
      const user = {
        id: 'u',
        name: 'n',
        roles: [],
        integrationUserId: 1,
        endpoints: ['foo', 'bar'],
      };
      const req = makeRequest(true, user);
      const result = await strategy.authenticate(req, ['bar']);
      expect(result.id).toBe('u');
    });
  });
});
