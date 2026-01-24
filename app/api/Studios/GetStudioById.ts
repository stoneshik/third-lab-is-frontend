import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { Studio } from "~/types/studio/Studio";

export interface ParamsForGetStudioId { id: number; }

export const getStudioById = async ({ id }: ParamsForGetStudioId): Promise<Studio> => {
    try {
        const response = await api.get(`/api/v1/studios/${id}`);
        return response.data as Studio;
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
