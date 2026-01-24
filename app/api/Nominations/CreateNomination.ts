import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { MusicGenre } from "~/types/MusicGenre";

export interface ParamsForCreateNomination {
    musicBandId: number;
    musicGenre: MusicGenre;
}

export const createNomination = async (params: ParamsForCreateNomination): Promise<void> => {
    try {
        await api.post("/api/v1/nominations", {
            musicBandId: params.musicBandId,
            musicGenre: params.musicGenre,
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
