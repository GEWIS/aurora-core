import { Repository } from 'typeorm';
import Information from './entities/information';
import dataSource from '../../database';
import { RoomStatus } from './entities/enums/roomStatus';
import { AlcoholTime } from './entities/enums/alcoholTime';
import { ApiError, HTTPStatus } from '../../helpers/customError';

export interface InformationParams {
  roomStatus: RoomStatus,
  alcoholTime: AlcoholTime,
  firstResponsible: string,
  secondResponsible?: string,
  firstERO?: string,
  secondERO?: string
}

export default class InformationService {
  repo: Repository<Information>;

  constructor() {
    this.repo = dataSource.getRepository(Information);
  }

  public async getInformation(): Promise<Information> {
    const information = await this.repo.find();
    if (information.length > 1) throw new ApiError(HTTPStatus.InternalServerError, 'Clashing information in the database.');
    if (information.length === 0) return this.createInformation();
    return information[0];
  }

  public async setInformation(params: InformationParams): Promise<Information> {
    const information = await this.getInformation();
    await this.repo.update(information.id, params);
    return this.getInformation();
  }

  public async createInformation(): Promise<Information> {
    const information = {
      roomStatus: RoomStatus.CLOSED,
      alcoholTime: AlcoholTime.NORMAL,
      firstResponsible: 'NOT SET',
    } as InformationParams;
    return this.repo.save(information);
  }
}
