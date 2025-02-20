import BaseEntity from '../../../../root/entities/base-entity';
import { File } from '../../../../files/entities';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export default class LocalPoster extends BaseEntity {
  /**
   * File details of the poster, if locally stored on disk
   */
  @OneToOne(() => File, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn()
  file?: File;

  /**
   * URI of the poster if stored somewhere else
   */
  @Column({ nullable: true })
  uri?: string;
}
