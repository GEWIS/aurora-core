import { Column } from 'typeorm';

export default class Movement {
  @Column({ type: 'tinyint', unsigned: true })
  public panChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public finePanChannel?: number | null;

  @Column({ type: 'tinyint', unsigned: true })
  public tiltChannel: number;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public fineTiltChannel?: number | null;

  @Column({ type: 'tinyint', nullable: true, unsigned: true })
  public movingSpeedChannel?: number | null;
}
