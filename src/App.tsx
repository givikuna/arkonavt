import React, { useEffect, useState } from "react";
import { Play, FastForward, Rewind } from "lucide-react";

import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/function";

import { AppState } from "./types/AppState";

import { Configuration } from "../shared/interfaces/Configuration";
import { Repository } from "../shared/interfaces/Repository";

import { Song } from "../shared/types/Song";
import { Playlist } from "../shared/types/Playlist";

const resolveSongs: (repoSongs: Song[], ids: string[]) => Song[] = (
    repoSongs: Song[],
    ids: string[],
): Song[] =>
    pipe(
        ids,
        A.filterMap((id: string): O.Option<Song> =>
            pipe(
                repoSongs,
                A.findFirst((song) => song.id === id),
            ),
        ),
    );

export default function App() {
    const [state, setState]: [AppState, React.Dispatch<React.SetStateAction<AppState>>] =
        useState<AppState>({
            config:          O.none,
            repo:            O.none,
            currentPlaylist: O.none,
            activeSong:      O.none,
            isLoading:       true,
        });

    useEffect((): void => {
        const loadData: () => Promise<void> = async (): Promise<void> => {
            const [configData, repoData]: [Configuration, Repository] = await Promise.all([
                window.arkonavt.getConfig(),
                window.arkonavt.getRepository(),
            ]);

            setState(
                (prev: AppState): AppState =>
                    ({
                        ...prev,
                        config: O.some(configData),
                        repo:   O.some(repoData),

                        currentPlaylist: pipe(
                            configData.playlists,
                            A.head,
                            O.map((p: Playlist): string => p.id),
                        ),

                        isLoading: false,
                    }) satisfies AppState,
            );
        };

        loadData();
    }, []);

    if (state.isLoading || O.isNone(state.repo) || O.isNone(state.config)) {
        return <div className="p-4 text-accent">Loading arkonavt ecosystem...</div>;
    }

    const repo: Repository = state.repo.value;
    const config: Configuration = state.config.value;

    //

    const currentPlaylistObj: O.Option<Playlist> = pipe(
        state.currentPlaylist,
        O.chain((id: string): O.Option<Playlist> =>
            pipe(
                config.playlists,
                A.findFirst((p: Playlist): boolean => p.id === id),
            ),
        ),
    );

    const currentPlaylistSongs: Song[] = pipe(
        currentPlaylistObj,
        O.match(
            (): Song[] => [] as Song[],
            (p: Playlist): Song[] => resolveSongs(repo.songs, p.songs),
        ),
    );

    const activeSongObj: O.Option<Song> = pipe(
        state.activeSong,
        O.chain((id: string): O.Option<Song> =>
            pipe(
                repo.songs,
                A.findFirst((s: Song): boolean => s.id === id),
            ),
        ),
    );

    return (
        <div className="flex flex-col h-screen bg-bg text-fg font-mono">
            {/* Top Bar / Header */}
            <header className="p-4 border-b border-border flex justify-between items-center">
                <h1 className="text-xl font-bold text-accent">~arkonavt</h1>
                <span className="text-sm text-fg-dim">
                    [ {repo.songs.length} tracks registered ]
                </span>
            </header>

            {/* Main Layout */}
            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border p-4 overflow-y-auto">
                    <h2 className="text-accent mb-4 uppercase text-sm tracking-wider">Playlists</h2>
                    <ul className="space-y-2">
                        {pipe(
                            config.playlists,
                            A.map((p: Playlist): React.JSX.Element => {
                                const isActive: boolean = pipe(
                                    state.currentPlaylist,
                                    O.match(
                                        (): false => false,
                                        (currentId: string): boolean => currentId === p.id,
                                    ),
                                );

                                return (
                                    <li
                                        key={p.id}
                                        className={`cursor-pointer hover:text-accent transition-colors ${
                                            isActive ? "text-accent font-bold" : ""
                                        }`}
                                        onClick={(): void =>
                                            setState(
                                                (appState: AppState): AppState =>
                                                    ({
                                                        ...appState,
                                                        currentPlaylist: O.some(p.id),
                                                    }) satisfies AppState,
                                            )
                                        }
                                    >
                                        {p.name}
                                    </li>
                                );
                            }),
                        )}
                    </ul>
                </aside>

                {/* Tracklist */}
                <section className="flex-1 p-4 overflow-y-auto">
                    <h2 className="text-accent mb-4 uppercase text-sm tracking-wider">
                        {pipe(
                            currentPlaylistObj,
                            O.match(
                                (): "Library" => "Library",
                                (p: Playlist): string => p.name,
                            ),
                        )}
                    </h2>

                    <div className="flex flex-col gap-2">
                        {A.isEmpty(currentPlaylistSongs) ? (
                            <div className="text-fg-dim">No tracks in this playlist.</div>
                        ) : (
                            pipe(
                                currentPlaylistSongs,
                                A.map((song: Song): React.JSX.Element => (
                                    <div
                                        key={song.id}
                                        className="flex justify-between items-center p-2 hover:bg-bg-highlight cursor-pointer"
                                        onClick={() =>
                                            setState((appState: AppState): AppState => ({
                                                ...appState,
                                                activeSong: O.some(song.id),
                                            }))
                                        }
                                    >
                                        <div className="flex flex-col">
                                            <span>{song.name}</span>
                                            <span className="text-xs text-fg-dim">
                                                {song.artists.join(", ")}
                                            </span>
                                        </div>
                                        <span className="text-xs text-accent">[{song.id}]</span>
                                    </div>
                                )),
                            )
                        )}
                    </div>
                </section>
            </main>

            {/* Player Bar */}
            <footer className="h-20 border-t border-border p-4 flex items-center justify-between bg-bg-highlight">
                <div className="w-1/3">
                    {pipe(
                        activeSongObj,
                        O.match(
                            (): React.JSX.Element => (
                                <div className="text-fg-dim">No track selected</div>
                            ),
                            (song: Song): React.JSX.Element => (
                                <>
                                    <div className="font-bold text-accent">{song.name}</div>
                                    <div className="text-sm text-fg-dim">
                                        {song.artists.join(", ")}
                                    </div>
                                </>
                            ),
                        ),
                    )}
                </div>

                <div className="flex items-center gap-6 w-1/3 justify-center">
                    <Rewind
                        className="cursor-pointer hover:text-accent"
                        size={20}
                    />
                    <Play
                        className="cursor-pointer hover:text-accent"
                        size={28}
                    />
                    <FastForward
                        className="cursor-pointer hover:text-accent"
                        size={20}
                    />
                </div>

                <div className="w-1/3 text-right text-xs text-fg-dim flex items-center justify-end">
                    {pipe(
                        activeSongObj,
                        O.match(
                            (): "---" => "---",
                            (song): string => song.url,
                        ),
                    )}
                </div>
            </footer>
        </div>
    );
}
