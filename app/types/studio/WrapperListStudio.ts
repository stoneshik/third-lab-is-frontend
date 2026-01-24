import type { Studio } from "./Studio";

export interface WrapperListStudio {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    studios: Studio[];
}
