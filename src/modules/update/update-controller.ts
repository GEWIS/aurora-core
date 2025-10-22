import { Request } from 'express';
import { ApiKey } from '../auth/entities';
import UpdateService from './update-service';

export default class UpdateController {
  public async updateSubscribeEntityGitRepo(req: Request, identity: ApiKey): Promise<void> {
    let gitRepositoryUrl: string | undefined;
    let currentVersion: string | undefined;

    if (req.body.gitRepositoryUrl && typeof req.body.gitRepositoryUrl === 'string') {
      gitRepositoryUrl = req.body.gitRepositoryUrl;
    }
    if (req.body.currentVersion && typeof req.body.currentVersion === 'string') {
      currentVersion = req.body.currentVersion;
    }

    await new UpdateService().updateSubscribeEntityVersion(
      { gitRepositoryUrl, currentVersion },
      identity,
    );
  }
}
