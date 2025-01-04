import CronManager, { CronExpressionError } from './cron-manager';
import { Repository } from 'typeorm';
import { HttpApiException, HttpStatusCode } from '../../helpers/custom-error';
import dataSource from '../../database';
import { TimedEvent } from './entities';
import logger from '../../logger';

export interface TimedEventRequest extends Pick<TimedEvent, 'cronExpression' | 'eventSpec'> {}

export default class TimedEventsService {
  private static instance: TimedEventsService;

  private cronManager: CronManager;

  private repo: Repository<TimedEvent>;

  constructor() {
    this.cronManager = new CronManager();
    this.repo = dataSource.getRepository(TimedEvent);

    this.registerAllDatabaseEvents()
      .then(() => logger.info('Registered timed events stored in database'))
      .catch((e) => logger.error(`Could not register timed events stored in database: "${e}"`));
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new TimedEventsService();
    }
    return this.instance;
  }

  public async registerAllDatabaseEvents() {
    const events = await this.repo.find();
    events.forEach((event) => this.cronManager.registerEvent(event));
  }

  public async getEvents(): Promise<TimedEvent[]> {
    return this.repo.find();
  }

  public async getEvent(id: number): Promise<TimedEvent> {
    const timedEvent = await this.repo.findOne({ where: { id } });
    if (timedEvent == null) {
      throw new HttpApiException(HttpStatusCode.NotFound, `Timed event with ID "${id}" not found`);
    }
    return timedEvent;
  }

  /**
   * Register the event in the cron manager
   * @param timedEvent
   * @param onError
   * @private
   */
  private async registerEventInCron(
    timedEvent: TimedEvent,
    onError: () => Promise<void>,
  ): Promise<void> {
    try {
      this.cronManager.registerEvent(timedEvent);
    } catch (e: unknown) {
      if (e instanceof CronExpressionError) {
        await onError();
        throw new HttpApiException(HttpStatusCode.BadRequest, 'Invalid cron expression');
      } else {
        throw e;
      }
    }
  }

  /**
   * Create and register a new timed event
   * @param timedEventRequest
   */
  public async createEvent(timedEventRequest: TimedEventRequest): Promise<TimedEvent> {
    const timedEvent = await this.repo.save(timedEventRequest);

    await this.registerEventInCron(timedEvent, async () => {
      await this.repo.delete(timedEvent.id);
    });

    return timedEvent;
  }

  /**
   * Update an existing timed event
   * @param id
   * @param timedEventRequest
   */
  public async updateEvent(id: number, timedEventRequest: TimedEventRequest): Promise<TimedEvent> {
    const timedEventOld = await this.getEvent(id);

    await this.repo.update(id, timedEventRequest);
    const timedEvent = await this.getEvent(id);

    await this.registerEventInCron(timedEvent, async () => {
      await this.repo.save(timedEventOld);
    });

    return timedEvent!;
  }

  /**
   * Remove and deregister an existing timed event
   * @param id
   */
  public async deleteEvent(id: number): Promise<void> {
    const timedEvent = await this.getEvent(id);
    await this.repo.delete(id);
    this.cronManager.removeEvent(timedEvent);
  }
}
