import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForRegisterUser {
    login: string;
    role: string[] | null;
    password: string;
}

export const registerUser = async (params: ParamsForRegisterUser): Promise<void> => {
    try {
        await api.post("/auth/register", {
            login: params.login,
            role: params.role,
            password: params.password,
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
