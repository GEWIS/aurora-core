import { Body, Post, Route, Security, Tags } from 'tsoa';
import { Controller } from '@tsoa/runtime';
import HandlerManager from './handler-manager';
import { LightsGroup } from '../lights/entities';
import { StrobeProps } from '../lights/effects/color/strobe';
import { SecurityGroup } from '../../helpers/security';

interface GroupFixtureOverrideParams {
  dmxValues: (number | null)[];
}

@Route('lights')
@Tags('Lights')
export class RootLightsOperationsController extends Controller {
  private getGroups(): LightsGroup[] {
    const manager = HandlerManager.getInstance();
    return manager
      .getHandlers(LightsGroup)
      .map((handler) => handler.entities)
      .flat() as LightsGroup[];
  }

  /**
   * Enable the strobe for all fixtures in the given group
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
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
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/{id}/strobe/disable')
  public async disableStrobeOnLightsGroup(id: number) {
    const lightsGroup = this.getGroups().find((g) => g.id === id);
    if (!lightsGroup) {
      this.setStatus(404);
      return;
    }

    lightsGroup.disableStrobe();
  }

  /**
   * Store the next state of all fixtures in the given LightsGroup and do not change them anymore
   * (i.e. freeze the fixture in its current state)
   * @param id
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/{id}/freeze')
  public async freezeLightsGroup(id: number) {
    const group = this.getGroups().find((g) => g.id === id);
    if (group === undefined) {
      this.setStatus(404);
      return;
    }

    group.fixtures.forEach((f) => f.fixture.freezeDmx());
  }

  /**
   * Unfreeze the DMX values
   * @param id
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/{id}/unfreeze')
  public async unfreezeLightsGroup(id: number) {
    const group = this.getGroups().find((g) => g.id === id);
    if (group === undefined) {
      this.setStatus(404);
      return;
    }

    group.fixtures.forEach((f) => f.fixture.unfreezeDmx());
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/par/{id}/override')
  public async setGroupParOverride(id: number, @Body() params: GroupFixtureOverrideParams) {
    const pars = this.getGroups()
      .map((g) => g.pars)
      .flat();
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
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/par/{id}/reset')
  public async resetGroupPar(id: number) {
    const pars = this.getGroups()
      .map((g) => g.pars)
      .flat();
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

  /**
   * Store the next state of the fixture and do not change anymore
   * (i.e. freeze the fixture in its current state)
   * @param id
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/par/{id}/freeze')
  public async freezeGroupPar(id: number) {
    const pars = this.getGroups()
      .map((g) => g.pars)
      .flat();
    const chosenPar = pars.find((p) => p.id === id);
    if (chosenPar === undefined) {
      this.setStatus(404);
      return;
    }

    chosenPar.fixture.freezeDmx();
  }

  /**
   * Unfreeze the DMX values
   * @param id
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/par/{id}/unfreeze')
  public async unfreezeGroupPar(id: number) {
    const pars = this.getGroups()
      .map((g) => g.pars)
      .flat();
    const chosenPar = pars.find((p) => p.id === id);
    if (chosenPar === undefined) {
      this.setStatus(404);
      return;
    }

    chosenPar.fixture.unfreezeDmx();
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/moving-head-rgb/{id}/override')
  public async setGroupMovingHeadRgbOverride(
    id: number,
    @Body() params: GroupFixtureOverrideParams
  ) {
    const movingHeadRgbs = this.getGroups()
      .map((g) => g.movingHeadRgbs)
      .flat();
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
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/moving-head-rgb/{id}/reset')
  public async resetGroupMovingHeadRgb(id: number) {
    const movingHeadRgbs = this.getGroups()
      .map((g) => g.movingHeadRgbs)
      .flat();
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

  /**
   * Store the next state of the fixture and do not change anymore
   * (i.e. freeze the fixture in its current state)
   * @param id
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/moving-head-rgb/{id}/freeze')
  public async freezeGroupMovingHeadRgb(id: number) {
    const movingHead = this.getGroups()
      .map((g) => g.movingHeadRgbs)
      .flat();
    const chosenMovingHead = movingHead.find((p) => p.id === id);
    if (chosenMovingHead === undefined) {
      this.setStatus(404);
      return;
    }

    chosenMovingHead.fixture.freezeDmx();
  }

  /**
   * Unfreeze the DMX values
   * @param id
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/moving-head-rgb/{id}/unfreeze')
  public async unfreezeMovingHeadRgb(id: number) {
    const pars = this.getGroups()
      .map((g) => g.movingHeadRgbs)
      .flat();
    const chosenPar = pars.find((p) => p.id === id);
    if (chosenPar === undefined) {
      this.setStatus(404);
      return;
    }

    chosenPar.fixture.unfreezeDmx();
  }

  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/moving-head-wheel/{id}/override')
  public async setGroupMovingHeadWheelOverride(
    id: number,
    @Body() params: GroupFixtureOverrideParams
  ) {
    const movingHeadWheels = this.getGroups()
      .map((g) => g.movingHeadWheels)
      .flat();
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
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/moving-head-wheel/{id}/reset')
  public async resetGroupMovingHeadWheel(id: number) {
    const movingHeadWheels = this.getGroups()
      .map((g) => g.movingHeadWheels)
      .flat();
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

  /**
   * Store the next state of the fixture and do not change anymore
   * (i.e. freeze the fixture in its current state)
   * @param id
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/moving-head-wheel/{id}/freeze')
  public async freezeGroupMovingHeadWheel(id: number) {
    const movingHead = this.getGroups()
      .map((g) => g.movingHeadRgbs)
      .flat();
    const chosenMovingHead = movingHead.find((p) => p.id === id);
    if (chosenMovingHead === undefined) {
      this.setStatus(404);
      return;
    }

    chosenMovingHead.fixture.freezeDmx();
  }

  /**
   * Unfreeze the DMX values
   * @param id
   */
  @Security('local', [
    SecurityGroup.ADMIN,
    SecurityGroup.AVICO,
    SecurityGroup.BAC,
    SecurityGroup.BOARD
  ])
  @Post('group/moving-head-wheel/{id}/unfreeze')
  public async unfreezeMovingHeadWheel(id: number) {
    const pars = this.getGroups()
      .map((g) => g.movingHeadWheels)
      .flat();
    const chosenPar = pars.find((p) => p.id === id);
    if (chosenPar === undefined) {
      this.setStatus(404);
      return;
    }

    chosenPar.fixture.unfreezeDmx();
  }
}
