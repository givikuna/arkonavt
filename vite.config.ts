import * as vite from "vite";

import * as react from "@vitejs/plugin-react";
import * as electron from "vite-plugin-electron";
import * as renderer from "vite-plugin-electron-renderer";

// totally the way to type this

const ep: (
    | {
          entry: string;
          onstart?: never;
      }
    | {
          entry: string;
          onstart(options: {
              startup: (
                  argv?: string[],
                  options?: import("node:child_process").SpawnOptions,
                  customElectronPkg?: string,
              ) => Promise<boolean>;
              reload: () => void;
          }): void;
      }
)[] = [
    { entry: "electron/main.ts" },
    {
        entry: "electron/preload.ts",
        onstart(options: {
            startup: (
                argv?: string[],
                options?: import("node:child_process").SpawnOptions,
                customElectronPkg?: string,
            ) => Promise<boolean>;
            reload: () => void;
        }): void {
            options.reload();
        },
    },
];

export default vite.defineConfig({
    plugins: [react.default(), electron.default(ep), renderer.default()],
});
