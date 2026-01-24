import type { Nomination } from "./Nomination";

export interface WrapperListNomination {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    nominations: Nomination[];
}
