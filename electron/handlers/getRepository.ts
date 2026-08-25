import { Repository } from "../../shared/interfaces/Repository";

export const getRepository: () => Promise<Repository> = async (): Promise<Repository> =>
    ({
        songs:  [{ id: "s1", name: "AAA", url: "...", ext: "mp3", artists: ["Queen"] }],
        albums: [],
    }) satisfies Repository;
