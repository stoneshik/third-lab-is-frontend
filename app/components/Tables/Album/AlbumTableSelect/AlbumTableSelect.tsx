import { useState, type JSX } from "react";
import type { Album } from "~/types/album/Album";
import styles from "./AlbumTableSelect.module.scss";

interface AlbumTableSelectProps {
    albums: Album[];
    onSelectAlbum: (
        newAlbumId: number | null,
        newAlbumName: string | null,
        newAlbumLength: number | null
    ) => void;
}

export const AlbumTableSelect = (
    { albums, onSelectAlbum } : AlbumTableSelectProps
): JSX.Element => {
    const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

    const handleClickOnSelectAlbum = (
        albumId: number,
        albumName: string,
        albumLength: number
    ): void => {
        if (albumId === selectedAlbumId) {
            setSelectedAlbumId(null);
            onSelectAlbum(null, null, null);
            return;
        }
        setSelectedAlbumId(albumId);
        onSelectAlbum(albumId, albumName, albumLength);
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Длительность</th>
                </tr>
            </thead>
            <tbody>
            {albums.map(
                (album) => (
                    <tr
                        key={album.id}
                        onClick={ (_) => handleClickOnSelectAlbum(album.id, album.name, album.length) }>
                        <td className={ album.id === selectedAlbumId ? styles.active : "inactive" }>+</td>
                        <td>{album.id}</td>
                        <td>{album.name}</td>
                        <td>{album.length} сек</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
