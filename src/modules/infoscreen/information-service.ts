import { Repository } from 'typeorm';
import Information from './entities/information';
import dataSource from '../../database';
import { RoomStatus } from './entities/enums/roomStatus';
import { AlcoholTime } from './entities/enums/alcoholTime';
import { ApiException, HttpStatusCode } from '../../helpers/customError';
import { getBoard, getERO, getKeyHolders, Member } from './entities/ldap-connector';

export interface InformationParams {
  roomStatus: RoomStatus;
  alcoholTime: AlcoholTime | null;
  firstResponsible: string | null;
  secondResponsible: string | null;
  firstERO: string | null;
  secondERO: string | null;
}

export default class InformationService {
  repo: Repository<Information>;

  constructor() {
    this.repo = dataSource.getRepository(Information);
  }

  public async getInformation(): Promise<Information> {
    const information = await this.repo.find();
    if (information.length > 1)
      throw new ApiException(
        HttpStatusCode.InternalServerError,
        'Clashing information in the database.',
      );
    if (information.length === 0) return this.createInformation();
    return information[0];
  }

  public async setInformation(params: InformationParams): Promise<Information> {
    const information = await this.getInformation();
    if (params.roomStatus === RoomStatus.OPEN) {
      if (!params.alcoholTime) {
        throw new ApiException(
          HttpStatusCode.Forbidden,
          'There must be an alcohol time if the room is open.',
        );
      }
      if (!params.firstResponsible) {
        throw new ApiException(
          HttpStatusCode.Forbidden,
          'There must be a room responsible if the room is open.',
        );
      }
    }

    if (params.firstResponsible && params.firstResponsible === params.secondResponsible) {
      throw new ApiException(HttpStatusCode.Forbidden, 'Room responsibles must be distinct.');
    }

    if (params.firstERO && params.firstERO === params.secondERO) {
      throw new ApiException(HttpStatusCode.Forbidden, 'EROs must be distinct.');
    }

    await this.repo.update(information.id, params);
    return this.getInformation();
  }

  public async createInformation(): Promise<Information> {
    const information = {
      roomStatus: RoomStatus.CLOSED,
      alcoholTime: AlcoholTime.NORMAL,
    } as InformationParams;
    return this.repo.save(information);
  }

  public async getBoard(): Promise<Array<Member>> {
    return getBoard();
  }

  public async getKeyHolders(): Promise<Array<Member>> {
    const responsibles = await getKeyHolders();
    responsibles.sort((a: Member, b: Member) => a.displayName.localeCompare(b.displayName));
    return responsibles;
  }

  public async getERO(): Promise<Array<Member>> {
    const responsibles = await getERO();
    responsibles.sort((a: Member, b: Member) => a.displayName.localeCompare(b.displayName));
    return responsibles;
  }
}
