import { Repository } from 'typeorm';
import crypto from 'crypto';
import { ApiKey, IntegrationUser } from './entities';
import { DataSourceSingleton } from '@gewis/aurora-core-database-util';
import { LightsController } from '../root/entities';
import { Audio } from '@gewis/aurora-core-audio-handler';
import { ScreenEntity as Screen } from '@gewis/aurora-core-screen';

export interface GenerateApiKeyParams {
  audio?: Audio | null;
  screen?: Screen | null;
  lightsController?: LightsController | null;
  integrationUser?: IntegrationUser | null;
}

export interface IntegrationUserCreateParams extends Pick<IntegrationUser, 'name'> {}

export default class AuthService {
  private apiKeyRepository: Repository<ApiKey>;

  private integrationUserRepository: Repository<IntegrationUser>;

  constructor() {
    this.apiKeyRepository = DataSourceSingleton.getInstance().get().getRepository(ApiKey);
    this.integrationUserRepository = DataSourceSingleton.getInstance().get().getRepository(IntegrationUser);
  }

  private generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public async createApiKey({ audio, screen, lightsController, integrationUser }: GenerateApiKeyParams) {
    return this.apiKeyRepository.save({
      key: this.generateKey(),
      audio,
      screen,
      lightsController,
      integrationUser,
    });
  }

  public async getAudioApiKey(audio: Audio) {
    return this.apiKeyRepository.findOne({ where: { audio: { id: audio.id } } });
  }

  public async getScreenApiKey(screen: Screen) {
    return this.apiKeyRepository.findOne({ where: { screen: { id: screen.id } } });
  }

  public async getLightsControllerApiKey(lightsController: LightsController) {
    return this.apiKeyRepository.findOne({
      where: { lightsController: { id: lightsController.id } },
    });
  }

  public async getIntegrationUserApiKey(integrationUser: IntegrationUser) {
    return this.apiKeyRepository.findOne({
      where: { integrationUser: { id: integrationUser.id } },
    });
  }

  public async createIntegrationUser(params: IntegrationUserCreateParams): Promise<IntegrationUser> {
    const integrationUser = await this.integrationUserRepository.save(params);
    await this.createApiKey({ integrationUser });
    return integrationUser;
  }
}
