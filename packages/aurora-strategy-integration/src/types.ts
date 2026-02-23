import { AuthUser } from '@gewis/aurora-core/modules/auth/auth-user';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
