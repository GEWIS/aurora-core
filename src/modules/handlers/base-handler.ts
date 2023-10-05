import { v4 as uuidv4 } from 'uuid';
import SubscribeEntity from '../base/entities/subscribe-entity';

export default abstract class BaseHandler<T extends SubscribeEntity> {
  /**
   * Used to distinguish multiple instances of the same handler type
   */
  public identifier: string;

  private entities: T[];

  public constructor() {
    this.identifier = uuidv4();
  }

  /**
   * Add a lights controller to this handler
   * @param entity
   */
  public registerLightsController(entity: T): void {
    this.entities.push(entity);
  }

  /**
   * Unregister a controller from this handler
   * @param entity
   */
  public removeLightsController(entity: T): void {
    this.entities = this.entities.filter((e) => e !== entity);
  }
}
