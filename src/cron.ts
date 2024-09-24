import cron from 'node-cron';
import HandlerService from './modules/root/handler-service';
import { logAudit } from './modules/audit/audit-logger';
import { AuditService } from './modules/audit';
import logger from './logger';

export default function registerCronJobs() {
  /**
   * Reset the system to its default state every night
   */
  cron.schedule('39 5 * * *', async () => {
    logAudit({ id: 'system', name: 'system', roles: [] }, 'Reset system state to default.');
    await new HandlerService().resetToDefaults();
  });

  /**
   * Remove all expired audit logs every night (for GDPR)
   */
  cron.schedule('39 4 * * *', async () => {
    logAudit(
      { id: 'system', name: 'system', roles: [] },
      `Remove audit logs older than ${process.env.AUDIT_LOGS_MAX_AGE_DAYS} days.`,
    );
    try {
      await new AuditService().removeExpiredAuditLogs();
    } catch (e: any) {
      logger.error(e.message);
    }
  });
}
