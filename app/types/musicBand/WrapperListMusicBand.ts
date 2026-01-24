import type { MusicBand } from "./MusicBand";

export interface WrapperListMusicBand {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    musicBands: MusicBand[];
}

export const isWrapperListMusicBand = (obj: any): obj is WrapperListMusicBand => {
    return obj && Array.isArray(obj.items);
}
