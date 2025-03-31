import HandlerManager from './handler-manager';
import { DataSourceSingleton } from '@gewis/aurora-core-database-util';
import { Audio, Screen } from './entities';
import { LightsGroup } from '../lights/entities';
import ModeManager from '../modes/mode-manager';
import RootLightsOperationsService from './root-lights-operations-service';
import { DEFAULT_MASTER_DIMMER } from '../lights/entities/lights-group-fixture';

export default class HandlerService {
  private handlerManager: HandlerManager;

  private modeManager: ModeManager;

  constructor() {
    this.handlerManager = HandlerManager.getInstance();
    this.modeManager = ModeManager.getInstance();
  }

  async resetToDefaults() {
    const audios = await DataSourceSingleton.getInstance().get().getRepository(Audio).find();
    const screens = await DataSourceSingleton.getInstance().get().getRepository(Screen).find();
    const lights = await DataSourceSingleton.getInstance().get().getRepository(LightsGroup).find();

    // Set all subscribers to their default handlers (can be none)
    audios.forEach((audio) => this.handlerManager.registerHandler(audio, audio.defaultHandler));
    screens.forEach((screen) => this.handlerManager.registerHandler(screen, screen.defaultHandler));
    lights.forEach((group) => this.handlerManager.registerHandler(group, group.defaultHandler));

    // Reset handlers
    this.handlerManager.resetHandlers();

    // Disable all modes
    this.modeManager.reset();

    // Set all master dimmers back to their defaults
    const rootLightsOpsService = new RootLightsOperationsService();
    await Promise.all(lights.map((l) => rootLightsOpsService.resetLightsGroupRelativeBrightness(l.id)));
  }
}
