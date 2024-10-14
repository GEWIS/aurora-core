import logger from '../../logger';
import { User } from '../auth';
import AuditService from './audit-service';

export function logAudit(user: User, msg?: string, ...args: any[]): void {
  logger.trace(user, msg, args);
  if (!msg) return;

  if (!user.id || !user.name) {
    logger.error(user, 'Invalid user provided, no id/name present.');
  }

  new AuditService()
    .addLog({ userId: user.id, userName: user.name, action: msg })
    .catch((e) => logger.error(e));
}

logger.audit<User> = logAudit;
