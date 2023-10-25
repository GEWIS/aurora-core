import './env';
import { createServer } from 'http';
import createHttp from './http';
import dataSource from './database';
import HandlerManager from './modules/root/handler-manager';
import createWebsocket from './socketio';
import { SpotifyApiHandler, SpotifyTrackHandler } from './modules/spotify';
import { MusicEmitter } from './modules/events';
import LightsControllerManager from './modules/root/lights-controller-manager';

async function createApp(): Promise<void> {
  await dataSource.initialize();
  const app = createHttp();
  const httpServer = createServer(app);
  const io = createWebsocket(httpServer);

  const musicEmitter = new MusicEmitter();

  const lightsControllerHandler = new LightsControllerManager(io.of('/lights'), musicEmitter);

  await HandlerManager.getInstance(musicEmitter, lightsControllerHandler).init();
  await SpotifyApiHandler.getInstance().init();
  await SpotifyTrackHandler.getInstance().init(musicEmitter);

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
