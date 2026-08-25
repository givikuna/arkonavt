import * as Electron from "electron";

import { Configuration } from "../shared/interfaces/Configuration";
import { Repository } from "../shared/interfaces/Repository";

export const arkonavtAPI = {
    getConfig:     (): Promise<Configuration> => Electron.ipcRenderer.invoke("get-config"),
    getRepository: (): Promise<Repository> => Electron.ipcRenderer.invoke("get-repository"),
    downloadSong:  (url: string, id: string): Promise<string> =>
        Electron.ipcRenderer.invoke("download-song", url, id),
};

Electron.contextBridge.exposeInIsolatedWorld(0, "arkonavt", arkonavtAPI);
