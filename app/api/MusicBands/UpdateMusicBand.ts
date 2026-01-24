import { api } from "~/lib/axios";
import type { AlbumRequestUpdate } from "~/types/album/AlbumRequestUpdate";
import type { CoordinatesRequestUpdate } from "~/types/coordinates/CoordinatesRequestUpdate";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { MusicGenre } from "~/types/MusicGenre";
import type { StudioRequestUpdate } from "~/types/studio/StudioRequestUpdate";

export interface ParamsForUpdateMusicBand {
    id: number;
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

export const updateMusicBand = async (params: ParamsForUpdateMusicBand): Promise<void> => {
    try {
        await api.put(`/api/v1/music-bands/${params.id}`, {
            name: params.name,
            coordinates: params.coordinates,
            coordinatesId: params.coordinatesId,
            genre: params.genre,
            numberOfParticipants: params.numberOfParticipants,
            singlesCount: params.singlesCount,
            description: params.description,
            bestAlbum: params.bestAlbum,
            bestAlbumId: params.bestAlbumId,
            albumsCount: params.albumsCount,
            establishmentDate: params.establishmentDate,
            studio: params.studio,
            studioId: params.studioId,
        });
    } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
            // @ts-ignore
            const status = error.response?.status;
            // @ts-ignore
            const data = error.response?.data;
            if (isErrorMessage(data)) { throw data; }
            throw new Error(`Серверная ошибка ${status}: ${JSON.stringify(data)}`);
        }
        throw new Error(String(error));
    }
};
