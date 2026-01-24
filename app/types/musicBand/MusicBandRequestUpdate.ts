import type { AlbumRequestUpdate } from "../album/AlbumRequestUpdate";
import type { CoordinatesRequestUpdate } from "../coordinates/CoordinatesRequestUpdate";
import type { MusicGenre } from "../MusicGenre";
import type { StudioRequestUpdate } from "../studio/StudioRequestUpdate";

export interface MusicBandRequestUpdate {
    name: string;
    coordinates: CoordinatesRequestUpdate | null;
    coordinatesId: number | null;
    genre: MusicGenre | null;
    numberOfParticipants: number | null;
    singlesCount: number;
    description: string | null;
    bestAlbum: AlbumRequestUpdate | null;
    bestAlbumId: number | null;
    albumsCount: number;
    establishmentDate: string;
    studio: StudioRequestUpdate | null;
    studioId: number | null;
}
