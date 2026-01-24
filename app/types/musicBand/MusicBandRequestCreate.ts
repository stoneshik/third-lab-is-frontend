import type { AlbumRequestCreate } from "../album/AlbumRequestCreate";
import type { CoordinatesRequestCreate } from "../coordinates/CoordinatesRequestCreate";
import type { MusicGenre } from "../MusicGenre";
import type { StudioRequestCreate } from "../studio/StudioRequestCreate";

export interface MusicBandRequestCreate {
    name: string;
    coordinates: CoordinatesRequestCreate | null;
    coordinatesId: number | null;
    genre: MusicGenre | null;
    numberOfParticipants: number | null;
    singlesCount: number;
    description: string | null;
    bestAlbum: AlbumRequestCreate | null;
    bestAlbumId: number | null;
    albumsCount: number;
    establishmentDate: string;
    studio: StudioRequestCreate | null;
    studioId: number | null;
}
