import { BaseEntity } from '@gewis/aurora-core-util';
import { Column, Entity } from 'typeorm';

@Entity()
/**
 * Special type of user that should be used for machine-to-machine communication.
 * For example, an adapter to send commands from some system to Aurora.
 */
export default class IntegrationUser extends BaseEntity {
  @Column({ nullable: false })
  name: string;
}
