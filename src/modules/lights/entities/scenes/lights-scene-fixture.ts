import { BaseEntity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle -- cross reference
import LightsScene from './lights-scene';

export default class LightsSceneFixture extends BaseEntity {
  @PrimaryColumn()
  public sceneId: number;

  @ManyToOne(() => LightsScene)
  @JoinColumn({ name: 'sceneId' })
  public scene: LightsScene;

  @Column({
    type: 'varchar',
    transformer: {
      from(value: string): number[] {
        return JSON.parse(value);
      },
      to(value: number[]): string {
        return JSON.stringify(value);
      }
    }
  })
  public dmxValues: number[];
}
