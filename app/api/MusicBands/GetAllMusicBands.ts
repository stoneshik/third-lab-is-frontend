import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListMusicBand } from "~/types/musicBand/WrapperListMusicBand";
import type { MusicGenre } from "~/types/MusicGenre";
import type { SortNameField } from "~/types/SortNameField";
import type { SortOrder } from "~/types/SortOrder";

export interface ParamsForGetWrapperListMusicBand {
    name: string;
    genre: MusicGenre | null;
    description: string;
    bestAlbumName: string;
    studioName: string;
    studioAddress: string;
    page: number;
    size: number;
    sortNameField: SortNameField | null;
    sortOrder: SortOrder | null;
}

export const getWrapperListMusicBand = async ({
    name,
    genre,
    description,
    bestAlbumName,
    studioName,
    studioAddress,
    page,
    size,
    sortNameField,
    sortOrder
}: ParamsForGetWrapperListMusicBand): Promise<WrapperListMusicBand> => {
    try {
        const params: Record<string, string | number> = {
            page,
            size,
        };
        if (name !== "") { params.name = name; }
        if (genre !== null) { params.genre = genre; }
        if (description !== "") { params.description = description; }
        if (bestAlbumName !== "") { params.bestAlbumName = bestAlbumName; }
        if (studioName !== "") { params.studioName = studioName; }
        if (studioAddress !== "") { params.studioAddress = studioAddress; }
        if (sortNameField !== null && sortOrder !== null) {
            const sortParam = sortNameField + "," + sortOrder;
            params.sort = sortParam;
        }
        const response = await api.get("/api/v1/music-bands", { params });
        return response.data as WrapperListMusicBand;
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
