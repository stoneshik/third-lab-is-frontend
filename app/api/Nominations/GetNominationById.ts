import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { Nomination } from "~/types/nomination/Nomination";

export interface ParamsForGetNominationId {
    id: number;
}

export const getNominationById = async ({ id }: ParamsForGetNominationId): Promise<Nomination> => {
    try {
        const response = await api.get(`/api/v1/nominations/${id}`);
        return response.data as Nomination;
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
