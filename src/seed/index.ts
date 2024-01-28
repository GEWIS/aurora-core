import '../env';
import dataSource from '../database';
import seedDatabase from './seed';

async function createSeeder() {
  await dataSource.initialize();
  await seedDatabase();
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
