import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForUpdateCoordinates {
    id: number;
    x: number;
    y: number;
}

export const updateCoordinates = async (params: ParamsForUpdateCoordinates): Promise<void> => {
    try {
        await api.put(`/api/v1/coordinates/${params.id}`, {
            x: params.x,
            y: params.y,
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
