import {
  BaseEntity, Entity, JoinColumn, OneToOne, PrimaryColumn,
} from 'typeorm';
import { Audio, LightsController, Screen } from '../../root/entities';

@Entity()
export default class ApiKey extends BaseEntity {
  @PrimaryColumn()
  public key: string;

  @OneToOne(() => Screen, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public screen?: Screen | null;

  @OneToOne(() => LightsController, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public lightsController?: LightsController | null;

  @OneToOne(() => Audio, { nullable: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  public audio?: Audio | null;
}
