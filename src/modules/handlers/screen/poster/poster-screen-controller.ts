import { Controller } from '@tsoa/runtime';
import { Body, Get, Post, Put, Query, Request, Route, Security, Tags } from 'tsoa';
import { Request as ExpressRequest } from 'express';
import PosterScreenHandler from './poster-screen-handler';
// eslint-disable-next-line import/no-cycle -- TODO fix cyclic dependency
import HandlerManager from '../../../root/handler-manager';
import { Screen } from '../../../root/entities';
import { Poster } from './poster';
import { SecurityNames } from '../../../../helpers/security';
import logger from '../../../../logger';
import NsTrainsService, { TrainResponse } from './ns-trains-service';
import GEWISPosterService, { GEWISPhotoAlbumParams } from './gewis-poster-service';
import OlympicsService from './olympics-service';
import { securityGroups } from '../../../../helpers/security-groups';

interface BorrelModeParams {
  enabled: boolean;
}

interface PosterResponse {
  posters: Poster[];
  borrelMode: boolean;
}

@Route('handler/screen/poster')
@Tags('Handlers')
export class PosterScreenController extends Controller {
  private screenHandler: PosterScreenHandler;

  constructor() {
    super();
    this.screenHandler = HandlerManager.getInstance()
      .getHandlers(Screen)
      .filter((h) => h.constructor.name === PosterScreenHandler.name)[0] as PosterScreenHandler;
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('')
  public async getPosters(@Query() alwaysReturnBorrelPosters?: boolean): Promise<PosterResponse> {
    if (!this.screenHandler.posterManager.posters) {
      try {
        await this.screenHandler.posterManager.fetchPosters();
      } catch (e) {
        logger.error(e);
      }
    }
    const posters = this.screenHandler.posterManager.posters ?? [];
    if (alwaysReturnBorrelPosters || this.screenHandler.borrelMode) {
      return {
        posters,
        borrelMode: this.screenHandler.borrelMode,
      };
    }
    return {
      posters: posters.filter((p) => !p.borrelMode),
      borrelMode: false,
    };
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Post('force-update')
  public async forceUpdatePosters(@Request() req: ExpressRequest): Promise<void> {
    logger.audit(req.user, 'Force fetch posters from source.');
    await this.screenHandler.posterManager.fetchPosters();
    this.screenHandler.forceUpdate();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('borrel-mode')
  public async getPosterBorrelMode(): Promise<BorrelModeParams> {
    return { enabled: this.screenHandler.borrelMode };
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Put('borrel-mode')
  public async setPosterBorrelMode(
    @Request() req: ExpressRequest,
    @Body() body: BorrelModeParams,
  ): Promise<void> {
    logger.audit(
      req.user,
      `Set poster screen borrel mode to "${body.enabled ? 'true' : 'false'}".`,
    );
    this.screenHandler.setBorrelModeEnabled(body.enabled);
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.subscriber)
  @Get('train-departures')
  public async getTrains(): Promise<TrainResponse[]> {
    return new NsTrainsService().getTrains();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.subscriber)
  @Post('photo')
  public async getPhoto(@Body() params: GEWISPhotoAlbumParams) {
    return new GEWISPosterService().getPhoto(params);
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.subscriber)
  @Get('olympics/medal-table')
  public async getOlympicsMedalTable() {
    return new OlympicsService().getMedalTable();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.subscriber)
  @Get('olympics/country-medals')
  public async getDutchOlympicMedals() {
    return new OlympicsService().getDutchMedals();
  }
}
