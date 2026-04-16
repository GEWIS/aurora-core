import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import BaseEntity from '../../../../root/entities/base-entity';
import { File } from '../../../../files/entities';
import { FooterSize, PosterType } from '../poster';

@Entity()
export default class LocalPoster extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type:'text',
    enum: PosterType
  })
  type: PosterType;

  @Column({ nullable: true })
  expirationDate?: Date;

  @Column({ nullable: true })
  accentColor?: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  protected: boolean;

  @Column({ default: false })
  borrelMode: boolean;

  @Column({
    type: 'text',
    enum: FooterSize,
    default: FooterSize.FULL,
  })
  footerSize: FooterSize;

  @Column({ default: 15 })
  defaultTimeout: number;

  @Column({ nullable: true })
  uri?: string;

  @Column({ type: 'simple-array', nullable: true })
  albums?: number[];

  @OneToOne(() => File, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn()
  file?: File;
}
