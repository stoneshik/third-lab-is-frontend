import type { Album } from "./Album";

export interface WrapperListAlbum {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    albums: Album[];
}
