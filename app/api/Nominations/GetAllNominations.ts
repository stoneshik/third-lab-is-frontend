import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListNomination } from "~/types/nomination/WrapperListNomination";

export interface ParamsForGetWrapperListNomination {
    page: number;
    size: number;
}

export const getWrapperListNomination = async (
    params: ParamsForGetWrapperListNomination
): Promise<WrapperListNomination> => {
    try {
        const response = await api.get("/api/v1/nominations", { params });
        return response.data as WrapperListNomination;
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
