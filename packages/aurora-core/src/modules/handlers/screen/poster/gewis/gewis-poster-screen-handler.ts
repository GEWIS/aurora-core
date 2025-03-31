import BasePosterScreenHandler from '../base-poster-screen-handler';
import { Namespace } from 'socket.io';

export default class GewisPosterScreenHandler extends BasePosterScreenHandler {
  private borrelModeDay: number | undefined;

  public borrelModeInterval: NodeJS.Timeout;

  constructor(socket: Namespace) {
    super(socket);

    // Check whether we need to enable/disable borrel mode
    this.borrelModeInterval = setInterval(this.checkBorrelMode.bind(this), 60 * 1000);
  }

  public get borrelMode() {
    return this.borrelModeDay !== undefined;
  }

  private checkBorrelMode() {
    const now = new Date();

    // If borrelmode is enabled, but we arrive at the next day, disable borrelmode again
    if (this.borrelMode && this.borrelModeDay !== now.getDay()) {
      this.borrelModeDay = undefined;
      return;
    }
    // if borrelmode is enabled, we do not have to check whether we can enable it
    if (this.borrelMode) return;

    // By default, enable borrelmode on Thursdays 16:30 local time
    if (now.getDay() === 4 && ((now.getHours() === 16 && now.getMinutes() >= 30) || now.getHours() >= 17)) {
      this.borrelModeDay = now.getDay();
    }
  }

  public setBorrelModeEnabled(enabled: boolean) {
    if (enabled) {
      this.borrelModeDay = new Date().getDay();
    } else {
      this.borrelModeDay = undefined;
    }
  }
}
