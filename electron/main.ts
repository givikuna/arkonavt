import * as Electron from "electron";

import * as path from "path";

import { Configuration } from "../shared/interfaces/Configuration";
import { ColorScheme } from "../shared/enums/ColorScheme";
import { Repository } from "../shared/interfaces/Repository";

import { noop } from "underscore";

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
    mainWindow = new Electron.BrowserWindow({
        width:  1200,
        height: 700,

        backgroundColor: "#2c2c2c",

        webPreferences: {
            preload:          path.join(__dirname, "preload.ts"),
            nodeIntegration:  false,
            contextIsolation: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}

Electron.app.whenReady().then(() => {
    // IPC
    Electron.ipcMain.handle(
        "get-config",
        async (): Promise<Configuration> =>
            ({
                songs:     [],
                scheme:    ColorScheme.Gruvbox,
                playlists: [{ id: "p1", name: "Playlist", songs: ["s1", "s2"] }],
                albums:    [],
            }) satisfies Configuration,
    );

    Electron.ipcMain.handle(
        "get-repository",
        async (): Promise<Repository> =>
            ({
                songs:  [{ id: "s1", name: "AAA", url: "...", artists: ["Queen"] }],
                albums: [],
            }) satisfies Repository,
    );

    createWindow();
});

Electron.app.on("window-all-closed", (): void =>
    process.platform !== "darwin" ? Electron.app.quit() : noop(),
);
