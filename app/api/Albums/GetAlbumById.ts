import { api } from "~/lib/axios";
import type { Album } from "~/types/album/Album";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForGetAlbumId { id: number; }

export const getAlbumById = async ({ id }: ParamsForGetAlbumId): Promise<Album> => {
    try {
        const response = await api.get(`/api/v1/albums/${id}`);
        return response.data as Album;
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
