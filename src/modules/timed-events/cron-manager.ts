import cron, { ScheduledTask } from 'node-cron';
import EventSpec from './event-spec';
import { logAudit } from '../audit/audit-logger';
import HandlerService from '../root/handler-service';
import logger from '../../logger';
import { TimedEvent } from './entities';

export class CronExpressionError extends Error {}

export default class CronManager {
  private cronTasks: Map<number, ScheduledTask>;

  constructor() {
    this.cronTasks = new Map();
  }

  /**
   * Schedule an event
   * @param timedEvent
   */
  registerEvent(timedEvent: TimedEvent) {
    if (!cron.validate(timedEvent.cronExpression)) {
      throw new CronExpressionError('Invalid cron expression');
    }

    // Remove the old event first if it already exists
    this.removeEvent(timedEvent);

    const task = cron.schedule(
      timedEvent.cronExpression,
      this.handleEvent.bind(this, timedEvent.eventSpec),
    );
    this.cronTasks.set(timedEvent.id, task);
  }

  /**
   * Unregister an event, such that it will not be scheduled anymore
   * @param timedEvent
   */
  removeEvent(timedEvent: TimedEvent) {
    if (this.cronTasks.has(timedEvent.id)) {
      const task = this.cronTasks.get(timedEvent.id)!;
      task.stop();
      this.cronTasks.delete(timedEvent.id);
    }
  }

  /**
   * Callbacks when an event should be executed
   * @param spec
   */
  async handleEvent(spec: EventSpec): Promise<void> {
    switch (spec.type) {
      case 'system-reset':
        logAudit({ id: 'system', name: 'system', roles: [] }, 'Reset system state to default.');
        await new HandlerService().resetToDefaults();
        return;
      case 'ping':
        logger.info('Pong!');
        return;
      default:
        throw new Error(`Unknown timed event: "${(spec as any).type}"`);
    }
  }
}
