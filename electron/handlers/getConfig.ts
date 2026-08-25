import { Configuration } from "../../shared/interfaces/Configuration";

import { ColorScheme } from "../../shared/enums/ColorScheme";

export const getConfigHandler: () => Promise<Configuration> = async (): Promise<Configuration> =>
    ({
        songs:     [],
        scheme:    ColorScheme.Gruvbox,
        playlists: [{ id: "p1", name: "Playlist", songs: ["s1", "s2"] }],
        albums:    [],
    }) satisfies Configuration;
