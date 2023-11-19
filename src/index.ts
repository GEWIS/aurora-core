import './env';
import { createServer } from 'http';
import createHttp from './http';
import { setupErrorHandler } from './error';
import dataSource from './database';
import HandlerManager from './modules/root/handler-manager';
import createWebsocket from './socketio';
import { SpotifyApiHandler, SpotifyTrackHandler } from './modules/spotify';
import { MusicEmitter } from './modules/events';
import LightsControllerManager from './modules/root/lights-controller-manager';
import { SocketConnectionEmitter } from './modules/events/socket-connection-emitter';
import ModeManager from './modules/modes/mode-manager';

async function createApp(): Promise<void> {
  await dataSource.initialize();
  const app = await createHttp();
  setupErrorHandler(app);
  const httpServer = createServer(app);

  const socketConnectionEmitter = new SocketConnectionEmitter();
  const io = createWebsocket(httpServer, socketConnectionEmitter);

  const handlerManager = HandlerManager.getInstance(io);
  await handlerManager.init(socketConnectionEmitter);

  const musicEmitter = new MusicEmitter(handlerManager);
  const lightsControllerManager = new LightsControllerManager(io.of('/lights'), handlerManager, musicEmitter);
  const modeManager = ModeManager.getInstance();
  modeManager.init(musicEmitter);

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
