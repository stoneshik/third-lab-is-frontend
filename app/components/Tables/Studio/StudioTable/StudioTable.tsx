import type { JSX } from "react";
import { Link } from "react-router-dom";
import type { Studio } from "~/types/studio/Studio";
import styles from "./StudioTable.module.scss";

interface StudioTableProps {
    studios: Studio[];
}

export const StudioTable = ({ studios } : StudioTableProps): JSX.Element => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Адрес</th>
                </tr>
            </thead>
            <tbody>
            {studios.map(
                (studio) => (
                    <tr key={studio.id}>
                        <td>
                            <Link to={`/studios/${studio.id}`}>
                                {studio.id}
                            </Link>
                        </td>
                        <td>
                            <Link to={`/studios/${studio.id}`}>
                                {studio.name}
                            </Link>
                        </td>
                        <td>{studio.address}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
