import { Repository } from 'typeorm';
import { Screen } from './entities';
import dataSource from '../../database';

export interface ScreenResponse extends Pick<Screen, 'id' | 'createdAt' | 'updatedAt' | 'name'> {}

export interface ScreenCreateParams extends Pick<Screen, 'name'> {}

export default class RootScreenService {
  private repository: Repository<Screen>;

  constructor() {
    this.repository = dataSource.getRepository(Screen);
  }

  private toScreenResponse(screen: Screen): ScreenResponse {
    return {
      id: screen.id,
      createdAt: screen.createdAt,
      updatedAt: screen.updatedAt,
      name: screen.name,
    };
  }

  public async getAllScreens(): Promise<ScreenResponse[]> {
    const screens = await this.repository.find();
    return screens.map((s) => this.toScreenResponse(s));
  }

  public async getSingleScreen(id: number): Promise<Screen | null> {
    return this.repository.findOne({ where: { id } });
  }

  public async createScreen(params: ScreenCreateParams): Promise<ScreenResponse> {
    const screen = await this.repository.save(params);
    return this.toScreenResponse(screen);
  }
}
