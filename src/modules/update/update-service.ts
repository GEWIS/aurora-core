import { ApiKey } from '../auth/entities';
import dataSource from '../../database';
import { Audio, Screen, LightsController } from '../root/entities';
import { IntegrationUser } from '../auth/integration/entities';

export default class UpdateService {
  public async updateSubscribeEntityVersion(
    params: { gitRepositoryUrl?: string; currentVersion?: string },
    identity: ApiKey,
  ): Promise<void> {
    if (identity.audio) {
      const repo = dataSource.getRepository(Audio);
      identity.audio.versioning.updateValues(params);
      await repo.save(identity.audio);
    }
    if (identity.screen) {
      const repo = dataSource.getRepository(Screen);
      identity.screen.versioning.updateValues(params);
      await repo.save(identity.screen);
    }
    if (identity.lightsController) {
      const repo = dataSource.getRepository(LightsController);
      identity.lightsController.versioning.updateValues(params);
      await repo.save(identity.lightsController);
    }
    if (identity.integrationUser) {
      const repo = dataSource.getRepository(IntegrationUser);
      identity.integrationUser.versioning.updateValues(params);
      await repo.save(identity.integrationUser);
    }
  }
}
