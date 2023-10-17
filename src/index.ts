import './env';
import { createServer } from 'http';
import createHttp from './http';
import dataSource from './database';
import Handlers from './modules/root/handlers';
import createWebsocket from './socketio';
import { SpotifyApiHandler, SpotifyTrackHandler } from './modules/spotify';
import { BeatEmitter } from './modules/events';

async function createApp(): Promise<void> {
  await dataSource.initialize();
  const app = createHttp();
  const httpServer = createServer(app);

  const io = createWebsocket(httpServer);

  const beatEmitter = new BeatEmitter();

  await Handlers.getInstance(io, beatEmitter);
  await SpotifyApiHandler.getInstance().init();
  await SpotifyTrackHandler.getInstance().init(beatEmitter);

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => console.log(`Listening at http://localhost:${port}`));
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
