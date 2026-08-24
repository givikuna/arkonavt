import { Album } from "../types/Album";
import { Song } from "../types/Song";

export interface Repository {
    songs:  Song[];
    albums: Album[];
}
