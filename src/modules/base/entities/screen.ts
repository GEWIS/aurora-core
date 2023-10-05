import { Entity } from 'typeorm';
import SubscribeEntity from './subscribe-entity';

@Entity()
export default class Screen extends SubscribeEntity {
  // Register child entity with parent
  static dummy = SubscribeEntity.entities.add(Screen);
}
