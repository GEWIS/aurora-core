import cron from 'node-cron';
import HandlerService from './modules/root/handler-service';
import { logAudit } from './modules/audit/audit-logger';

export default function registerCronJobs() {
  cron.schedule('39 5 * * *', async () => {
    logAudit({ id: 'system', name: 'system', roles: [] }, 'Reset system state to default.');
    await new HandlerService().resetToDefaults();
  });
}
