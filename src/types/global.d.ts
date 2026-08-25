import { Configuration } from "../../shared/interfaces/Configuration";
import { Repository } from "../../shared/interfaces/Repository";

declare global {
    interface Window {
        arkonavt: {
            getConfig:     () => Promise<Configuration>;
            getRepository: () => Promise<Repository>;
            downloadSong:  (url: string, id: string) => Promise<string>;
        };
    }
}
