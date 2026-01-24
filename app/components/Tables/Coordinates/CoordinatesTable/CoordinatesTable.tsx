import type { JSX } from "react";
import { Link } from "react-router-dom";
import type { Coordinates } from "~/types/coordinates/Coordinates";
import styles from "./CoordinatesTable.module.scss";

interface CoordinatesTableProps {
    coordinates: Coordinates[];
}

export const CoordinatesTable = ({ coordinates } : CoordinatesTableProps): JSX.Element => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>x</th>
                    <th>y</th>
                </tr>
            </thead>
            <tbody>
            {coordinates.map(
                (coordinate) => (
                    <tr key={coordinate.id}>
                        <td>
                            <Link to={`/coordinates/${coordinate.id}`}>
                                {coordinate.id}
                            </Link>
                        </td>
                        <td>{coordinate.x}</td>
                        <td>{coordinate.y}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
