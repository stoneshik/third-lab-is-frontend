import { useCallback, useEffect, useState, type JSX } from "react";

import type { ParamsForGetWrapperListMusicBand } from "~/api/MusicBands/GetAllMusicBands";
import { getWrapperListMusicBand } from "~/api/MusicBands/GetAllMusicBands";
import { MusicBandSelectTable } from "~/components/Tables/MusicBand/MusicBandSelectTable/MusicBandSelectTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListMusicBand } from "~/types/musicBand/WrapperListMusicBand";
import { SortNameField } from "~/types/SortNameField";
import { SortOrder } from "~/types/SortOrder";
import styles from "./MusicBandSelect.module.scss";

interface MusicBandSelectProps {
    onSelectMusicBand: (newMusicBandId: number, newMusicBandName: string) => void;
}

export function MusicBandSelect({ onSelectMusicBand }: Readonly<MusicBandSelectProps>): JSX.Element {
    const [wrapperListMusicBand, setWrapperListMusicBand] = useState<WrapperListMusicBand | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(5);
    const [sortNameField] = useState<SortNameField>(SortNameField.NAME);
    const [sortOrder] = useState<SortOrder>(SortOrder.ASC);

    const load = useCallback(
        async (params: ParamsForGetWrapperListMusicBand) => {
            try {
                const data = await getWrapperListMusicBand(params);
                setWrapperListMusicBand(data);
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
                await load({
                    name: "",
                    genre: null,
                    description: "",
                    bestAlbumName: "",
                    studioName: "",
                    studioAddress: "",
                    page: page,
                    size: size,
                    sortNameField: sortNameField,
                    sortOrder: sortOrder,
                });
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

    const musicBands = wrapperListMusicBand?.musicBands;
    const totalPages = wrapperListMusicBand?.totalPages ?? 1;
    const totalElements = wrapperListMusicBand?.totalElements ?? 0;

    const handlePrevPage = (): void => setPage((p) => Math.max(0, p - 1));
    const handleNextPage = (): void => setPage((p) => Math.min((totalPages - 1), p + 1));

    return (
        <div className={styles.wrapper}>
            <h2>Музыкальные группы</h2>
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

            {musicBands && <MusicBandSelectTable musicBands={musicBands} onSelectMusicBand={onSelectMusicBand} />}

            <div className={styles.pagination}>
                <Button onClick={handlePrevPage} textButton={"Назад"} disabled={page <= 0}/>
                <span>Страница {page + 1} из {totalPages}</span>
                <Button onClick={handleNextPage} textButton={"Вперед"} disabled={page >= totalPages - 1}/>
            </div>
        </div>
    );
}
