import { AuthUser } from './authentication';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
