import { HandlerSystem } from "../../shared/interfaces/HandlerSystem";

import { getConfigHandler } from "./getConfig";

export const IPCHandlers: HandlerSystem["arkonavt"] = {
    getConfig: getConfigHandler,
};
