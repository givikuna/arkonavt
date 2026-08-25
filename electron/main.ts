import * as Electron from "electron";

import * as path from "path";
import * as fs from "fs";
import * as util from "util";

import * as child_process from "child_process";

import { Configuration } from "../shared/interfaces/Configuration";
import { ColorScheme } from "../shared/enums/ColorScheme";
import { Repository } from "../shared/interfaces/Repository";

import { noop } from "underscore";

import { AUDIO_FORMATS } from "../shared/constants/formats/AudioFormats";

const execPromise = util.promisify(child_process.exec);

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

Electron.app.whenReady().then((): void => {
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
                songs:  [{ id: "s1", name: "AAA", url: "...", ext: "mp3", artists: ["Queen"] }],
                albums: [],
            }) satisfies Repository,
    );

    Electron.ipcMain.handle("download-song", async (_, url: string, id: string) => {
        const musicDir: string = path.join(Electron.app.getPath("userData"), "arkonavt_music");

        if (!fs.existsSync(musicDir)) {
            fs.mkdirSync(musicDir, { recursive: true });
        }

        for (const ext of AUDIO_FORMATS) {
            const checkPath: string = path.join(musicDir, `${id}.${ext}`);
            if (fs.existsSync(checkPath)) {
                console.log(`[Cache] Found local file: ${checkPath}`);
                return `file://${checkPath}`;
            }
        }

        console.log(`[Download] Fetching ${url}`);

        const cmd: string = `yt-dlp -x -o "${path.join(musicDir, `${id}.%(ext)s`)}" --audio-quality 0 "${url}"`;

        try {
            await execPromise(cmd);

            for (const ext of AUDIO_FORMATS) {
                const downloadedPath: string = path.join(musicDir, `${id}.${ext}`);
                if (fs.existsSync(downloadedPath)) {
                    return `file://${downloadedPath}`;
                }
            }

            throw new Error("download succeeded, but couldn't find the output file.");
        } catch (error: unknown) {
            console.error("yt-dlp failed:", error);
            throw error;
        }
    });

    createWindow();
});

Electron.app.on("window-all-closed", (): void =>
    process.platform !== "darwin" ? Electron.app.quit() : noop(),
);
