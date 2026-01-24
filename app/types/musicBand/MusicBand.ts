import type { Album } from "../album/Album";
import type { Coordinates } from "../coordinates/Coordinates";
import type { MusicGenre } from "../MusicGenre";
import type { Studio } from "../studio/Studio";

export interface MusicBand {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: string;
    genre: MusicGenre | null;
    numberOfParticipants: number | null;
    singlesCount: number;
    description: string | null;
    bestAlbum: Album | null;
    albumsCount: number;
    establishmentDate: string;
    studio: Studio | null;
}
