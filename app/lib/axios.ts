import axios from "axios";
import { tokenService } from "~/services/tokenService";

export const baseURL: string = import.meta.env.URL_HOST_API_FOR_FRONTEND || "http://localhost:8080";

export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

// Добавляем access token в каждый запрос
api.interceptors.request.use(config => {
    const credentials = tokenService.get();
    if (credentials?.accessToken) {
        config.headers.Authorization = `Bearer ${credentials.accessToken}`;
    }
    return config;
});

// Обновление страницы при 401
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            tokenService.remove();
            globalThis.location.reload();
        }
        throw error;
    }
);
