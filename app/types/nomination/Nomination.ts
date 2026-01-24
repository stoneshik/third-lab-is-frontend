import type { MusicGenre } from "../MusicGenre";

export interface Nomination {
    id: number;
    musicBandId: number;
    musicBandName: string;
    musicGenre: MusicGenre;
    nominatedAt: string;
}
