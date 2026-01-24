import { api } from "~/lib/axios";
import type { WrapperListCoordinates } from "~/types/coordinates/WrapperListCoordinates";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForGetWrapperListCoordinates {
    page: number;
    size: number;
}

export const getWrapperListCoordinates = async (
    params: ParamsForGetWrapperListCoordinates
): Promise<WrapperListCoordinates> => {
    try {
        const response = await api.get("/api/v1/coordinates", { params });
        return response.data as WrapperListCoordinates;
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
