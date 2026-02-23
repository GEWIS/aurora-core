import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import {
  AUTH_STRATEGY_REGISTRY_TOKEN,
  registerAuthStrategy,
  resolveAuthStrategy,
} from './auth-strategy.port';
import type { IAuthStrategy } from './auth-strategy.port';

function makeStrategy(name: string): IAuthStrategy {
  return {
    name,
    authenticate: async () => ({ id: name, name, roles: [] }),
  };
}

describe('auth-strategy.port', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  describe('registerAuthStrategy', () => {
    it('registers a strategy and makes it resolvable', () => {
      const strategy = makeStrategy('local');
      registerAuthStrategy(strategy);
      const resolved = resolveAuthStrategy('local');
      expect(resolved).toBe(strategy);
    });

    it('registers multiple strategies in the same registry', () => {
      const local = makeStrategy('local');
      const integration = makeStrategy('integration');
      registerAuthStrategy(local);
      registerAuthStrategy(integration);
      expect(resolveAuthStrategy('local')).toBe(local);
      expect(resolveAuthStrategy('integration')).toBe(integration);
    });

    it('overwrites a strategy registered under the same name', () => {
      const first = makeStrategy('local');
      const second = makeStrategy('local');
      registerAuthStrategy(first);
      registerAuthStrategy(second);
      expect(resolveAuthStrategy('local')).toBe(second);
    });
  });

  describe('resolveAuthStrategy', () => {
    it('throws when no registry is registered at all', () => {
      expect(() => resolveAuthStrategy('local')).toThrow(
        'No auth strategy registered for "local".',
      );
    });

    it('throws when strategy name is not in the registry', () => {
      registerAuthStrategy(makeStrategy('local'));
      expect(() => resolveAuthStrategy('unknown')).toThrow(
        'No auth strategy registered for "unknown".',
      );
    });
  });

  describe('AUTH_STRATEGY_REGISTRY_TOKEN', () => {
    it('is a Symbol', () => {
      expect(typeof AUTH_STRATEGY_REGISTRY_TOKEN).toBe('symbol');
    });
  });
});
