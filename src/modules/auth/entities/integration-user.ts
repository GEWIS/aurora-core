import BaseEntity from '../../root/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity()
/**
 * Special type of user that should be used for machine-to-machine communication.
 * For example, an adapter to send commands from some system to Aurora.
 */
export default class IntegrationUser extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  /**
   * List of endpoints (operationIds) this user can access
   */
  @Column({
    nullable: true,
    type: 'varchar',
    transformer: {
      from(value: string | null): string[] {
        if (value == null) return [];
        return JSON.parse(value);
      },
      to(value: string[]): string | null {
        if (value.length === 0) return null;
        return JSON.stringify(value);
      },
    },
  })
  endpoints: string[];
}
