import { useCallback, useEffect, useState, type JSX } from "react";

import { getWrapperListAlbum, type ParamsForGetWrapperListAlbum } from "~/api/Albums/GetAllAlbums";
import { AlbumTableSelect } from "~/components/Tables/Album/AlbumTableSelect/AlbumTableSelect";
import { Button } from "~/components/UI/Button/Button";
import type { WrapperListAlbum } from "~/types/album/WrapperListAlbum";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./AlbumSelect.module.scss";

interface AlbumSelectProps {
    onSelectAlbum: (
        newAlbumId: number | null,
        newAlbumName: string | null,
        newAlbumLength: number | null
    ) => void;
}

export function AlbumSelect({ onSelectAlbum }: Readonly<AlbumSelectProps>): JSX.Element {
    const [wrapperListAlbum, setWrapperListAlbum] = useState<WrapperListAlbum | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(5);

    const load = useCallback(
        async (params: ParamsForGetWrapperListAlbum) => {
            try {
                const data = await getWrapperListAlbum(params);
                setWrapperListAlbum(data);
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
        let mounted = true;
        let intervalId: NodeJS.Timeout;
        const fetchData = async () => {
            if (!mounted) return;
            try {
                await load({page: page, size: size});
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

    const albums = wrapperListAlbum?.albums;
    const totalPages = wrapperListAlbum?.totalPages ?? 1;
    const totalElements = wrapperListAlbum?.totalElements ?? 0;

    const handlePrevPage = (): void => setPage((p) => Math.max(0, p - 1));
    const handleNextPage = (): void => setPage((p) => Math.min((totalPages - 1), p + 1));

    return (
        <div className={styles.wrapper}>
            <h2>Альбомы</h2>
            <h3>Всего найдено: {totalElements}</h3>
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

            {albums && <AlbumTableSelect albums={albums} onSelectAlbum={onSelectAlbum} />}

            <div className={styles.pagination}>
                <Button onClick={handlePrevPage} textButton={"Назад"} disabled={page <= 0}/>
                <span>Страница {page + 1} из {totalPages}</span>
                <Button onClick={handleNextPage} textButton={"Вперед"} disabled={page >= totalPages - 1}/>
            </div>
        </div>
    );
}
