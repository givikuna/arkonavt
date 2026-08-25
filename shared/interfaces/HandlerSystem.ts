import { Configuration } from "./Configuration";
import { Repository } from "./Repository";

export interface HandlerSystem {
    arkonavt: {
        getConfig:     () => Promise<Configuration>;
        getRepository: () => Promise<Repository>;
        downloadSong:  (url: string, id: string) => Promise<string>;
    };
}
