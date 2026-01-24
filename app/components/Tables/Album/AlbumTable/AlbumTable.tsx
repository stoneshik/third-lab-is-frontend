import type { JSX } from "react";
import { Link } from "react-router-dom";
import type { Album } from "~/types/album/Album";
import styles from "./AlbumTable.module.scss";

interface AlbumTableProps {
    albums: Album[]
}

export const AlbumTable = ({ albums } : AlbumTableProps): JSX.Element => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Длительность</th>
                </tr>
            </thead>
            <tbody>
            {albums.map(
                (album) => (
                    <tr key={album.id}>
                        <td>
                            <Link to={`/albums/${album.id}`}>
                                {album.id}
                            </Link>
                        </td>
                        <td>
                            <Link to={`/albums/${album.id}`}>
                                {album.name}
                            </Link>
                        </td>
                        <td>{album.length} сек</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
