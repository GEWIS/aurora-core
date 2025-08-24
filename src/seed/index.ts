import '../env';
import dataSource from '../database';
import seedDatabase, { seedBorrelLights, seedDiscoFloor, seedOpeningSequence } from './seedGewis';
import logger from '../logger';
import seedDatabaseHubble from './seedHubble';

async function createSeeder() {
  await dataSource.initialize();
  await dataSource.dropDatabase();

  await dataSource.synchronize();
  if (process.argv.includes('--hubble')) {
    console.info('Seeding database for Hubble');
    await seedDatabaseHubble();
  } else {
    console.info('Seeding database for GEWIS');
    const [room, bar, lounge, movingHeadsGEWIS, movingHeadsRoy] = await seedDatabase();
    await seedBorrelLights(room!, bar!, lounge!, movingHeadsGEWIS!);
    await seedOpeningSequence(room!, bar!, movingHeadsGEWIS!, movingHeadsRoy!);
  }
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
