import { useCallback, useEffect, useState, type JSX } from "react";

import type { ParamsForGetWrapperListMusicBand } from "~/api/MusicBands/GetAllMusicBands";
import { getWrapperListMusicBand } from "~/api/MusicBands/GetAllMusicBands";
import { Header } from "~/components/Header/Header";
import { MusicBandTable } from "~/components/Tables/MusicBand/MusicBandTable/MusicBandTable";
import { Button } from "~/components/UI/Button/Button";
import { tokenService } from "~/services/tokenService";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { WrapperListMusicBand } from "~/types/musicBand/WrapperListMusicBand";
import { MusicGenre, MusicGenreDictionary } from "~/types/MusicGenre";
import { SortNameField, SortNameFieldDictionary } from "~/types/SortNameField";
import { SortOrder, SortOrderDictionary } from "~/types/SortOrder";
import styles from "./HomePage.module.scss";

export default function HomePage(): JSX.Element {
    const [wrapperListMusicBand, setWrapperListMusicBand] = useState<WrapperListMusicBand | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [genre, setGenre] = useState<MusicGenre | null>(null);
    const [description, setDescription] = useState<string>("");
    const [bestAlbumName, setBestAlbumName] = useState<string>("");
    const [studioName, setStudioName] = useState<string>("");
    const [studioAddress, setStudioAddress] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [size, setSize] = useState<number>(10);
    const [sortNameField, setSortNameField] = useState<SortNameField>(SortNameField.NAME);
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

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
        if (tokenService.isEmpty()) {
            globalThis.location.assign("/login");
        }
        let mounted = true;
        let intervalId: NodeJS.Timeout;
        const fetchData = async () => {
            if (!mounted) return;
            try {
                await load({
                    name,
                    genre,
                    description,
                    bestAlbumName,
                    studioName,
                    studioAddress,
                    page,
                    size,
                    sortNameField,
                    sortOrder,
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
    }, [
        name,
        genre,
        description,
        bestAlbumName,
        studioName,
        studioAddress,
        page,
        size,
        sortNameField,
        sortOrder,
        load,
    ]);

    const musicBands = wrapperListMusicBand?.musicBands;
    const totalPages = wrapperListMusicBand?.totalPages ?? 1;
    const totalElements = wrapperListMusicBand?.totalElements ?? 0;

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const rawValue = event.target.value;
        if (rawValue === "-") {
            setGenre(null);
            setPage(0);
            return;
        }
        setGenre(rawValue as MusicGenre);
        setPage(0);
    };

    const handlePrevPage = (): void => setPage((p) => Math.max(0, p - 1));
    const handleNextPage = (): void => setPage((p) => Math.min((totalPages - 1), p + 1));

    return (
        <>
        <Header />
        <div className={styles.wrapper}>
            <h1>Музыкальные группы</h1>
            <h2>Всего найдено: {totalElements}</h2>
            <div className={styles.error}>{errorMessage}</div>
            <div className={styles.controls}>
                <input
                    type="text"
                    name="name_music_band"
                    placeholder="Фильтр по названию группы..."
                    value={name}
                    style={{ width: 240 }}
                    onChange={(e) => {
                        setName(e.target.value);
                        setPage(0);
                    }}/>
                <select
                    name="music_genre"
                    value={(genre === null)? "-" : genre as string}
                    onChange={handleGenreChange}>
                    {["-", ...Object.values(MusicGenre)].map((s) => (
                        <option key={s} value={s}>
                            { (s === "-")? "-" : MusicGenreDictionary[s] }
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    name="description"
                    placeholder="Фильтр по описанию..."
                    value={description}
                    style={{ width: 180 }}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setPage(0);
                    }}/>
                <input
                    type="text"
                    name="best_album_name"
                    placeholder="Фильтр по названию лучшего альбома..."
                    value={bestAlbumName}
                    style={{ width: 325 }}
                    onChange={(e) => {
                        setBestAlbumName(e.target.value);
                        setPage(0);
                    }}/>
                <input
                    type="text"
                    name="studio_name"
                    placeholder="Фильтр по названию студии..."
                    value={studioName}
                    style={{ width: 240 }}
                    onChange={(e) => {
                        setStudioName(e.target.value);
                        setPage(0);
                    }}/>
                <input
                    type="text"
                    name="studio_address"
                    placeholder="Фильтр по адресу студии..."
                    value={studioAddress}
                    onChange={(e) => {
                        setStudioAddress(e.target.value);
                        setPage(0);
                    }}/>
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
                <select
                    name="sort_name_field"
                    value={sortNameField as string}
                    onChange={(e) => {
                        setSortNameField(e.target.value as SortNameField);
                        setPage(0);
                    }}>
                    {["-", ...Object.values(SortNameField)].map((s) => (
                        <option key={s} value={s}>
                            { (s === "-")? "-" : SortNameFieldDictionary[s] }
                        </option>
                    ))}
                </select>
                <select
                    name="sort_order"
                    value={sortOrder as string}
                    onChange={(e) => {
                        setSortOrder(e.target.value as SortOrder);
                        setPage(0);
                    }}>
                    {Object.values(SortOrder).map((s) => (
                        <option key={s} value={s}>
                            { SortOrderDictionary[s] }
                        </option>
                    ))}
                </select>
            </div>

            {musicBands && <MusicBandTable musicBands={musicBands} />}

            <div className={styles.pagination}>
                <Button onClick={handlePrevPage} textButton={"Назад"} disabled={page <= 0}/>
                <span>Страница {page + 1} из {totalPages}</span>
                <Button onClick={handleNextPage} textButton={"Вперед"} disabled={page >= totalPages - 1}/>
            </div>
        </div>
        </>
    );
}
