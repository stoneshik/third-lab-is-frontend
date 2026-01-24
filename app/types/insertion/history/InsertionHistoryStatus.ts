export enum InsertionHistoryStatus {
    SUCCESS = 'SUCCESS',
    PENDING = 'PENDING',
    FAILED = 'FAILED',
}

export const InsertionHistoryStatusDictionary: Record<string, string> = {
    SUCCESS: "Успешно",
    PENDING: "В процессе",
    FAILED: "Неуспешно",
};
