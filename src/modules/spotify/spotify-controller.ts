import { Get, Route, Tags, Request, Query, Delete, Response, Security } from 'tsoa';
import { Controller } from '@tsoa/runtime';
import { Request as ExpressRequest } from 'express';
import * as querystring from 'querystring';
import * as crypto from 'crypto';
import SpotifyApiHandler from './spotify-api-handler';
import { SpotifyUser } from './entities';
import { SecurityNames } from '../../helpers/security';
import SpotifyTrackHandler from './spotify-track-handler';
import { securityGroups } from '../../helpers/security-groups';

interface SpotifyUserResponse {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  spotifyId: string;
  active: boolean;
}

@Route('spotify')
@Tags('Spotify')
export class SpotifyController extends Controller {
  public toResponse(user: SpotifyUser): SpotifyUserResponse {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
      spotifyId: user.spotifyId,
      active: user.active,
    };
  }

  /**
   * Login a user via Spotify. Used to bind the returned spotify user to this server instance.
   * Performs a redirect to the Spotify website
   * @param req
   */
  @Security(SecurityNames.LOCAL, securityGroups.spotify.privileged)
  @Get('login')
  public async spotifyLogin(@Request() req: ExpressRequest) {
    const response = req.res;

    const state = crypto.randomBytes(20).toString('hex');

    response?.cookie('spotifyOAuthState', state, { maxAge: 1000 * 60 * 5, signed: true });

    response?.redirect(
      `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: 'user-read-playback-state user-modify-playback-state user-read-currently-playing',
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state,
      })}`,
    );
  }

  @Security(SecurityNames.LOCAL, securityGroups.spotify.privileged)
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
    return SpotifyApiHandler.getInstance().client?.currentUser.profile();
  }

  // @Post('accept-user-token')
  // public async spotifyAcceptUserToken(@Body() body: AccessToken) {
  //   const sdk = SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID || '', body);
  //   await sdk.authenticate();
  // }

  /**
   * Get the currently active Spotify user.
   */
  @Security(SecurityNames.LOCAL, securityGroups.spotify.base)
  @Get('user')
  @Response('200', 'Active user')
  @Response('204', 'No user active')
  public getCurrentSpotifyUser() {
    const { user } = SpotifyApiHandler.getInstance();
    return user ? this.toResponse(user) : undefined;
  }

  /**
   * Get all existing Spotify users
   */
  @Security(SecurityNames.LOCAL, securityGroups.spotify.privileged)
  @Get('users')
  public async getAllSpotifyUsers() {
    return (await SpotifyUser.find()).map(this.toResponse.bind(this));
  }

  /**
   * Delete an existing Spotify user
   * @param id
   */
  @Security(SecurityNames.LOCAL, securityGroups.spotify.privileged)
  @Delete('users/{id}')
  public async deleteSpotifyUser(id: number) {
    const user = await SpotifyUser.findOne({ where: { id } });
    if (!user) {
      this.setStatus(404);
      return;
    }
    if (SpotifyApiHandler.getInstance().user?.id === user.id) {
      await SpotifyApiHandler.getInstance().unloadSpotifyUser();
    }
    await SpotifyUser.delete(user.id);
  }

  /**
   * Get the Spotify profile from the currently active user
   */
  @Security(SecurityNames.LOCAL, securityGroups.spotify.base)
  @Get('profile')
  @Response('200', 'Active user')
  @Response('204', 'No user active')
  public getSpotifyProfile() {
    return SpotifyApiHandler.getInstance().client?.currentUser.profile();
  }

  /**
   * Get the currently playing track (on Spotify or locally playing). Null if nothing is playing.
   */
  @Security(SecurityNames.LOCAL, securityGroups.spotify.base)
  @Get('currently-playing')
  public getSpotifyCurrentlyPlaying() {
    return SpotifyTrackHandler.getInstance().musicEmitter.getCurrentlyPlayingTrack;
  }
}
