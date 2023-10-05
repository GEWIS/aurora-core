import { config } from 'dotenv';

config();

// eslint-disable-next-line import/first
import dataSource from './database';

async function createApp(): Promise<void> {
  await dataSource.initialize();
}

if (require.main === module) {
  // Only execute the application directly if this is the main execution file.
  createApp().catch((e) => {
    console.error(e);
  });
}
