import { AuthUser } from './modules/auth/auth-user';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
