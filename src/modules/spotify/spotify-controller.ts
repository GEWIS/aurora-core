import {
  Get, Route, Tags, Request, Query,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import { Request as ExpressRequest } from 'express';
import * as querystring from 'querystring';
import * as crypto from 'crypto';
import SpotifyApiHandler from './spotify-api-handler';

@Route('spotify')
@Tags('Spotify')
export class SpotifyController extends Controller {
  /**
   * Login a user via Spotify. Used to bind the returned spotify user to this server instance.
   * Performs a redirect to the Spotify website
   * @param req
   */
  @Get('login')
  public async spotifyLogin(@Request() req: ExpressRequest) {
    const response = req.res;

    const state = crypto.randomBytes(20).toString('hex');

    response?.cookie('spotifyOAuthState', state, { maxAge: 1000 * 60 * 5, signed: true });

    response?.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-playback-position',
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state,
    })}`);
  }

  @Get('callback')
  public async spotifyLoginCallback(
  @Request() req: ExpressRequest,
    @Query() state: string,
    @Query() code?: string,
    @Query() error?: string,
  ) {
    const { spotifyOAuthState } = req.signedCookies;
    if (state !== spotifyOAuthState) {
      this.setStatus(422);
      return 'Invalid state';
    }

    if (!code || error) {
      this.setStatus(400);
      return `Could not log in: ${error}`;
    }

    await SpotifyApiHandler.getInstance().bindSpotifyUser(code);
    return SpotifyApiHandler.getInstance().client.currentUser.profile();
  }

  // @Post('accept-user-token')
  // public async spotifyAcceptUserToken(@Body() body: AccessToken) {
  //   const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID || '', body);
  //   await sdk.authenticate();
  // }

  @Get('user')
  public getSpotifyUser() {
    return SpotifyApiHandler.getInstance().user;
  }

  @Get('profile')
  public getSpotifyProfile() {
    return SpotifyApiHandler.getInstance().client.currentUser.profile();
  }
}
