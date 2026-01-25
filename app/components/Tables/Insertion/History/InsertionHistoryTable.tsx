import { useState, type JSX } from "react";
import { Link } from "react-router-dom";
import { downloadInsertionFileByAdmin } from "~/api/Insertion/Files/DownloadInsertionFileByAdmin";
import { downloadInsertionFileByUser } from "~/api/Insertion/Files/DownloadInsertionFileByUser";
import { ROLES, tokenService } from "~/services/tokenService";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { InsertionHistory } from "~/types/insertion/history/InsertionHistory";
import { InsertionHistoryStatusDictionary } from "~/types/insertion/history/InsertionHistoryStatus";
import styles from "./InsertionHistoryTable.module.scss";

interface InsertionHistoryTableProps {
    insertionHistories: InsertionHistory[];
}

export function InsertionHistoryTable({ insertionHistories } : InsertionHistoryTableProps): JSX.Element {
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handlingDownloadFile = async (historyId: number, fileName: string) => {
        setErrorMessage("");
        const credentials = tokenService.get();
        if (credentials === null) {
            setErrorMessage("Пользователь не авторизован");
            return;
        }
        const roles: Set<string> = new Set<string>(credentials.roles);
        try {
            if (roles.has(ROLES.ADMIN)) {
                await downloadInsertionFileByAdmin({ historyId, fileName });
            } else {
                const userId = credentials.userId;
                await downloadInsertionFileByUser({ historyId, fileName, userId });
            }
        } catch (error) {
            if (isErrorMessage(error)) {
                const message = createMessageStringFromErrorMessage(error);
                setErrorMessage(message);
                return;
            } else {
                setErrorMessage("Не получилось скачать файл");
            }
        }
    };

    return (
        <>
        <div className={styles.error}>{errorMessage}</div>
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Дата создания</th>
                    <th>Дата завершения</th>
                    <th>Статус</th>
                    <th>Пользователь</th>
                    <th>Количество импортированных строк</th>
                    <th>Сохраненный файл</th>
                    <th>Есть ли у файла коммит</th>
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
                        <td>{insertionHistory.numberObjects ?? "-"}</td>
                        {insertionHistory.fileObjectKey !== null &&
                        <td onClick={() => handlingDownloadFile(insertionHistory.id, insertionHistory.fileObjectKey ?? "")}>
                            <Link to="#">{insertionHistory.fileObjectKey}</Link>
                        </td>
                        }
                        {insertionHistory.fileObjectKey === null && <td>-</td>}
                        <td>{insertionHistory.fileCommitted === true ? "Да" : "Нет"}</td>
                    </tr>
                )
            )}
            </tbody>
        </table>
        </>
    );
}
