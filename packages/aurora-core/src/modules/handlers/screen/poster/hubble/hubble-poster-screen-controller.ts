import { BasePosterResponse, BasePosterScreenController } from '../base-poster-screen-controller';
import HandlerManager from '../../../../root/handler-manager';
import { Screen } from '../../../../root/entities';
import BasePosterScreenHandler from '../base-poster-screen-handler';
import { HubblePosterScreenHandler } from '../../index';
import { Get, Post, Request, Route, Security, Tags } from 'tsoa';
import { SecurityNames } from '@gewis/aurora-core-util';
import { securityGroups } from '@gewis/aurora-core-util';
import { Request as ExpressRequest } from 'express';
import { FeatureEnabled } from '../../../../server-settings';

@Route('handler/screen/hubble-poster')
@Tags('Handlers')
@FeatureEnabled('HubblePosterScreenHandler')
export class HubblePosterScreenController extends BasePosterScreenController {
  constructor() {
    super();
    this.screenHandler = HandlerManager.getInstance()
      .getHandlers(Screen)
      .filter(
        (h) => h.constructor.name === HubblePosterScreenHandler.name,
      )[0] as BasePosterScreenHandler;
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.base)
  @Get('')
  public async getHubblePosters(): Promise<BasePosterResponse> {
    return super.getPosters();
  }

  @Security(SecurityNames.LOCAL, securityGroups.poster.privileged)
  @Post('force-update')
  public async forceUpdateHubblePosters(@Request() req: ExpressRequest): Promise<void> {
    super.forceUpdatePosters(req);
  }
}
