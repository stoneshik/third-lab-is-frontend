import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForDeleteOneByEstablishmentDate { date: string; }

export const deleteOneByEstablishmentDate = async (
    params: ParamsForDeleteOneByEstablishmentDate
): Promise<void> => {
    try {
        await api.delete("/api/v1/music-bands/by-establishment", { params });
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
