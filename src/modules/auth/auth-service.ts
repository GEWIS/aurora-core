import { Repository } from 'typeorm';
import crypto from 'crypto';
import { ApiKey, IntegrationUser, LocalUser } from './entities';
import dataSource from '../../database';
import { Audio, LightsController, Screen } from '../root/entities';
import { SecurityGroup } from '../../helpers/security';
import { generateSalt, hashPassword } from './passport/local-strategy';

export interface OidcConfig {
  authorization_endpoint: string;
  token_endpoint: string;
}

export interface GenerateApiKeyParams {
  audio?: Audio | null;
  screen?: Screen | null;
  lightsController?: LightsController | null;
  integrationUser?: IntegrationUser | null;
}

export interface UserParams {
  userName: string;
  password: string;
  roles: SecurityGroup[];
}

export interface IntegrationUserCreateParams extends Pick<IntegrationUser, 'name'> {}

export default class AuthService {
  private apiKeyRepository: Repository<ApiKey>;

  private integrationUserRepository: Repository<IntegrationUser>;

  constructor() {
    this.apiKeyRepository = dataSource.getRepository(ApiKey);
    this.integrationUserRepository = dataSource.getRepository(IntegrationUser);
  }

  private generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public async createApiKey({
    audio,
    screen,
    lightsController,
    integrationUser,
  }: GenerateApiKeyParams) {
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

  public async createIntegrationUser(
    params: IntegrationUserCreateParams,
  ): Promise<IntegrationUser> {
    const integrationUser = await this.integrationUserRepository.save(params);
    await this.createApiKey({ integrationUser });
    return integrationUser;
  }

  public async getOIDCConfig(): Promise<OidcConfig> {
    const oidcConfigRes = await fetch(process.env.OIDC_CONFIG!);
    return oidcConfigRes.json();
  }

  async createUser(params: UserParams): Promise<LocalUser> {
    const { roles, password, ...userParams } = params;
    const userRepo = dataSource.getRepository(LocalUser);
    const salt = generateSalt();
    const user = userRepo.create({
      ...userParams,
      roles: roles.join(','),
      hash: hashPassword(password, salt),
      salt: salt,
    });
    await userRepo.save(user);
    return user;
  }
}
