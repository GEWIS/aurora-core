import { describe, it, expect, beforeEach, vi } from 'vitest';
import IntegrationEndpointManager from './integration/integration-endpoint-manager';

const INTEGRATION = 'integration';

describe('endpoint-security (Security decorator)', () => {
  beforeEach(async () => {
    (IntegrationEndpointManager as any).instance = undefined;
    vi.resetModules();
  });

  describe('class decorator', () => {
    it('throws when INTEGRATION security is applied to a class', async () => {
      const { default: Security } = await import('./endpoint-security');

      expect(() => {
        Security(INTEGRATION)({} as Function);
      }).toThrow('Integration security decorator can only be used on controller endpoints');
    });

    it('does not throw for non-integration security on class', async () => {
      const { Security: TsoaSecurity } = await import('@tsoa/runtime');
      const { default: Security } = await import('./endpoint-security');

      expect(() => {
        Security('local')({} as Function);
      }).not.toThrow();
    });
  });

  describe('method decorator', () => {
    it('throws when target is not a Controller', async () => {
      const { default: Security } = await import('./endpoint-security');
      const target = {};
      const descriptor = { value: function myMethod() {} };

      expect(() => {
        Security(INTEGRATION, ['myMethod'])(
          target,
          'myMethod',
          descriptor as TypedPropertyDescriptor<any>,
        );
      }).toThrow('Integration security decorator can only be used on controller endpoints');
    });

    it('throws when scopes do not match method name', async () => {
      const { Controller } = await import('@tsoa/runtime');
      const { default: Security } = await import('./endpoint-security');

      class MyController extends Controller {}
      const instance = new MyController();
      const descriptor = { value: function myMethod() {} };

      expect(() => {
        Security(INTEGRATION, ['wrongScope'])(
          instance,
          'myMethod',
          descriptor as TypedPropertyDescriptor<any>,
        );
      }).toThrow("Integration security decorator's scope needs to equal the method's name");
    });

    it('throws when scopes array has more than one element', async () => {
      const { Controller } = await import('@tsoa/runtime');
      const { default: Security } = await import('./endpoint-security');

      class MyController extends Controller {}
      const instance = new MyController();
      const descriptor = { value: function myMethod() {} };

      expect(() => {
        Security(INTEGRATION, ['myMethod', 'extra'])(
          instance,
          'myMethod',
          descriptor as TypedPropertyDescriptor<any>,
        );
      }).toThrow();
    });

    it('does not throw for non-integration security on method', async () => {
      const { Controller } = await import('@tsoa/runtime');
      const { default: Security } = await import('./endpoint-security');

      class MyController extends Controller {}
      const instance = new MyController();
      const descriptor = { value: function someMethod() {} };

      expect(() => {
        Security('local', ['someMethod'])(
          instance,
          'someMethod',
          descriptor as TypedPropertyDescriptor<any>,
        );
      }).not.toThrow();
    });

    it('registers method with IntegrationEndpointManager when valid', async () => {
      const { Controller } = await import('@tsoa/runtime');
      const { default: Security } = await import('./endpoint-security');
      const { default: Manager } = await import('./integration/integration-endpoint-manager');

      class MyController extends Controller {}
      const instance = new MyController();
      const descriptor = { value: function testMethod() {} };

      Security(INTEGRATION, ['testMethod'])(
        instance,
        'testMethod',
        descriptor as TypedPropertyDescriptor<any>,
      );

      const methods = Manager.getInstance().getIntegrationMethods();
      expect(methods).toContain('testMethod');
    });
  });
});
