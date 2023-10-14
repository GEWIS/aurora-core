import { Column, Entity } from 'typeorm';
import BaseEntity from '../../base/entities/base-entity';

@Entity()
export default class SpotifyUser extends BaseEntity {
  @Column()
  public name: string;

  /**
   * Initial authorization code to get a token from the Spotify API
   */
  @Column()
  public authorizationCode: string;

  /**
   * Refresh token to get a token from the Spotify API
   */
  @Column({ nullable: true })
  public refreshToken?: string;

  /**
   * Whether this account is currently active
   */
  @Column()
  public active: boolean;
}
