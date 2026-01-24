export enum SortNameField {
    NAME = "name",
    GENRE = "genre",
    DESCRIPTION = "description",
    BEST_ALBUM_NAME = "bestAlbumName",
    STUDIO_NAME = "studioName",
    STUDIO_ADDRESS = "studioAddress",
}

export const SortNameFieldDictionary: Record<string, string> = {
    name: "Название группы",
    genre: "Музыкальный жанр",
    description: "Описание группы",
    bestAlbumName: "Название лучшего альбома",
    studioName: "Название студии",
    studioAddress: "Адрес студии",
};
