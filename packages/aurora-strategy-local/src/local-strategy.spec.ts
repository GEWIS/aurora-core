import { describe, it, expect, beforeEach } from 'vitest';
import { LocalAuthStrategy } from './local-strategy';
import { SecurityGroup } from '@gewis/aurora-core/helpers/security';
import type { Request } from 'express';

function makeRequest(authenticated = true, user?: any): Request {
  return {
    isAuthenticated: () => authenticated,
    user,
  } as unknown as Request;
}

describe('LocalAuthStrategy', () => {
  let strategy: LocalAuthStrategy;

  beforeEach(() => {
    strategy = new LocalAuthStrategy();
  });

  describe('name', () => {
    it('is "local"', () => {
      expect(strategy.name).toBe('local');
    });
  });

  describe('authenticate', () => {
    it('throws Unauthorized when user is not authenticated', async () => {
      const req = makeRequest(false, undefined);
      await expect(strategy.authenticate(req, ['*'])).rejects.toMatchObject({ status: 401 });
    });

    it('throws Unauthorized when user is undefined', async () => {
      const req = makeRequest(true, undefined);
      await expect(strategy.authenticate(req, ['*'])).rejects.toMatchObject({ status: 401 });
    });

    it('returns user when scopes includes "*" and user has at least one role', async () => {
      const user = { id: 'user1', name: 'Test User', roles: [SecurityGroup.ADMIN] };
      const req = makeRequest(true, user);
      const result = await strategy.authenticate(req, ['*']);
      expect(result.id).toBe('user1');
    });

    it('throws Forbidden when scopes includes "*" but user has no roles', async () => {
      const req = makeRequest(true, { id: 'u', name: 'n', roles: [] });
      await expect(strategy.authenticate(req, ['*'])).rejects.toMatchObject({ status: 403 });
    });

    it('returns user when user has an overlapping role', async () => {
      const req = makeRequest(true, { id: 'u2', name: 'n2', roles: [SecurityGroup.BOARD] });
      const result = await strategy.authenticate(req, [SecurityGroup.BOARD]);
      expect(result.id).toBe('u2');
    });

    it('throws Forbidden when user does not have required role', async () => {
      const req = makeRequest(true, { id: 'u3', name: 'n3', roles: [SecurityGroup.BAC] });
      await expect(strategy.authenticate(req, [SecurityGroup.ADMIN])).rejects.toMatchObject({
        status: 403,
      });
    });
  });
});
