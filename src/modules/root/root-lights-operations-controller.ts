import {
  Body, Post, Route, Tags,
} from 'tsoa';
import { Controller } from '@tsoa/runtime';
import HandlerManager from './handler-manager';
import { LightsGroup } from '../lights/entities';
import { StrobeProps } from '../lights/effects/strobe';

interface GroupFixtureOverrideParams {
  dmxValues: (number | null)[];
}

@Route('lights')
@Tags('Lights')
export class RootLightsOperationsController extends Controller {
  private getGroups(): LightsGroup[] {
    const manager = HandlerManager.getInstance();
    return manager.getHandlers(LightsGroup)
      .map((handler) => handler.entities).flat() as LightsGroup[];
  }

  /**
   * Enable the strobe for all fixtures in the given group
   */
  @Post('group/{id}/strobe/enable')
  public async enableStrobeOnLightsGroup(id: number, @Body() params: StrobeProps = {}) {
    const lightsGroup = this.getGroups().find((g) => g.id === id);
    if (!lightsGroup) {
      this.setStatus(404);
      return;
    }

    lightsGroup.enableStrobe(params?.durationMs);
  }

  /**
   * Disable the strobe for all fixtures in the given group
   */
  @Post('group/{id}/strobe/disable')
  public async disableStrobeOnLightsGroup(id: number) {
    const lightsGroup = this.getGroups().find((g) => g.id === id);
    if (!lightsGroup) {
      this.setStatus(404);
      return;
    }

    lightsGroup.disableStrobe();
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

  /**
   * Perform the fixture's internal reset operation if possible. Do nothing otherwise
   * @param id
   */
  @Post('group/par/{id}/reset')
  public async resetGroupPar(id: number) {
    const pars = this.getGroups().map((g) => g.pars).flat();
    const chosenPar = pars.find((p) => p.id === id);
    if (chosenPar === undefined) {
      this.setStatus(404);
      return;
    }

    const success = chosenPar.fixture.reset();
    if (!success) {
      this.setStatus(422);
    }
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

  /**
   * Perform the fixture's internal reset operation if possible. Do nothing otherwise
   * @param id
   */
  @Post('group/moving-head-rgb/{id}/reset')
  public async resetGroupMovingHeadRgb(id: number) {
    const movingHeadRgbs = this.getGroups().map((g) => g.movingHeadRgbs).flat();
    const chosenMovingHead = movingHeadRgbs.find((p) => p.id === id);
    if (chosenMovingHead === undefined) {
      this.setStatus(404);
      return;
    }

    const success = chosenMovingHead.fixture.reset();
    if (!success) {
      this.setStatus(422);
    }
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

  /**
   * Perform the fixture's internal reset operation if possible. Do nothing otherwise
   * @param id
   */
  @Post('group/moving-head-wheel/{id}/reset')
  public async resetGroupMovingHeadWheel(id: number) {
    const movingHeadWheels = this.getGroups().map((g) => g.movingHeadWheels).flat();
    const chosenMovingHead = movingHeadWheels.find((p) => p.id === id);
    if (chosenMovingHead === undefined) {
      this.setStatus(404);
      return;
    }

    const success = chosenMovingHead.fixture.reset();
    if (!success) {
      this.setStatus(422);
    }
  }
}
