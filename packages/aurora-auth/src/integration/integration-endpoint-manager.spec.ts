import { describe, it, expect, beforeEach } from 'vitest';
import IntegrationEndpointManager from './integration-endpoint-manager';

describe('IntegrationEndpointManager', () => {
  beforeEach(() => {
    // Reset singleton for each test
    (IntegrationEndpointManager as any).instance = undefined;
  });

  describe('getInstance', () => {
    it('creates a new instance when none exists', () => {
      const instance = IntegrationEndpointManager.getInstance();
      expect(instance).toBeInstanceOf(IntegrationEndpointManager);
    });

    it('returns the same instance on subsequent calls', () => {
      const a = IntegrationEndpointManager.getInstance();
      const b = IntegrationEndpointManager.getInstance();
      expect(a).toBe(b);
    });
  });

  describe('addIntegrationMethod', () => {
    it('adds a method to the list', () => {
      const manager = IntegrationEndpointManager.getInstance();
      manager.addIntegrationMethod('myMethod');
      expect(manager.getIntegrationMethods()).toContain('myMethod');
    });

    it('allows adding multiple methods', () => {
      const manager = IntegrationEndpointManager.getInstance();
      manager.addIntegrationMethod('methodA');
      manager.addIntegrationMethod('methodB');
      const methods = manager.getIntegrationMethods();
      expect(methods).toContain('methodA');
      expect(methods).toContain('methodB');
    });
  });

  describe('getIntegrationMethods', () => {
    it('returns an empty array initially', () => {
      const manager = IntegrationEndpointManager.getInstance();
      expect(manager.getIntegrationMethods()).toEqual([]);
    });

    it('returns all added methods', () => {
      const manager = IntegrationEndpointManager.getInstance();
      manager.addIntegrationMethod('foo');
      manager.addIntegrationMethod('bar');
      expect(manager.getIntegrationMethods()).toEqual(['foo', 'bar']);
    });
  });
});
