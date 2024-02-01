import '../env';
import dataSource from '../database';
import seedDatabase, { seedOpeningSequence } from './seed';

async function createSeeder() {
  await dataSource.initialize();
  await dataSource.dropDatabase();

  await dataSource.synchronize();
  const lights = await seedDatabase();
  await seedOpeningSequence(lights[0]!, lights[1]!, lights[3]!, lights[4]!);
}

if (require.main === module) {
  process.on('SIGINT', () => {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
  });

  // Only execute the application directly if this is the main execution file.
  createSeeder().catch((e) => {
    console.error(e);
  });
}
