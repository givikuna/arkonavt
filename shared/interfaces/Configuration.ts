import { ColorScheme } from "../enums/ColorScheme";
import { Playlist } from "../types/Playlist";

export interface Configuration {
    songs:     string[];
    scheme:    ColorScheme;
    playlists: Playlist[];
    albums:    string[]; // ids
}
