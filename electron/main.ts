import * as Electron from "electron";

import * as path from "path";

let mainWindow: Electron.BrowserWindow | null;

function createWindow(): void {
    mainWindow = new Electron.BrowserWindow({
        width: 1200,
        height: 700,
        backgroundColor: "#2c2c2c",
        webPreferences: {
            preload: path.join(__dirname, "preload.ts"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}

Electron.app.whenReady().then(createWindow);

Electron.app.on("window-all-closed", () => {
    Electron.app.quit();
});
