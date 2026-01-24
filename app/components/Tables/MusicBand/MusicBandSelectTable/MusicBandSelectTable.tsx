import { useState, type JSX } from "react";
import { Link } from "react-router-dom";
import type { MusicBand } from "~/types/musicBand/MusicBand";
import { MusicGenreDictionary } from "~/types/MusicGenre";
import styles from "./MusicBandSelectTable.module.scss";

interface MusicBandSelectTableProps {
    musicBands: MusicBand[];
    onSelectMusicBand: (newMusicBandId: number, newMusicBandName: string) => void;
}

export const MusicBandSelectTable = (
    { musicBands, onSelectMusicBand } : MusicBandSelectTableProps
): JSX.Element => {
    const [selectedBandId, setSelectedBandId] = useState<number | null>(null);

    const handleClickOnSelectMusicBand = (
        bandId: number,
        bandName: string
    ): void => {
        setSelectedBandId(bandId);
        onSelectMusicBand(bandId, bandName);
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Жанр</th>
                    <th>Участники</th>
                    <th>Синглы</th>
                    <th>Альбомы</th>
                    <th>Время создания</th>
                    <th>Дата основания</th>
                    <th>Описание</th>
                    <th>Координаты</th>
                    <th>Студия</th>
                    <th>Лучший альбом</th>
                </tr>
            </thead>
            <tbody>
            {musicBands.map(
                (band) => (
                    <tr
                        key={band.id}
                        onClick={ (_) => handleClickOnSelectMusicBand(band.id, band.name) }>
                        <td className={ band.id === selectedBandId ? styles.active : "inactive" }>+</td>
                        <td>
                            <Link to={`/music-bands/${band.id}`}>
                                {band.id}
                            </Link>
                        </td>
                        <td>
                            <Link to={`/music-bands/${band.id}`}>
                                {band.name}
                            </Link>
                        </td>
                        <td>{(band.genre === null)? "-" : MusicGenreDictionary[band.genre]}</td>
                        <td>{band.numberOfParticipants ?? "-"}</td>
                        <td>{band.singlesCount ?? "-"}</td>
                        <td>{band.albumsCount}</td>
                        <td>{new Date(band.creationDate).toLocaleString("ru-RU")}</td>
                        <td>{new Date(band.establishmentDate).toLocaleDateString("ru-RU")}</td>
                        <td>{band.description || "-"}</td>
                        <td>
                            <Link to={`/coordinates/${band.coordinates.id}`}>
                                x: {band.coordinates.x}, y: {band.coordinates.y}
                            </Link>
                        </td>
                        {band.studio !== null && <td>
                            <Link to={`/studios/${band.studio.id}`}>
                                {`${band.studio.name} (${band.studio.address})`}
                            </Link>
                        </td>}
                        {band.studio === null && <td>-</td>}
                        {band.bestAlbum !== null && <td>
                            <Link to={`/albums/${band.bestAlbum.id}`}>
                                {`${band.bestAlbum.name} (${band.bestAlbum.length} сек)`}
                            </Link>
                        </td>}
                        {band.bestAlbum === null && <td>-</td>}
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
