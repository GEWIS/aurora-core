import './env';
import createHttp from './http';
import dataSource from './database';
import Handlers from './modules/base/handlers';

async function createApp(): Promise<void> {
  await dataSource.initialize();
  const app = createHttp();

  const handlers = Handlers.getInstance();

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
}

if (require.main === module) {
  process.on('SIGINT', () => {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
  });

  // Only execute the application directly if this is the main execution file.
  createApp().catch((e) => {
    console.error(e);
  });
}
