import { Controller } from '@tsoa/runtime';
import {
  Get, Post, Route, Security, Tags,
} from 'tsoa';
import axios from 'axios';
import { PosterScreenHandler } from './poster-screen-handler';
import HandlerManager from '../../../root/handler-manager';
import { Screen } from '../../../root/entities';
import { Poster } from '../../../posters/poster';
import { SecurityGroup } from '../../../../helpers/security';

enum TrainDepartureStatus {
  ON_STATION = 'ON_STATION',
  INCOMING = 'INCOMING',
}

interface NsTrainResponse {
  direction: string,
  name: string,
  plannedDateTime: string,
  plannedTimeZoneOffset: number,
  actualDateTime: string,
  actualTimeZoneOffset: number,
  plannedTrack: string,
  actualTrack: string,
  product: {
    number: string,
    categoryCode: string,
    shortCategoryName: string,
    longCategoryName: string,
    operatorCode: string,
    operatorName: string,
    type: string,
  },
  trainCategory: string,
  cancelled: boolean,
  routeStations: {
    uicCode: string,
    mediumName: string,
  }[],
  messages: {
    style: string,
    message: string,
  }[],
  departureStatus: TrainDepartureStatus,
}

interface TrainResponse {
  direction: string,
  plannedDateTime: string,
  delay: number,
  trainType: string,
  operator: string,
  cancelled: boolean,
  routeStations: string[],
  messages: {
    style: string,
    message: string,
  }[],
}

@Route('screen/poster')
@Tags('Poster screen')
export class PosterScreenController extends Controller {
  private screenHandler: PosterScreenHandler;

  constructor() {
    super();
    this.screenHandler = HandlerManager.getInstance()
      .getHandlers(Screen)
      .filter((h) => h.constructor.name === PosterScreenHandler.name)[0] as PosterScreenHandler;
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BOARD, SecurityGroup.SCREEN_SUBSCRIBER])
  @Get('')
  public async getPosters(): Promise<Poster[]> {
    if (!this.screenHandler.posterManager.posters) {
      try {
        await this.screenHandler.posterManager.fetchPosters();
      } catch (e) {
        console.error(e);
      }
    }
    return this.screenHandler.posterManager.posters;
  }

  @Security('local', [SecurityGroup.ADMIN, SecurityGroup.AVICO, SecurityGroup.BOARD])
  @Post('force-update')
  public async forceUpdatePosters(): Promise<void> {
    await this.screenHandler.posterManager.fetchPosters();
    this.screenHandler.forceUpdate();
  }

  @Security('local', [SecurityGroup.SCREEN_SUBSCRIBER])
  @Get('train-departures')
  public async getTrains(): Promise<TrainResponse[]> {
    const config = {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.NS_KEY,
      },
    };

    const departures = (await axios.get('https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures'
        + '?station=EHV&maxJourneys=40', config)).data.payload.departures as NsTrainResponse[];
    const minDepartTime = new Date((new Date()).getTime() + 8 * 60000);

    const futureDepartures = departures.filter((departure) => {
      const actualDepartTime = new Date(departure.actualDateTime);
      return minDepartTime <= actualDepartTime;
    });

    return futureDepartures.map((departure): TrainResponse => {
      let delay = 0;
      const actualDepartTime = new Date(departure.actualDateTime);
      if (departure.plannedDateTime !== departure.actualDateTime) {
        delay = new Date(
          actualDepartTime.getTime() - new Date(departure.plannedDateTime).getTime(),
        ).getMinutes();
      }

      const routeStations: string[] = departure.routeStations.map((s) => s.mediumName);

      return {
        direction: departure.direction,
        plannedDateTime: departure.plannedDateTime,
        delay,
        trainType: departure.product.categoryCode,
        operator: departure.product.operatorCode,
        cancelled: departure.cancelled,
        routeStations,
        messages: departure.messages,
      };
    });
  }
}
