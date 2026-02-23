import BaseEntity from '@gewis/aurora-core/modules/root/entities/base-entity';
import { Column, Entity } from 'typeorm';
import { jsonTransformer } from '@gewis/aurora-core/helpers/transformers';

@Entity()
export default class IntegrationUser extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    transformer: {
      from(value: string | null): Date | null {
        if (value == null) return null;
        return new Date(value);
      },
      to(value: Date | null): string | null {
        if (value == null) return null;
        return value.toISOString();
      },
    },
  })
  lastSeen: Date | null;

  @Column({
    nullable: true,
    type: 'varchar',
    transformer: jsonTransformer<string[]>(),
  })
  endpoints: string[];
}
