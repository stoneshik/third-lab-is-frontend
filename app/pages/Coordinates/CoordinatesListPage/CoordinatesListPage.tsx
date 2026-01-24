import { useCallback, useEffect, useState, type JSX } from "react";

import { getWrapperListCoordinates, type ParamsForGetWrapperListCoordinates } from "~/api/Coordinates/GetAllCoordinates";
import { CoordinatesCreateForm } from "~/components/Forms/Coordinates/CoordinatesCreateForm/CoordinatesCreateForm";
import { Header } from "~/components/Header/Header";
import { CoordinatesTable } from "~/components/Tables/Coordinates/CoordinatesTable/CoordinatesTable";
import { Button } from "~/components/UI/Button/Button";
import type { WrapperListCoordinates } from "~/types/coordinates/WrapperListCoordinates";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./CoordinatesListPage.module.scss";
import { tokenService } from "~/services/tokenService";

export default function CoordinatesListPage(): JSX.Element {
    const [wrapperListCoordinates, setWrapperListCoordinates] = useState<WrapperListCoordinates | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);

    const load = useCallback(
        async (params: ParamsForGetWrapperListCoordinates) => {
            try {
                const data = await getWrapperListCoordinates(params);
                setWrapperListCoordinates(data);
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

    const coordinates = wrapperListCoordinates?.coordinates;
    const totalPages = wrapperListCoordinates?.totalPages ?? 1;
    const totalElements = wrapperListCoordinates?.totalElements ?? 0;

    const handlePrevPage = (): void => setPage((p) => Math.max(0, p - 1));
    const handleNextPage = (): void => setPage((p) => Math.min((totalPages - 1), p + 1));

    return (
        <>
        <Header />
        <div className={styles.wrapper}>
            <h1>Координаты муз. групп</h1>
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

            {coordinates && <CoordinatesTable coordinates={coordinates} />}

            <div className={styles.pagination}>
                <Button onClick={handlePrevPage} textButton={"Назад"} disabled={page <= 0}/>
                <span>
                    Страница {page + 1} из {totalPages}
                </span>
                <Button onClick={handleNextPage} textButton={"Вперед"} disabled={page >= totalPages - 1}/>
            </div>

            {coordinates && <CoordinatesCreateForm />}
        </div>
        </>
    );
}
