import { api } from "~/lib/axios";
import { isErrorMessage } from "~/types/ErrorMessage";

export interface ParamsForDownloadInsertionFileByUser {
    historyId: number;
    fileName: string;
    userId: number;
}

export const downloadInsertionFileByUser = async ({
    historyId,
    fileName,
    userId
}: ParamsForDownloadInsertionFileByUser): Promise<void> => {
    try {
        const response = await api.get(`/api/v1/insertion/histories/${historyId}/file`, {
            params: { userId },
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
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
