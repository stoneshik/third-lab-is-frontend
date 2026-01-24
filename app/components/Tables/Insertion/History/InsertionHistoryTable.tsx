import type { JSX } from "react";
import type { InsertionHistory } from "~/types/insertion/history/InsertionHistory";
import { InsertionHistoryStatusDictionary } from "~/types/insertion/history/InsertionHistoryStatus";
import styles from "./InsertionHistoryTable.module.scss";

interface InsertionHistoryTableProps {
    insertionHistories: InsertionHistory[];
}

export const InsertionHistoryTable = ({ insertionHistories } : InsertionHistoryTableProps): JSX.Element => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Дата создания</th>
                    <th>Дата завершения</th>
                    <th>Статус</th>
                    <th>Пользователь</th>
                    <th>Количество импортированных строк</th>
                </tr>
            </thead>
            <tbody>
            {insertionHistories.map(
                (insertionHistory) => (
                    <tr key={insertionHistory.id}>
                        <td>{insertionHistory.id}</td>
                        <td>{new Date(insertionHistory.creationDate).toLocaleString("ru-RU")}</td>
                        <td>{insertionHistory.endDate === null ? '-': new Date(insertionHistory.endDate).toLocaleString("ru-RU")}</td>
                        <td>{InsertionHistoryStatusDictionary[insertionHistory.status]}</td>
                        <td>{insertionHistory.login}</td>
                        <td>{insertionHistory.numberObjects}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
    );
};
