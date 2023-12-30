import { Controller } from '@tsoa/runtime';
import { Route, Tags } from 'tsoa';
import { PosterScreenHandler } from './poster-screen-handler';
import HandlerManager from '../../../root/handler-manager';
import { Screen } from '../../../root/entities';

@Route('screen/poster')
@Tags('Poster screen')
export class PosterScreenController extends Controller {
  private screenHandlers: PosterScreenHandler[];

  constructor() {
    super();
    this.screenHandlers = HandlerManager.getInstance()
      .getHandlers(Screen)
      .filter((h) => h.constructor.name === PosterScreenHandler.name) as PosterScreenHandler[];
  }
}
