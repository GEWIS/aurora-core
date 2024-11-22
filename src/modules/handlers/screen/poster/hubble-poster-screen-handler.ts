import BasePosterScreenHandler from "./base-poster-screen-handler";
import { Namespace } from "socket.io";

export default class HubblePosterScreenHandler extends BasePosterScreenHandler {
    constructor(socket: Namespace) {
        super(socket);
    }
}