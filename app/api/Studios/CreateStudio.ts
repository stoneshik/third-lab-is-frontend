import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForCreateStudio {
    name: string;
    address: string;
}

export const createStudio = async (params: ParamsForCreateStudio): Promise<void> => {
    try {
        await api.post("/api/v1/studios", {
            name: params.name,
            address: params.address,
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
