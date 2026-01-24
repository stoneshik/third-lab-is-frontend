import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListInsertionHistory } from "~/types/insertion/history/WrapperListInsertionHistory";

export interface ParamsForGetAllHistoriesByUser {
    userId: number;
    page: number;
    size: number;
}

export const getAllHistoriesByUser = async ({
    userId,
    page,
    size
}: ParamsForGetAllHistoriesByUser): Promise<WrapperListInsertionHistory> => {
    try {
        const params: Record<string, string | number> = {
            userId,
            page,
            size,
        };
        const response = await api.get("/api/v1/insertion/histories", { params });
        return response.data as WrapperListInsertionHistory;
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
