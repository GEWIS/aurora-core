import HandlerManager from '../../../root/handler-manager';
import { Screen } from '../../../root/entities';
import { CarouselPosterHandler } from '../index';
import { Body, Get, Post, Put, Query, Request, Route, Security, Tags } from 'tsoa';
import { SecurityNames } from '../../../../helpers/security';
import { securityGroups } from '../../../../helpers/security-groups';
import logger from '../../../../logger';
import { Request as ExpressRequest } from 'express';
import NsTrainsService, { TrainResponse } from './ns-trains-service';
import GEWISPosterService, { GEWISPhotoAlbumParams } from './gewis-poster-service';
import OlympicsService from './olympics-service';
import { FeatureEnabled, ServerSettingsStore } from '../../../server-settings';
import { Controller } from '@tsoa/runtime';
import { Poster } from './poster';
import { ISettings } from '../../../server-settings/server-setting';

export interface BorrelModeParams {
  enabled: boolean;
}

export interface BorrelModeResponse extends BorrelModeParams {
  present: boolean;
}

export interface PosterResponse {
  posters: Poster[];
  borrelMode: boolean;
}

@Route('handler/screen/poster/carousel')
@Tags('Handlers')
@FeatureEnabled('Poster')
export class CarouselPosterController extends Controller {
  protected screenHandler: CarouselPosterHandler;

  constructor() {
    super();
    this.screenHandler = HandlerManager.getInstance()
      .getHandlers(Screen)
      .filter((h) => h.constructor.name === CarouselPosterHandler.name)[0] as CarouselPosterHandler;
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
        posters: posters,
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
  public async forceUpdateGewisPosters(@Request() req: ExpressRequest): Promise<void> {
    logger.audit(req.user, 'Force fetch posters from source.');
    await this.screenHandler.posterManager.fetchPosters();
    this.screenHandler.forceUpdate();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('borrel-mode')
  public async getPosterBorrelMode(): Promise<BorrelModeResponse> {
    return {
      present: this.screenHandler.borrelModeIsPresent(),
      enabled: this.screenHandler.borrelMode,
    };
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Put('borrel-mode')
  @FeatureEnabled('Poster.BorrelModePresent')
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

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('train-departures')
  public async getTrains(): Promise<TrainResponse[]> {
    return new NsTrainsService().getTrains();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Post('photo')
  public async getPhoto(@Body() params: GEWISPhotoAlbumParams) {
    return new GEWISPosterService().getPhoto(params);
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('olympics/medal-table')
  public async getOlympicsMedalTable() {
    return new OlympicsService().getMedalTable();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('olympics/country-medals')
  public async getDutchOlympicMedals() {
    return new OlympicsService().getDutchMedals();
  }
}
