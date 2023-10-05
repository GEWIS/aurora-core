import { IocContainer } from '@tsoa/runtime';
import { container } from 'tsyringe';

/**
 * Function to inject the "Handlers" class into each TSOA controller
 */
export const iocContainer: IocContainer = {
  get: <T>(controller: { prototype: T }): T => container.resolve<T>(controller as never),
};
