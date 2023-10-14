import { AccessToken, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { Repository } from 'typeorm';
import { SpotifyUser } from './entities';
import dataSource from '../../database';

export default class SpotifyHandler {
  private static instance: SpotifyHandler;

  private sdk: SpotifyApi;

  private currentUser: SpotifyUser;

  private repository: Repository<SpotifyUser>;

  constructor() {
    this.repository = dataSource.getRepository(SpotifyUser);
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new SpotifyHandler();
    }
    return this.instance;
  }

  /**
   * Get a Spotify API access token for the given Spotify user
   * @param user
   * @private
   */
  public async getAccessToken(user: SpotifyUser): Promise<AccessToken> {
    const content: { [key: string]: string } = {
      grant_type: user.refreshToken ? 'refresh_token' : 'authorization_code',
      code: user.refreshToken ? user.refreshToken : user.authorizationCode,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
    };

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams(content),
      headers: {
        Authorization: `Basic ${btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });
    const json = await response.json();
    if (!response.ok) throw new Error(`Could not get access token: ${json.error}`);

    const accessToken = json as AccessToken;

    if (accessToken.refresh_token) {
      // eslint-disable-next-line no-param-reassign
      user.refreshToken = accessToken.refresh_token;
      await this.repository.save(user);
    }

    return json;
  }

  public async setSpotifyUser(user: SpotifyUser) {
    if (this.currentUser?.id === user.id) return;

    const accessToken = await this.getAccessToken(user);
    if (this.currentUser) {
      this.currentUser.active = false;
      await this.repository.save(this.currentUser);
    }

    this.sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID || '', accessToken);
    this.currentUser = user;
    if (!this.currentUser.active) {
      this.currentUser.active = true;
      await this.repository.save(this.currentUser);
    }
  }

  public get client() {
    return this.sdk;
  }
}
