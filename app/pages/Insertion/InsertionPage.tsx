import { useCallback, useEffect, useState, type JSX } from "react";

import { getAllHistoriesByAdmin, type ParamsForGetAllHistoriesByAdmin } from "~/api/Insertion/Histories/GetAllHistoriesByAdmin";
import { getAllHistoriesByUser, type ParamsForGetAllHistoriesByUser } from "~/api/Insertion/Histories/GetAllHistoriesByUser";
import { CsvUploadForm } from "~/components/Forms/CsvUploadForm/CsvUploadForm";
import { Header } from "~/components/Header/Header";
import { InsertionHistoryTable } from "~/components/Tables/Insertion/History/InsertionHistoryTable";
import { Button } from "~/components/UI/Button/Button";
import { ROLES, tokenService } from "~/services/tokenService";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListInsertionHistory } from "~/types/insertion/history/WrapperListInsertionHistory";
import styles from "./InsertionPage.module.scss";

export default function InsertionPage(): JSX.Element {
    const [wrapperListInsertionHistory, setWrapperListInsertionHistory] = useState<WrapperListInsertionHistory | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);

    const loadByAdmin = useCallback(
        async (params: ParamsForGetAllHistoriesByAdmin) => {
            try {
                const data = await getAllHistoriesByAdmin(params);
                setWrapperListInsertionHistory(data);
                setErrorMessage("");
            } catch (error) {
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
            }
        }, []
    );
    const loadByUser = useCallback(
        async (params: ParamsForGetAllHistoriesByUser) => {
            try {
                const data = await getAllHistoriesByUser(params);
                setWrapperListInsertionHistory(data);
                setErrorMessage("");
            } catch (error) {
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
            }
        }, []
    );

    useEffect(() => {
        if (tokenService.isEmpty()) {
            globalThis.location.assign("/login");
        }
        let mounted = true;
        let intervalId: NodeJS.Timeout;
        const fetchData = async () => {
            if (!mounted) return;
            try {
                const credentials = tokenService.get();
                if (credentials === null) {
                    setErrorMessage('Пользователь не авторизован');
                    return;
                }
                const roles: Set<string> = new Set<string>(credentials.roles);
                if (roles.has(ROLES.ADMIN)) {
                    await loadByAdmin({page, size});
                } else {
                    const userId = credentials.userId;
                    await loadByUser({userId, page, size});
                }
            } catch {
                setErrorMessage("Не получилось загрузить данные");
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 2_000);
        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [page, size, loadByAdmin, loadByUser]);

    const insertionHistories = wrapperListInsertionHistory?.insertionHistories;
    const totalPages = wrapperListInsertionHistory?.totalPages ?? 1;
    const totalElements = wrapperListInsertionHistory?.totalElements ?? 0;

    const handlePrevPage = (): void => setPage((p) => Math.max(0, p - 1));
    const handleNextPage = (): void => setPage((p) => Math.min((totalPages - 1), p + 1));

    return (
        <>
        <Header />
        <div className={styles.wrapper}>
            <CsvUploadForm/>
            <h2>История импорта:</h2>
            <h3>Всего найдено записей: {totalElements}</h3>
            <div className={styles.error}>{errorMessage}</div>
            <div className={styles.controls}>
                <select
                    name="size"
                    value={size}
                    onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(0);
                    }}>
                    {[5, 10, 20].map((s) => (
                        <option key={s} value={s}>
                            {s} на страницу
                        </option>
                    ))}
                </select>
            </div>

            {insertionHistories && <InsertionHistoryTable insertionHistories={insertionHistories} />}

            <div className={styles.pagination}>
                <Button onClick={handlePrevPage} textButton={"Назад"} disabled={page <= 0}/>
                <span>
                    Страница {page + 1} из {totalPages}
                </span>
                <Button onClick={handleNextPage} textButton={"Вперед"} disabled={page >= totalPages - 1}/>
            </div>
        </div>
        </>
    );
}
