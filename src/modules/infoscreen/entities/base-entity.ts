import {
  BaseEntity as TypeormBaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class BaseEntity extends TypeormBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @DeleteDateColumn()
  public deletedAt?: Date;

  async setUpdatedAtToNow(): Promise<void> {
    this.updatedAt = new Date();
    await this.save();
  }
}
