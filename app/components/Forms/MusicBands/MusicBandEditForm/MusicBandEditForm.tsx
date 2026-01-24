import { useCallback, useEffect, useState, type JSX } from "react";
import { updateMusicBand, type ParamsForUpdateMusicBand } from "~/api/MusicBands/UpdateMusicBand";
import { Button } from "~/components/UI/Button/Button";
import type { AlbumRequestUpdate } from "~/types/album/AlbumRequestUpdate";
import type { CoordinatesRequestUpdate } from "~/types/coordinates/CoordinatesRequestUpdate";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { MusicBand } from "~/types/musicBand/MusicBand";
import { MusicGenre, MusicGenreDictionary } from "~/types/MusicGenre";
import type { StudioRequestUpdate } from "~/types/studio/StudioRequestUpdate";
import { AlbumSelect } from "../../Albums/AlbumSelect/AlbumSelect";
import { CoordinatesSelect } from "../../Coordinates/CoordinatesSelect/CoordinatesSelect";
import { StudioSelect } from "../../Studios/StudioSelect/StudioSelect";
import styles from "./MusicBandEditForm.module.scss";

type Props = { musicBand: MusicBand; };

export function MusicBandEditForm({ musicBand }: Readonly<Props>): JSX.Element {
    const [name, setName] = useState<string>("");

    const [coordinatesX, setCoordinatesX] = useState<number | null>(null);
    const [coordinatesY, setCoordinatesY] = useState<number | null>(null);
    const [coordinatesId, setCoordinatesId] = useState<number | null>(null);

    const [genre, setGenre] = useState<MusicGenre | null>(null);
    const [numberOfParticipants, setNumberOfParticipants] = useState<number | null>(null);
    const [singlesCount, setSinglesCount] = useState<number>(1);
    const [description, setDescription] = useState<string | null>(null);

    const [bestAlbumName, setBestAlbumName] = useState<string | null>(null);
    const [bestAlbumLength, setBestAlbumLength] = useState<number | null>(null);
    const [bestAlbumId, setBestAlbumId] = useState<number | null>(null);

    const [albumsCount, setAlbumsCount] = useState<number>(1);
    const [establishmentDate, setEstablishmentDate] = useState<string>("");

    const [studioName, setStudioName] = useState<string | null>(null);
    const [studioAddress, setStudioAddress] = useState<string | null>(null);
    const [studioId, setStudioId] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    useEffect(() => {
        if (musicBand) {
            setName(musicBand.name);
            const coordinates = musicBand.coordinates;
            setCoordinatesX(coordinates.x);
            setCoordinatesY(coordinates.y);
            setCoordinatesId(null);
            setGenre(musicBand.genre);
            setNumberOfParticipants(musicBand.numberOfParticipants);
            setSinglesCount(musicBand.singlesCount);
            setDescription(musicBand.description);

            const bestAlbum = musicBand.bestAlbum;
            if (bestAlbum === null) {
                setBestAlbumName(null);
                setBestAlbumLength(null);
            } else {
                setBestAlbumName(bestAlbum.name);
                setBestAlbumLength(bestAlbum.length);
            }
            setBestAlbumId(null);
            setAlbumsCount(musicBand.albumsCount);
            setEstablishmentDate(musicBand.establishmentDate);

            const studio = musicBand.studio;
            if (studio === null) {
                setStudioName(null);
                setStudioAddress(null);
            } else {
                setStudioName(studio.name);
                setStudioAddress(studio.address);
            }
            setStudioId(null);

            setErrorMessage("");
            setSuccessMessage("");
        }
    }, [musicBand]);

    const validate = useCallback(() => {
        if (!name || name.trim().length === 0) {
            setErrorMessage("Название музыкальной группы обязательно");
            return false;
        }
        if (coordinatesX === null && coordinatesY === null && coordinatesId === null) {
            setErrorMessage("Координаты обязательны для музыкальной группы");
            return false;
        }
        if (coordinatesX !== null && coordinatesY === null && coordinatesId === null ||
            coordinatesX === null && coordinatesY !== null && coordinatesId === null) {
            setErrorMessage("Должны быть выбраны существующие координаты, либо должны быть заполнены данные для добавления новых");
            return false;
        }
        if (numberOfParticipants !== null && (!Number.isFinite(numberOfParticipants) || Math.floor(numberOfParticipants) <= 0)) {
            setErrorMessage("Количество участников должно быть положительным целым числом больше нуля");
            return false;
        }
        if (!Number.isFinite(singlesCount) || Math.floor(singlesCount) <= 0) {
            setErrorMessage("Количество синглов должно быть положительным целым числом больше нуля");
            return false;
        }
        if (bestAlbumName !== null && bestAlbumLength === null && bestAlbumId === null ||
            bestAlbumName === null && bestAlbumLength !== null && bestAlbumId === null) {
            setErrorMessage("Должен быть выбран существующий альбом, либо должны быть заполнены данные для добавления нового");
            return false;
        }
        if (!Number.isFinite(albumsCount) || Math.floor(albumsCount) <= 0) {
            setErrorMessage("Количество альбомов должно быть положительным целым числом больше нуля");
            return false;
        }
        if (establishmentDate === "") {
            setErrorMessage("Выбор даты основания муз. группы обязательно");
            return false;
        }
        if (studioName !== null && studioAddress === null && studioId === null ||
            studioName === null && studioAddress !== null && studioId === null) {
            setErrorMessage("Должна быть выбрана существующая студия, либо должны быть заполнены данные для добавления новой");
            return false;
        }
        return true;
    }, [
        name,
        coordinatesX,
        coordinatesY,
        coordinatesId,
        genre,
        numberOfParticipants,
        singlesCount,
        description,
        bestAlbumName,
        bestAlbumLength,
        bestAlbumId,
        albumsCount,
        establishmentDate,
        studioName,
        studioAddress,
        studioId,
    ]);

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                let forRequestCoordinatesX = coordinatesX;
                let forRequestCoordinatesY = coordinatesY;
                let forRequestCoordinates: CoordinatesRequestUpdate | null = null;
                if (coordinatesId === null && forRequestCoordinatesX !== null && forRequestCoordinatesY !== null) {
                    forRequestCoordinates = {
                        x: forRequestCoordinatesX,
                        y: forRequestCoordinatesY
                    }
                }
                if (coordinatesId !== null) {
                    forRequestCoordinatesX = null;
                    forRequestCoordinatesY = null;
                }

                let forRequestBestAlbumName = bestAlbumName;
                let forRequestBestAlbumLength = bestAlbumLength;
                let forRequestBestAlbum: AlbumRequestUpdate | null = null;
                if (bestAlbumId === null && forRequestBestAlbumName !== null && forRequestBestAlbumLength !== null) {
                    forRequestBestAlbum = {
                        name: forRequestBestAlbumName,
                        length: forRequestBestAlbumLength
                    }
                }
                if (bestAlbumId !== null) {
                    forRequestBestAlbumName = null;
                    forRequestBestAlbumLength = null;
                }

                let forRequestStudioName = studioName;
                let forRequestStudioAddress = studioAddress;
                let forRequestStudio: StudioRequestUpdate | null = null;
                if (studioId === null && forRequestStudioName !== null && forRequestStudioAddress !== null) {
                    forRequestStudio = {
                        name: forRequestStudioName,
                        address: forRequestStudioAddress
                    }
                }
                if (studioId !== null) {
                    forRequestStudioName = null;
                    forRequestStudioAddress = null;
                }

                const params: ParamsForUpdateMusicBand = {
                    id: musicBand.id,
                    name: name,
                    coordinates: forRequestCoordinates,
                    coordinatesId: (coordinatesId === null)? null : Math.floor(coordinatesId),
                    genre: genre,
                    numberOfParticipants: (numberOfParticipants === null)? null : Math.floor(numberOfParticipants),
                    singlesCount: Math.floor(singlesCount),
                    description: description,
                    bestAlbum: forRequestBestAlbum,
                    bestAlbumId: (bestAlbumId === null)? null : Math.floor(bestAlbumId),
                    albumsCount: Math.floor(albumsCount),
                    establishmentDate: establishmentDate,
                    studio: forRequestStudio,
                    studioId: (studioId === null)? null : Math.floor(studioId),
                };
                await updateMusicBand(params);
                setSuccessMessage("Музыкальная группа успешно обновлена");
                setErrorMessage("");
                setTimeout(() => globalThis.location.reload(), 2000);
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Ошибка при обновлении");
            } finally { setLoading(false); }
        },
        [
            musicBand,
            name,
            coordinatesX,
            coordinatesY,
            coordinatesId,
            genre,
            numberOfParticipants,
            singlesCount,
            description,
            bestAlbumName,
            bestAlbumLength,
            bestAlbumId,
            albumsCount,
            establishmentDate,
            studioName,
            studioAddress,
            studioId,
            validate,
        ]
    );

    const handleSelectCoordinates = (
        newCoordinatesId: number | null,
        newCoordinatesX: number | null,
        newCoordinatesY: number | null
    ): void => {
        setCoordinatesId(newCoordinatesId);
        setCoordinatesX(newCoordinatesX);
        setCoordinatesY(newCoordinatesY);
    };

    const handleSelectBestAlbum = (
        newAlbumId: number | null,
        newAlbumName: string | null,
        newAlbumLength: number | null
    ): void => {
        setBestAlbumId(newAlbumId);
        setBestAlbumName(newAlbumName);
        setBestAlbumLength(newAlbumLength);
    };

    const handleSelectStudio = (
        newStudioId: number | null,
        newStudioName: string | null,
        newStudioAddress: string | null
    ): void => {
        setStudioId(newStudioId);
        setStudioName(newStudioName);
        setStudioAddress(newStudioAddress);
    };

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Обновление музыкальной группы</h2>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="music-band-name">Название*</label>
                    <input
                        id="music-band-name"
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        maxLength={50}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="coordinates-x">x*</label>
                    <input
                        id="coordinates-x"
                        className={styles.input}
                        type="number"
                        value={(coordinatesX !== null && (Number.isFinite(coordinatesX)) ? coordinatesX : "")}
                        onChange={(e) => setCoordinatesX(Number(e.target.value))}
                        disabled={loading || coordinatesId !== null}
                        step={0.01} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="coordinates-y">y*</label>
                    <input
                        id="coordinates-y"
                        className={styles.input}
                        type="number"
                        value={(coordinatesY !== null && Number.isFinite(coordinatesY)) ? coordinatesY : ""}
                        onChange={(e) => setCoordinatesY(Number(e.target.value))}
                        disabled={loading || coordinatesId !== null}
                        step={1} />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="music-genre">Музыкальный жанр</label>
                    <select
                        id="music-genre"
                        value={genre as string ?? ""}
                        onChange={(e) => (e.target.value === "-")? setGenre(null) : setGenre(e.target.value as MusicGenre)}>
                        {["-", ...Object.values(MusicGenre)].map((s) => (
                            <option key={s} value={s}>
                                { (s === "-")? "-" : MusicGenreDictionary[s] }
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="number-of-participants">Количество участников</label>
                    <div>
                        <input
                            id="number-of-participants"
                            className={styles.input}
                            type="number"
                            value={(numberOfParticipants !== null && Number.isFinite(numberOfParticipants)) ? numberOfParticipants : ""}
                            onChange={(e) => setNumberOfParticipants(Number(e.target.value))}
                            disabled={loading}
                            min={1}
                            step={1} />
                        <button type="button" onClick={() => setNumberOfParticipants(null)}>×</button>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="singles-count">Количество синглов*</label>
                    <input
                        id="singles-count"
                        className={styles.input}
                        type="number"
                        value={(Number.isFinite(singlesCount)) ? singlesCount : ""}
                        onChange={(e) => setSinglesCount(Number(e.target.value))}
                        disabled={loading}
                        min={1}
                        step={1}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="music-band-description">Описание</label>
                    <div>
                        <input
                            id="music-band-description"
                            className={styles.input}
                            type="text"
                            value={description ?? ""}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            maxLength={50} />
                        <button type="button" onClick={() => setDescription(null)}>×</button>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="best-album-name">Название лучшего альбома</label>
                    <div>
                        <input
                            id="best-album-name"
                            className={styles.input}
                            type="text"
                            value={bestAlbumName ?? ""}
                            onChange={(e) => setBestAlbumName(e.target.value)}
                            disabled={loading || bestAlbumId !== null}
                            maxLength={50} />
                        <button type="button" onClick={() => bestAlbumId ?? setBestAlbumName(null)}>×</button>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="best-album-length">Длина лучшего альбома</label>
                    <div>
                        <input
                            id="best-album-length"
                            className={styles.input}
                            type="number"
                            value={bestAlbumLength !== null && (Number.isFinite(bestAlbumLength)) ? bestAlbumLength : ""}
                            onChange={(e) => setBestAlbumLength(Number(e.target.value))}
                            disabled={loading || bestAlbumId !== null}
                            min={1}
                            step={1} />
                        <button type="button" onClick={() => bestAlbumId ?? setBestAlbumLength(null)}>×</button>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="albums-count">Количество альбомов*</label>
                    <input
                        id="albums-count"
                        className={styles.input}
                        type="number"
                        value={(Number.isFinite(albumsCount)) ? albumsCount : ""}
                        onChange={(e) => setAlbumsCount(Number(e.target.value))}
                        disabled={loading}
                        min={1}
                        step={1}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="establishment-date">Дата основания*</label>
                    <input
                        id="establishment-date"
                        className={styles.input}
                        type="date"
                        value={establishmentDate ?? ""}
                        onChange={(e) => setEstablishmentDate(e.target.value)}
                        disabled={loading}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="studio-name">Название студии</label>
                    <div>
                        <input
                            id="studio-name"
                            className={styles.input}
                            type="text"
                            value={studioName ?? ""}
                            onChange={(e) => setStudioName(e.target.value)}
                            disabled={loading || studioId !== null}
                            maxLength={50} />
                        <button type="button" onClick={() => studioId ?? setStudioName(null)}>×</button>
                    </div>
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="studio-address">Адрес студии</label>
                    <div>
                        <input
                            id="studio-address"
                            className={styles.input}
                            type="text"
                            value={studioAddress ?? ""}
                            onChange={(e) => setStudioAddress(e.target.value)}
                            disabled={loading || studioId !== null}
                            maxLength={50} />
                        <button type="button" onClick={() => studioId ?? setStudioAddress(null)}>×</button>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Обновление..." : "Обновить"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={styles.success}>{successMessage}</div>}
                </div>
            </form>
            <CoordinatesSelect onSelectCoordinates={handleSelectCoordinates} />
            <AlbumSelect onSelectAlbum={handleSelectBestAlbum} />
            <StudioSelect onSelectStudio={handleSelectStudio} />
        </div>
    );
}
