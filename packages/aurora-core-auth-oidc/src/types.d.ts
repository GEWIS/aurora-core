import { AuthUser } from '@gewis/aurora-core-util/src/authentication';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
