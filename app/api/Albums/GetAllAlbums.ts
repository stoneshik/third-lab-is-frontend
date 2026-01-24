import { api } from "~/lib/axios";
import type { WrapperListAlbum } from "~/types/album/WrapperListAlbum";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForGetWrapperListAlbum {
    page: number;
    size: number;
}

export const getWrapperListAlbum = async (
    params: ParamsForGetWrapperListAlbum
): Promise<WrapperListAlbum> => {
    try {
        const response = await api.get("/api/v1/albums", { params });
        return response.data as WrapperListAlbum;
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
