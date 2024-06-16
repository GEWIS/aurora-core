import cron from 'node-cron';
import HandlerService from './modules/root/handler-service';

export default function registerCronJobs() {
  cron.schedule('39 5 * * *', async () => new HandlerService().resetToDefaults());
}
