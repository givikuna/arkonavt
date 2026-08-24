import { Configuration } from "../../shared/interfaces/Configuration";
import { Repository } from "../../shared/interfaces/Repository";

import * as O from "fp-ts/Option";

export type AppState = {
    config:          O.Option<Configuration>;
    repo:            O.Option<Repository>;
    currentPlaylist: O.Option<string>;
    activeSong:      O.Option<string>;
    isLoading:       boolean;
};
