import { api } from "~/lib/axios";
import { tokenService } from "~/services/tokenService";
import { isErrorMessage } from "~/types/ErrorMessage";
import type { JwtResponseDto } from "~/types/user/JwtResponseDto";

export interface ParamsForLoginUser {
    login: string;
    password: string;
}

export const loginUser = async (params: ParamsForLoginUser): Promise<void> => {
    try {
        const response = await api.post("/auth/login", {
            login: params.login,
            password: params.password,
        });
        const responseData: JwtResponseDto = response.data;
        if (responseData?.token && responseData?.id && responseData?.roles) {
            tokenService.set({
                accessToken: responseData.token,
                userId: responseData.id,
                roles: responseData.roles
            });
        } else {
            throw new Error("Некорректный ответ от сервера");
        }
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
