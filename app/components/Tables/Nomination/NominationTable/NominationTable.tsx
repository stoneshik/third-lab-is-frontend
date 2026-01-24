import type { JSX } from "react";
import { Link } from "react-router-dom";
import { MusicGenreDictionary } from "~/types/MusicGenre";
import type { Nomination } from "~/types/nomination/Nomination";
import styles from "./NominationTable.module.scss";

interface NominationTableProps {
    nominations: Nomination[];
}

export const NominationTable = ({ nominations } : NominationTableProps): JSX.Element => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ID музыкальной группы</th>
                    <th>Название музыкальной группы</th>
                    <th>Музыкальный жанр</th>
                    <th>Дата номинации</th>
                </tr>
            </thead>
            <tbody>
            {nominations.map(
                (nomination) => (
                    <tr key={nomination.id}>
                        <td>
                            <Link to={`/nominations/${nomination.id}`}>
                                {nomination.id}
                            </Link>
                        </td>
                        <td>{nomination.musicBandId}</td>
                        <td>
                            <Link to={`/music-bands/${nomination.musicBandId}`}>
                                {nomination.musicBandName}
                            </Link>
                        </td>
                        <td>{MusicGenreDictionary[nomination.musicGenre]}</td>
                        <td>{new Date(nomination.nominatedAt).toLocaleString("ru-RU")}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
