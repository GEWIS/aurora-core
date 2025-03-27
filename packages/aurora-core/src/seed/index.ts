import '../env';
import seedDatabase, { seedBorrelLights, seedDiscoFloor, seedOpeningSequence } from './seed';
import logger from '@gewis/aurora-core-logger';
import { DataSourceSingleton } from '@gewis/aurora-core-database-util'
import {ServerSetting} from "@gewis/aurora-core-server-settings";
import {Entities as TimedEventsEntities} from "../modules/timed-events/entities";
import {Entities as BaseEntities} from "../modules/root/entities";
import {Entities as AuthEntities} from "../modules/auth/entities";
import {Entities as FileEntities} from "../modules/files/entities";
import {Entities as AuditEntities} from "../modules/audit/entities";
import {Entities as SpotifyEntities} from "../modules/spotify/entities";
import {Entities as LightsEntities} from "../modules/lights/entities";
import LocalPoster from "../modules/handlers/screen/poster/local/local-poster";

async function createSeeder() {
  await DataSourceSingleton.getInstance().initialize([
    ServerSetting,
    ...TimedEventsEntities,
    ...BaseEntities,
    ...AuthEntities,
    ...FileEntities,
    ...AuditEntities,
    ...SpotifyEntities,
    ...LightsEntities,
    LocalPoster
  ])

  await DataSourceSingleton.getInstance().get().dropDatabase();

  await DataSourceSingleton.getInstance().get().synchronize();
  const [room, bar, lounge, movingHeadsGEWIS, movingHeadsRoy] = await seedDatabase();
  await seedBorrelLights(room!, bar!, lounge!, movingHeadsGEWIS!);
  await seedOpeningSequence(room!, bar!, movingHeadsGEWIS!, movingHeadsRoy!);
  await seedDiscoFloor(9, 4);
}

if (require.main === module) {
  process.on('SIGINT', () => {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
  });

  // Only execute the application directly if this is the main execution file.
  createSeeder().catch((e) => {
    logger.fatal(e);
  });
}
