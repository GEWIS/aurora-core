import {
  Body, Post, Route, Tags,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import HandlerManager from './handler-manager';
import { LightsGroup } from '../lights/entities';

interface GroupFixtureOverrideParams {
  dmxValues: (number | null)[];
}

@Route('lights')
@Tags('Lights')
export class RootLightsOverrideController extends Controller {
  private getGroups(): LightsGroup[] {
    const manager = HandlerManager.getInstance();
    return manager.getHandlers(LightsGroup)
      .map((handler) => handler.entities).flat() as LightsGroup[];
  }

  @Post('group/par/{id}/override')
  public async setGroupParOverride(id: number, @Body() params: GroupFixtureOverrideParams) {
    const pars = this.getGroups().map((g) => g.pars).flat();
    const chosenPar = pars.find((p) => p.id === id);
    if (chosenPar === undefined) {
      this.setStatus(404);
      return;
    }

    chosenPar.fixture.setOverrideDmx(params.dmxValues);
  }

  @Post('group/moving-head-rgb/{id}/override')
  public async setGroupMovingHeadRgbOverride(
    id: number,
    @Body() params: GroupFixtureOverrideParams,
  ) {
    const movingHeadRgbs = this.getGroups().map((g) => g.movingHeadRgbs).flat();
    const chosenMovingHead = movingHeadRgbs.find((p) => p.id === id);
    if (chosenMovingHead === undefined) {
      this.setStatus(404);
      return;
    }

    chosenMovingHead.fixture.setOverrideDmx(params.dmxValues);
  }

  @Post('group/moving-head-wheel/{id}/override')
  public async setGroupMovingHeadWheelOverride(
    id: number,
    @Body() params: GroupFixtureOverrideParams,
  ) {
    const movingHeadWheels = this.getGroups().map((g) => g.movingHeadWheels).flat();
    const chosenMovingHead = movingHeadWheels.find((p) => p.id === id);
    if (chosenMovingHead === undefined) {
      this.setStatus(404);
      return;
    }

    chosenMovingHead.fixture.setOverrideDmx(params.dmxValues);
  }
}
