import '../env';
import dataSource from '../database';
import seedDatabase, { seedBorrelLights, seedDiscoFloor, seedOpeningSequence } from './seed';
import logger from '@gewis/aurora-core-logger';

async function createSeeder() {
  await dataSource.initialize();
  await dataSource.dropDatabase();

  await dataSource.synchronize();
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
