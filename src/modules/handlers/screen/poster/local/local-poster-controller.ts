import { Controller, TsoaResponse, UploadedFile } from '@tsoa/runtime';
import { Body, Delete, Get, Post, Request, Res, Route, Security, Tags } from 'tsoa';
import { StaticPosterHandler } from '../../index';
import HandlerManager from '../../../../root/handler-manager';
import { Screen } from '../../../../root/entities';
import { SecurityNames } from '../../../../../helpers/security';
import { securityGroups } from '../../../../../helpers/security-groups';
import LocalPosterService, { LocalPosterResponse } from './local-poster-service';
import { Request as ExpressRequest } from 'express';
import logger from '../../../../../logger';
import path from 'node:path';
import { HttpStatusCode } from 'axios';
import { StaticPosterHandlerState } from '../static-poster-handler';

interface SetClockRequest {
  visible: boolean;
}

@Route('handler/screen/poster/static')
@Tags('Handlers')
export class LocalPosterController extends Controller {
  private screenHandler: StaticPosterHandler;

  constructor() {
    super();
    this.screenHandler = HandlerManager.getInstance()
      .getHandlers(Screen)
      .filter((h) => h.constructor.name === StaticPosterHandler.name)[0] as StaticPosterHandler;
  }

  /**
   * Return the current state (or settings) of the static poster handler
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('')
  public async getStaticPosterHandlerState(): Promise<StaticPosterHandlerState> {
    return this.screenHandler.getState();
  }

  /**
   * Hide the static poster currently shown on screens. The subscribers should
   * revert to their default view.
   * @param req
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Delete('')
  public async hideStaticPoster(@Request() req: ExpressRequest): Promise<void> {
    logger.audit(req.user, `Hide static poster.`);
    this.screenHandler.removeActivePoster();
  }

  /**
   * Chang the visibility of the clock on-screen
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Post('clock')
  public async setStaticPosterClock(
    @Request() req: ExpressRequest,
    @Body() body: SetClockRequest,
  ): Promise<void> {
    const { visible } = body;
    if (visible) {
      logger.audit(req.user, 'Make clock in StaticPosterHandler visible.');
    } else {
      logger.audit(req.user, 'Make clock in StaticPosterHandler invisible.');
    }

    this.screenHandler.setClockVisibility(visible);
  }

  /**
   * Get all static posters from the database.
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('items')
  public async getAllStaticPosters(): Promise<LocalPosterResponse[]> {
    const service = new LocalPosterService();
    const posters = await service.getAllLocalPosters();
    return posters.map((p) => service.toResponse(p));
  }

  /**
   * Create a new static poster based on a file (image or video).
   * @param file
   * @param invalidFileTypeResponse
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Post('items')
  public async createStaticPoster(
    @UploadedFile() file: Express.Multer.File,
    @Res()
    invalidFileTypeResponse: TsoaResponse<
      HttpStatusCode.BadRequest,
      'Invalid file type, expected an image or a video.'
    >,
  ): Promise<LocalPosterResponse> {
    const ext = path.extname(file.originalname);
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.avi', '.mkv'];
    if (!allowedExtensions.includes(ext)) {
      return invalidFileTypeResponse(
        HttpStatusCode.BadRequest,
        'Invalid file type, expected an image or a video.',
      );
    }

    const service = new LocalPosterService();
    const poster = await service.createLocalPoster({
      file: { name: file.originalname, data: file.buffer },
    });
    return service.toResponse(poster);
  }

  /**
   * Permanently delete a static poster.
   * @param id
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Delete('items/{id}')
  public async deleteStaticPoster(id: number): Promise<void> {
    const service = new LocalPosterService();
    await service.deleteLocalPoster(id);
  }

  /**
   * Show the given static poster on all screens using the StaticPosterHandler.
   * @param id
   * @param req
   */
  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Post('items/{id}/show')
  public async showStaticPoster(id: number, @Request() req: ExpressRequest): Promise<void> {
    const service = new LocalPosterService();
    const poster = await service.getSingleLocalPoster(id);
    const posterResponse = service.toResponse(poster);

    logger.audit(req.user, `Show static poster (id: ${id}).`);
    this.screenHandler.setActivePoster(posterResponse);
  }
}
