import pino from 'pino';
import logger from '../../logger';
import AuditService from './audit-service';
import { AuthUser } from '../auth';
import LogFn = pino.LogFn;

export function logAudit(user: AuthUser | undefined, msg?: string, ...args: any[]): void {
  if (!user) {
    logger.trace(msg!, args);
    return;
  }
  if (!msg) return;
  logger.trace<AuthUser>(user, msg, args);

  if (!user.id || !user.name) {
    logger.error(user, 'Invalid user provided, no id/name present.');
  }

  new AuditService()
    .addLog({ userId: user.id, userName: user.name, action: msg })
    .catch((e) => logger.error(e));
}

logger.audit = logAudit as LogFn;
