import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForCreateCoordinates {
    x: number;
    y: number;
}

export const createCoordinates = async (params: ParamsForCreateCoordinates): Promise<void> => {
    try {
        await api.post("/api/v1/coordinates", {
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
