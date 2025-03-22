import {
  BasePosterResponse,
  BasePosterScreenController,
  BorrelModeParams,
} from '../base-poster-screen-controller';
import HandlerManager from '../../../../root/handler-manager';
import { Screen } from '../../../../root/entities';
import { GewisPosterScreenHandler } from '../../index';
import { Body, Get, Post, Put, Query, Request, Route, Security, Tags } from 'tsoa';
import { SecurityNames } from '@gewis/aurora-core-util';
import { securityGroups } from '@gewis/aurora-core-util';
import logger from '@gewis/aurora-core-logger';
import { Request as ExpressRequest } from 'express';
import { TrainResponse } from '../ns-trains-service';
import GEWISPosterService, { GEWISPhotoAlbumParams } from './gewis-poster-service';
import OlympicsService from '../olympics-service';
import { FeatureEnabled } from '../../../../server-settings';

interface GewisPosterResponse extends BasePosterResponse {
  borrelMode: boolean;
}

@Route('handler/screen/gewis-poster')
@Tags('Handlers')
@FeatureEnabled('GewisPosterScreenHandler')
export class GewisPosterScreenController extends BasePosterScreenController {
  protected declare screenHandler: GewisPosterScreenHandler;

  constructor() {
    super();
    this.screenHandler = HandlerManager.getInstance()
      .getHandlers(Screen)
      .filter(
        (h) => h.constructor.name === GewisPosterScreenHandler.name,
      )[0] as GewisPosterScreenHandler;
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('')
  public async getGewisPosters(
    @Query() alwaysReturnBorrelPosters?: boolean,
  ): Promise<GewisPosterResponse> {
    const postersRes = await super.getPosters();
    if (alwaysReturnBorrelPosters || this.screenHandler.borrelMode) {
      return {
        posters: postersRes.posters,
        borrelMode: this.screenHandler.borrelMode,
      };
    }
    return {
      posters: postersRes.posters.filter((p) => !p.borrelMode),
      borrelMode: false,
    };
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Post('force-update')
  public async forceUpdateGewisPosters(@Request() req: ExpressRequest): Promise<void> {
    super.forceUpdatePosters(req);
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

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('train-departures')
  public async getTrains(): Promise<TrainResponse[]> {
    return super.getTrains();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Post('photo')
  public async getPhoto(@Body() params: GEWISPhotoAlbumParams) {
    return new GEWISPosterService().getPhoto(params);
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('olympics/medal-table')
  public async getOlympicsMedalTable() {
    return super.getOlympicsMedalTable();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('olympics/country-medals')
  public async getDutchOlympicMedals() {
    return new OlympicsService().getDutchMedals();
  }
}
