import { useCallback, useEffect, useState, type JSX } from "react";

import { getWrapperListStudio, type ParamsForGetWrapperListStudio } from "~/api/Studios/GetAllStudios";
import { StudioCreateForm } from "~/components/Forms/Studios/StudioCreateForm/StudioCreateForm";
import { Header } from "~/components/Header/Header";
import { StudioTable } from "~/components/Tables/Studio/StudioTable/StudioTable";
import { Button } from "~/components/UI/Button/Button";
import { tokenService } from "~/services/tokenService";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListStudio } from "~/types/studio/WrapperListStudio";
import styles from "./StudiosListPage.module.scss";

export default function StudiosListPage(): JSX.Element {
    const [wrapperListStudio, setWrapperListStudio] = useState<WrapperListStudio | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);

    const load = useCallback(
        async (params: ParamsForGetWrapperListStudio) => {
            try {
                const data = await getWrapperListStudio(params);
                setWrapperListStudio(data);
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
                await load({page, size});
            } catch {
                setErrorMessage("Не получилось загрузить данные");
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 10_000);
        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [page, size, load]);

    const studios = wrapperListStudio?.studios;
    const totalPages = wrapperListStudio?.totalPages ?? 1;
    const totalElements = wrapperListStudio?.totalElements ?? 0;

    const handlePrevPage = (): void => setPage((p) => Math.max(0, p - 1));
    const handleNextPage = (): void => setPage((p) => Math.min((totalPages - 1), p + 1));

    return (
        <>
        <Header />
        <div className={styles.wrapper}>
            <h1>Студии</h1>
            <h2>Всего найдено: {totalElements}</h2>
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

            {studios && <StudioTable studios={studios} />}

            <div className={styles.pagination}>
                <Button onClick={handlePrevPage} textButton={"Назад"} disabled={page <= 0}/>
                <span>Страница {page + 1} из {totalPages}</span>
                <Button onClick={handleNextPage} textButton={"Вперед"} disabled={page >= totalPages - 1}/>
            </div>

            {studios && <StudioCreateForm />}
        </div>
        </>
    );
}
