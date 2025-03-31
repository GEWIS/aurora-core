import { RegisterStrategy } from './oidc-strategy';
import { RegisterRoutes as test } from '../build/routes';
import Specs from '../build/swagger.json';
import { AuroraPlugin } from '@gewis/aurora-core-util';

export default {
  RegisterEntities(): void {},

  RegisterRoutes: test,

  RegisterStrategy(): void {
    RegisterStrategy();
  },

  Specs: Specs,
} as AuroraPlugin;
