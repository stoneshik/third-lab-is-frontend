import { api } from "~/lib/axios";
import type { AlbumRequestCreate } from "~/types/album/AlbumRequestCreate";
import type { CoordinatesRequestCreate } from "~/types/coordinates/CoordinatesRequestCreate";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { MusicGenre } from "~/types/MusicGenre";
import type { StudioRequestCreate } from "~/types/studio/StudioRequestCreate";

export interface ParamsForCreateMusicBand {
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

export const createMusicBand = async (params: ParamsForCreateMusicBand): Promise<void> => {
    try {
        await api.post("/api/v1/music-bands", params);
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
