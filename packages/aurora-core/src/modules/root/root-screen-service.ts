import { Repository } from 'typeorm';
import { Screen } from './entities';
import { DataSourceSingleton } from '@gewis/aurora-core-database-util';
import AuthService from '../auth/auth-service';

export interface ScreenResponse extends Pick<Screen, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'socketIds'> {}

export interface ScreenCreateParams extends Pick<Screen, 'name' | 'defaultHandler'> {}

export default class RootScreenService {
  private repository: Repository<Screen>;

  constructor() {
    this.repository = DataSourceSingleton.getInstance().get().getRepository(Screen);
  }

  public static toScreenResponse(screen: Screen): ScreenResponse {
    return {
      id: screen.id,
      createdAt: screen.createdAt,
      updatedAt: screen.updatedAt,
      name: screen.name,
      socketIds: screen.socketIds,
    };
  }

  public async getAllScreens(): Promise<Screen[]> {
    return this.repository.find();
  }

  public async getSingleScreen(id: number): Promise<Screen | null> {
    return this.repository.findOne({ where: { id } });
  }

  public async createScreen(params: ScreenCreateParams): Promise<Screen> {
    const screen = await this.repository.save(params);
    await new AuthService().createApiKey({ screen });
    return screen;
  }
}
