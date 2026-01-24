import { useState, type JSX } from "react";
import type { Coordinates } from "~/types/coordinates/Coordinates";
import styles from "./CoordinatesTableSelect.module.scss";

interface CoordinatesTableSelectProps {
    coordinates: Coordinates[];
    onSelectCoordinates: (
        newCoordinatesId: number | null,
        newCoordinatesX: number | null,
        newCoordinatesY: number | null
    ) => void;
}

export const CoordinatesTableSelect = (
    { coordinates, onSelectCoordinates } : CoordinatesTableSelectProps
): JSX.Element => {
    const [selectedCoordinatesId, setSelectedCoordinatesId] = useState<number | null>(null);

    const handleClickOnSelectCoordinates = (
        coordinatesId: number,
        coordinatesX: number,
        coordinatesY: number
    ): void => {
        if (coordinatesId === selectedCoordinatesId) {
            setSelectedCoordinatesId(null);
            onSelectCoordinates(null, null, null);
            return;
        }
        setSelectedCoordinatesId(coordinatesId);
        onSelectCoordinates(coordinatesId, coordinatesX, coordinatesY);
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th></th>
                    <th>ID</th>
                    <th>x</th>
                    <th>y</th>
                </tr>
            </thead>
            <tbody>
            {coordinates.map(
                (coordinate) => (
                    <tr
                        key={coordinate.id}
                        onClick={ (_) => handleClickOnSelectCoordinates(coordinate.id, coordinate.x, coordinate.y) }>
                        <td className={ coordinate.id === selectedCoordinatesId ? styles.active : "inactive" }>+</td>
                        <td>{coordinate.id}</td>
                        <td>{coordinate.x}</td>
                        <td>{coordinate.y}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
