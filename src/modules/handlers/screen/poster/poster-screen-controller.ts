import { Controller } from '@tsoa/runtime';
import {
  Get, Post, Route, Tags,
} from 'tsoa';
import { PosterScreenHandler } from './poster-screen-handler';
import HandlerManager from '../../../root/handler-manager';
import { Screen } from '../../../root/entities';
import { Poster } from '../../../posters/poster';

@Route('screen/poster')
@Tags('Poster screen')
export class PosterScreenController extends Controller {
  private screenHandler: PosterScreenHandler;

  constructor() {
    super();
    this.screenHandler = HandlerManager.getInstance()
      .getHandlers(Screen)
      .filter((h) => h.constructor.name === PosterScreenHandler.name)[0] as PosterScreenHandler;
  }

  @Get('')
  public async getPosters(): Promise<Poster[]> {
    if (!this.screenHandler.posterManager.posters) {
      try {
        await this.screenHandler.posterManager.fetchPosters();
      } catch (e) {
        console.error(e);
      }
    }
    return this.screenHandler.posterManager.posters;
  }

  @Post('force-update')
  public async forceUpdatePosters(): Promise<void> {
    await this.screenHandler.posterManager.fetchPosters();
    this.screenHandler.forceUpdate();
  }
}
