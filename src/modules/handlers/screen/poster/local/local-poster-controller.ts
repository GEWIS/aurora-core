import { Controller, Patch, TsoaResponse, UploadedFile } from '@tsoa/runtime';
import { Body, Delete, Get, Post, Res, Route, Security, Tags } from 'tsoa';
import { SecurityNames } from '../../../../../helpers/security';
import { securityGroups } from '../../../../../helpers/security-groups';
import { HttpStatusCode } from 'axios';
import { LocalPosterResponse } from './local-poster-service';

interface BasePosterParams {
  name: string;
  expirationDate?: Date;
  accentColor?: string;
  footerSize?: string;
  defaultTimeout?: number;
  borrelMode?: boolean;
}

interface MediaPosterParams extends BasePosterParams {
  type: 'media';
}

interface UrlPosterParams extends BasePosterParams {
  type: 'url';
  url: string;
}

interface PhotoPosterParams extends BasePosterParams {
  type: 'photo';
  album: number;
}

export type CreatePosterParams = MediaPosterParams | UrlPosterParams | PhotoPosterParams;

@Route('/handler/screen/poster')
@Tags('Handlers')
export class LocalPosterController extends Controller {
  /**
   * Get all posters from the database.
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('items')
  public async getAllPosters(): Promise<LocalPosterResponse[]> {
    this.setStatus(501);
    return [] as LocalPosterResponse[];
  }

  /**
   * Gets a single poster from the database.
   * @param id The id of the poster to get.
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('items/{id}')
  public async getPoster(id: number): Promise<LocalPosterResponse> {
    this.setStatus(501);
    return {} as LocalPosterResponse;
  }

  /**
   * Creates a new poster of the given type.
   * @param body Body specifying the poster to be created.
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Post('items')
  public async createPoster(@Body() body: CreatePosterParams): Promise<LocalPosterResponse> {
    this.setStatus(501);
    return {} as LocalPosterResponse;
  }

  /**
   * Attaches uploaded file to existing media poster.
   * @param id Id of the poster.
   * @param file File to be attached, has to be an image or video.
   * @param invalidFileTypeResponse
   * @param invalidPosterTypeResponse
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Post('/items/{id}/media')
  public async attachMedia(
    id: number,
    @UploadedFile() file: Express.Multer.File,
    @Res()
    invalidFileTypeResponse: TsoaResponse<
      HttpStatusCode.UnsupportedMediaType,
      'Invalid file type, expected an image or a video.'
    >,
    @Res()
    invalidPosterTypeResponse: TsoaResponse<
      HttpStatusCode.BadRequest,
      'Requested poster is not a media poster.'
    >,
  ): Promise<LocalPosterResponse> {
    this.setStatus(501);
    return {} as LocalPosterResponse;
  }

  /**
   * Deletes a specific poster from the database.
   * @param id Indicates the poster to be deleted.
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Delete('items/{id}')
  public async deletePoster(id: number): Promise<void> {
    this.setStatus(501);
  }

  /**
   * Updates the updatable fields of a specific poster.
   * @param id The id of the to be updated poster.
   * @param body The new values of the fields to be changed as specified in UpdatePosterParams.
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Patch('items/{id}')
  public async updatePoster(
    id: number,
    @Body() body: BasePosterParams,
  ): Promise<LocalPosterResponse> {
    this.setStatus(501);
    return {} as LocalPosterResponse;
  }
}
