import { Entity, Column } from 'typeorm';
import BaseEntity from '../../../../root/entities/base-entity';

export enum FooterSize {
  FULL = 'full',
  MINIMAL = 'minimal',
  HIDDEN = 'hidden',
}

@Entity()
export default class LocalPoster extends BaseEntity {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  expirationDate?: Date;

  @Column({ nullable: true })
  accentColor?: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  protected: boolean;

  @Column({default: false})
  borrelMode: boolean;

  @Column({
    type: 'text',
    enum: FooterSize,
    default: FooterSize.FULL,
  })
  footerSize: FooterSize;

  @Column({ default: 15 })
  defaultTimeout: number;

  @Column({ type: 'simple-array', nullable: true })
  sources?: string[];
}
