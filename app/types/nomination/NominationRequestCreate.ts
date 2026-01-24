import type { MusicGenre } from "../MusicGenre";

export interface NominationRequestCreate {
    musicBandId: number;
    musicBandName: string;
    musicGenre: MusicGenre;
    nominatedAt: string;
}
