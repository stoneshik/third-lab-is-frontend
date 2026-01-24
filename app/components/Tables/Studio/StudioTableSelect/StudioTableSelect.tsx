import { useState, type JSX } from "react";
import type { Studio } from "~/types/studio/Studio";
import styles from "./StudioTableSelect.module.scss";

interface StudioTableSelectProps {
    studios: Studio[];
    onSelectStudio: (
        newStudioId: number | null,
        newStudioName: string | null,
        newStudioAddress: string | null
    ) => void;
}

export const StudioTableSelect = (
    { studios, onSelectStudio } : StudioTableSelectProps
): JSX.Element => {
    const [selectedStudioId, setSelectedStudioId] = useState<number | null>(null);

    const handleClickOnSelectStudio = (
        studioId: number,
        studioName: string,
        studioAddress: string
    ): void => {
        if (studioId === selectedStudioId) {
            setSelectedStudioId(null);
            onSelectStudio(null, null, null);
            return;
        }
        setSelectedStudioId(studioId);
        onSelectStudio(studioId, studioName, studioAddress);
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Адрес</th>
                </tr>
            </thead>
            <tbody>
            {studios.map(
                (studio) => (
                    <tr
                        key={studio.id}
                        onClick={ (_) => handleClickOnSelectStudio(studio.id, studio.name, studio.address) }>
                        <td className={ studio.id === selectedStudioId ? styles.active : "inactive" }>+</td>
                        <td>{studio.id}</td>
                        <td>{studio.name}</td>
                        <td>{studio.address}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
