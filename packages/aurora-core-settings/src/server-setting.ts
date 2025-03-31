import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@gewis/aurora-core-util';

/**
 * Key-value store
 */
@Entity()
export class ServerSetting<
  V extends Record<string, any> = Record<string, any>,
  K extends keyof V = keyof V,
> extends BaseEntity {
  @Column({ unique: true })
  public key: K;

  /**
   * JSON-stored value
   */
  @Column({
    type: 'varchar',
    transformer: {
      from(value: string | null): number[] | null {
        if (value == null) return null;
        return JSON.parse(value);
      },
      to(value: number[] | null): string | null {
        if (value == null) return null;
        return JSON.stringify(value);
      },
    },
  })
  public value: V[K];
}
