import { Column } from 'typeorm';

export default class Colors {
  @Column({ type: 'tinyint', unsigned: true })
  public redChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public greenChannel: number;

  @Column({ type: 'tinyint', unsigned: true })
  public blueChannel: number;
}
