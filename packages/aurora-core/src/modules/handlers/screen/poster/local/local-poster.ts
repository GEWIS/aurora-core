import { BaseEntity } from '@gewis/aurora-core-util';
import { File } from '@gewis/aurora-core-files';
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
