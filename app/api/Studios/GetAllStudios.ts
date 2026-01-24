import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListStudio } from "~/types/studio/WrapperListStudio";

export interface ParamsForGetWrapperListStudio {
    page: number;
    size: number;
}

export const getWrapperListStudio = async (
    params: ParamsForGetWrapperListStudio
): Promise<WrapperListStudio> => {
    try {
        const response = await api.get("/api/v1/studios", { params });
        return response.data as WrapperListStudio;
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
