import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForUpdateAlbum {
    id: number;
    name: string;
    length: number;
}

export const updateAlbum = async (params: ParamsForUpdateAlbum): Promise<void> => {
    try {
        await api.put(`/api/v1/albums/${params.id}`, {
            name: params.name,
            length: params.length,
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
