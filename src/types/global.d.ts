import { Configuration } from "../../shared/interfaces/Configuration";
import { Repository } from "../../shared/interfaces/Repository";

import { HandlerSystem } from "../../shared/interfaces/HandlerSystem";

declare global {
    interface Window extends HandlerSystem {}
}
