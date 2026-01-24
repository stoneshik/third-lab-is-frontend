import type { Coordinates } from "./Coordinates";

export interface WrapperListCoordinates {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    coordinates: Coordinates[];
}
