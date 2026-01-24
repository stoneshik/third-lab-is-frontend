import type { InsertionHistory } from "./InsertionHistory";

export interface WrapperListInsertionHistory {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    insertionHistories: InsertionHistory[];
}
