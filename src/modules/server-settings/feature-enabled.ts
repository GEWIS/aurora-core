import { Controller } from 'tsoa';
import { Middlewares } from '@tsoa/runtime';
import { NextFunction, Request as ExRequest, Response as ExResponse } from 'express';
import { ISettings } from './server-setting';
import ServerSettingsStore from './server-settings-store';
import logger from '../../logger';

type ClassDecoratorParams<T extends { new (...args: any[]): {} }> = [T];
type FunctionDecoratorParams<T> = [
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
];

type DecoratorParams = ClassDecoratorParams<any> | FunctionDecoratorParams<any>;

export default function FeatureEnabled(setting: keyof ISettings): ClassDecorator & MethodDecorator {
  // Register this setting as a (used) feature flag
  ServerSettingsStore.registerFeatureFlag(setting);

  const featureFlagMiddleware = (req: ExRequest, res: ExResponse, next: NextFunction) => {
    const store = ServerSettingsStore.getInstance();

    if (!store.isInitialized()) {
      logger.error('Server Settings Store is not initialized');
      res.status(500).send('Internal server error.');
      return;
    }

    const value = store.getSetting(setting);
    if (!value) {
      res.status(409).send(`Endpoint is disabled by setting "${setting}".`);
      return;
    }

    next();
    // @ts-ignore
  };

  return <TFunction extends Function>(...args: DecoratorParams): void | TFunction => {
    // The decorator is assigned to a controller
    if (args.length === 1 && args[0].prototype instanceof Controller) {
      return Middlewares(featureFlagMiddleware)(args[0]) as void | TFunction;
    }

    // The decorator is assigned to a controller method
    if (args.length === 3 && args[0] instanceof Controller) {
      return Middlewares(featureFlagMiddleware)(args[0], args[1], args[2]) as void | TFunction;
    }

    // Decorator is assigned to a regular class
    if (args.length === 1) {
      const constr = args[0] as ClassDecoratorParams<any>[0];
      // Override the constructor. More specifically, we want to perform the
      // feature flag check before actually creating the object.
      return class extends constr {
        constructor(...constructorArgs: any[]) {
          const store = ServerSettingsStore.getInstance();
          store.throwIfNotInitialized();

          const value = store.getSetting(setting);
          if (!value) {
            throw new Error(`Class "${constr.name}" is disabled by setting "${setting}"`);
          }

          super(constructorArgs);
        }
      } as any as TFunction;
    }

    // Decorator is a method
    const [, propertyKey, descriptor] = args;
    const originalMethod = descriptor.value;
    // Override the method's implementation. More specifically, we only execute
    // the method if the feature flag has been evaluated.
    descriptor.value = function executeMethod(...methodArgs: any[]) {
      const store = ServerSettingsStore.getInstance();
      store.throwIfNotInitialized();

      const value = store.getSetting(setting);
      if (!value) {
        throw new Error(`Method "${propertyKey.toString()}" is disabled by setting "${setting}"`);
      }
      return originalMethod.apply(this, methodArgs);
    };
    return descriptor as TFunction;
  };
}
