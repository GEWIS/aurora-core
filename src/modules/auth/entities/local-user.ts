import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SecurityGroup } from '../../../helpers/security';

@Entity()
export default class LocalUser extends BaseEntity {
  /** ID of the associated user */
  @PrimaryColumn('integer')
  readonly id!: number;

  @Column({ unique: true })
  userName!: string;

  @Column({ nullable: true })
  salt!: string;

  @Column({ nullable: true })
  hash!: string;

  @Column('text')
  roles!: string;
}
