import { Middlewares } from '@tsoa/runtime';
import { Request as ExRequest, Response as ExResponse, NextFunction } from 'express';
import { ISettings } from './server-setting';
import ServerSettingsStore from './server-settings-store';
import logger from '../../logger';

/**
 * Return an HTTP 409 if the value of the given setting key evaluates to "false".
 * Also adds this possible return value to the OpenAPI spec
 * @param setting
 * @constructor
 */
export default function EndpointEnabled(
  setting: keyof ISettings,
): MethodDecorator & ClassDecorator {
  return (args: any): void => {
    // It would be amazing to also include the line below, but unfortunately TSOA does not process
    // response decorators like others. For Middlewares, TSOA tracks all registered middlewares to
    // a function/class. However, for Response, these are simply read from the .ts file directly
    // and cannot be dynamically assigned.
    //
    // Response<string>(409, 'Endpoint is disabled in the server settings')(
    //   target,
    //   propertyKey,
    //   descriptor,
    // );
    Middlewares((req: ExRequest, res: ExResponse, next: NextFunction) => {
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
    })(args);
  };
}
