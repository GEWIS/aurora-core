import { Column } from 'typeorm';

export default class BaseFile {
  @Column()
  public downloadName: string;

  @Column()
  public location: string;
}
