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
    this.entities = [];
  }

  private async updateHandlerRef(entity: T) {
    // eslint-disable-next-line no-param-reassign
    entity.currentHandler = this.constructor.name;
    await entity.save();
  }

  /**
   * Add a lights controller to this handler
   * @param entity
   */
  public registerEntity(entity: T): void {
    this.entities.push(entity);
    this.updateHandlerRef(entity).catch((e) => console.error(e));
  }

  /**
   * Unregister a controller from this handler
   * @param entity
   */
  public removeEntity(entity: T): void {
    this.entities = this.entities.filter((e) => e.id !== entity.id);
  }

  /**
   * Return whether this handler has this entity
   * @param entity
   */
  public hasEntity(entity: T): boolean {
    return this.entities.findIndex((e) => e.id === entity.id) >= 0;
  }
}
