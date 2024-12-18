import { Controller } from '@tsoa/runtime';
import { Request } from 'tsoa';
import { Request as ExpressRequest } from 'express';
import BasePosterScreenHandler from './base-poster-screen-handler';
import { Poster } from './poster';
import logger from '../../../../logger';
import OlympicsService from './olympics-service';
import NsTrainsService, { TrainResponse } from './ns-trains-service';

export interface BorrelModeParams {
  enabled: boolean;
}

export interface BasePosterResponse {
  posters: Poster[];
}

export abstract class BasePosterScreenController extends Controller {
  protected screenHandler: BasePosterScreenHandler;

  protected constructor() {
    super();
  }

  public async getPosters(): Promise<BasePosterResponse> {
    if (!this.screenHandler.posterManager.posters) {
      try {
        await this.screenHandler.posterManager.fetchPosters();
      } catch (e) {
        logger.error(e);
      }
    }
    const posters = this.screenHandler.posterManager.posters ?? [];
    return {
      posters: posters
    };
  }

  public async forceUpdatePosters(@Request() req: ExpressRequest): Promise<void> {
    logger.audit(req.user, 'Force fetch posters from source.');
    await this.screenHandler.posterManager.fetchPosters();
    this.screenHandler.forceUpdate();
  }

  public async getTrains(): Promise<TrainResponse[]> {
    return new NsTrainsService().getTrains();
  }

  public async getOlympicsMedalTable() {
    return new OlympicsService().getMedalTable();
  }
}
