import { Controller } from '@tsoa/runtime';
import { Request } from 'tsoa';
import { Request as ExpressRequest } from 'express';
import BasePosterScreenHandler from './base-poster-screen-handler';
import { Poster } from './poster';
import logger from '../../../../logger';
import OlympicsService from './olympics-service';
import NsTrainsService, { TrainResponse } from './ns-trains-service';
import { HexColor } from '../../../lights/color-definitions';
import { ServerSettingsStore } from '../../../server-settings';
import { ISettings } from '../../../server-settings/server-setting';

export interface BorrelModeParams {
  enabled: boolean;
}

export interface BasePosterResponse {
  posters: Poster[];
}

export interface PosterScreenSettingsResponse {
  defaultMinimal: boolean;
  defaultProgressBarColor: HexColor;
  progressBarLogo: boolean;
  stylesheet: boolean;
  clockShouldTick: boolean;
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
      posters: posters,
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

  public getSettings(): PosterScreenSettingsResponse {
    const store = ServerSettingsStore.getInstance();

    const logo = store.getSetting('Poster.ProgressBarLogo') as ISettings['Poster.ProgressBarLogo'];
    const stylesheet = store.getSetting(
      'Poster.CustomStylesheet',
    ) as ISettings['Poster.CustomStylesheet'];

    return {
      defaultMinimal: store.getSetting(
        'Poster.DefaultMinimal',
      ) as ISettings['Poster.DefaultMinimal'],
      defaultProgressBarColor: store.getSetting(
        'Poster.DefaultProgressBarColor',
      ) as ISettings['Poster.DefaultProgressBarColor'],
      progressBarLogo: logo !== '',
      stylesheet: stylesheet !== '',
      clockShouldTick: store.getSetting(
        'Poster.ClockShouldTick',
      ) as ISettings['Poster.ClockShouldTick'],
    };
  }

  public async getProgressBarLogo(): Promise<{ name: string; data: Buffer } | null> {
    const settingsStore = ServerSettingsStore.getInstance();
    const fileStorage = settingsStore.getFileStorage();

    const logo = ServerSettingsStore.getInstance().getSetting(
      'Poster.ProgressBarLogo',
    ) as ISettings['Poster.ProgressBarLogo'];

    if (logo === '') {
      return null;
    }

    return {
      name: logo.originalName,
      data: await fileStorage.getFile(logo),
    };
  }

  public async getStylesheet(): Promise<{ name: string; data: Buffer } | null> {
    const settingsStore = ServerSettingsStore.getInstance();
    const fileStorage = settingsStore.getFileStorage();

    const stylesheet = ServerSettingsStore.getInstance().getSetting(
      'Poster.CustomStylesheet',
    ) as ISettings['Poster.CustomStylesheet'];

    if (stylesheet === '') {
      return null;
    }

    return {
      name: stylesheet.originalName,
      data: await fileStorage.getFile(stylesheet),
    };
  }
}
