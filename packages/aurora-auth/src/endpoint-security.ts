import { Controller, Security as TsoaSecurity } from '@tsoa/runtime';
import { SecurityNames } from '@gewis/aurora-core/helpers/security';
import IntegrationEndpointManager from './integration/integration-endpoint-manager';

function Security(
  name:
    | string
    | {
        [name: string]: string[];
      },
  scopes?: string[],
): ClassDecorator & MethodDecorator {
  return (...args: [any] | [Object, string | symbol, TypedPropertyDescriptor<any>]) => {
    if (args.length === 1) {
      if (name === SecurityNames.INTEGRATION) {
        throw new Error('Integration security decorator can only be used on controller endpoints');
      }
    }

    if (args.length === 3) {
      const target = args[0] as Object;
      const propertyKey = args[1] as string | symbol;
      const descriptor = args[2] as TypedPropertyDescriptor<any>;
      if (name === SecurityNames.INTEGRATION) {
        if (!(target instanceof Controller)) {
          throw new Error(
            'Integration security decorator can only be used on controller endpoints',
          );
        }

        if (!scopes || scopes?.length !== 1 || scopes[0] !== propertyKey) {
          throw new Error(
            `Integration security decorator's scope needs to equal the method's name (${scopes} != ${String(propertyKey)})`,
          );
        }

        IntegrationEndpointManager.getInstance().addIntegrationMethod(scopes[0]);
      }
    }

    // @ts-ignore Args can be 1 or 3 items long
    return TsoaSecurity(name, scopes)(...args);
  };
}

const s: typeof TsoaSecurity = Security;

export default s;
