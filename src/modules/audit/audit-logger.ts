import logger from '../../logger';
import AuditService from './audit-service';
import { AuthUser } from '../auth';

/**
 * Check if the given object is an AuthUser
 * @param obj - The object to check
 */
function isAuthUser(obj: unknown): obj is AuthUser {
  return (
    (obj as AuthUser)?.id !== undefined &&
    typeof (obj as AuthUser)?.id === 'string' &&
    (obj as AuthUser)?.name !== undefined &&
    typeof (obj as AuthUser)?.name === 'string'
  );
}

/**
 * Log an audit message
 * @param user - The user who performed the action
 * @param msg - The message to log
 * @param args - Additional arguments to log
 */
export function logAudit(user: unknown, msg?: string, ...args: any[]): void {
  if (!isAuthUser(user)) {
    logger.error(user, 'Invalid user provided, no id/name present.');
    return;
  }
  if (!msg) return;
  logger.trace<AuthUser>(user, msg, args);

  new AuditService()
    .addLog({ userId: user.id, userName: user.name, action: msg })
    .catch((e) => logger.error(e));
}

logger.audit = logAudit;
