import type { InsertionHistoryStatus } from "./InsertionHistoryStatus";

export interface InsertionHistory {
    id: number;
    creationDate: string;
    endDate: string;
    status: InsertionHistoryStatus;
    login: string;
    numberObjects: number;
}
