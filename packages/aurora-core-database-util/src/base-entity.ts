import { BaseEntity as TypeormBaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public readonly createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
