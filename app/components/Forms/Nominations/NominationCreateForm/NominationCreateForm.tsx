import { useCallback, useState, type JSX } from "react";
import { createNomination, type ParamsForCreateNomination } from "~/api/Nominations/CreateNomination";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import { MusicGenre, MusicGenreDictionary } from "~/types/MusicGenre";
import { MusicBandSelect } from "../../MusicBands/MusicBandSelect/MusicBandSelect";
import styles from "./NominationCreateForm.module.scss";

export function NominationCreateForm(): JSX.Element {
    const [musicBandId, setMusicBandId] = useState<number>(0);
    const [musicBandName, setMusicBandName] = useState<string>("");
    const [musicGenre, setMusicGenre] = useState<MusicGenre>(MusicGenre.BRIT_POP);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const validate = useCallback(() => {
        if (!Number.isFinite(musicBandId) || Math.floor(musicBandId) <= 0) {
            setErrorMessage("Значение id музыкальной группы должно быть более 0");
            return false;
        }
        return true;
    }, [musicBandId, musicGenre]);

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                const params: ParamsForCreateNomination = {
                    musicBandId: Math.floor(musicBandId),
                    musicGenre: musicGenre,
                };
                await createNomination(params);
                setSuccessMessage("Музыкальная группа успешно номинирована");
                setErrorMessage("");
                setTimeout(() => globalThis.location.reload(), 2000);
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Ошибка при номинировании");
            } finally { setLoading(false); }
        },
        [musicBandId, musicGenre, validate]
    );

    const handleSelectMusicBand = (newMusicBandId: number, newMusicBandName: string): void => {
        setMusicBandId(newMusicBandId);
        setMusicBandName(newMusicBandName);
    };

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2>Номинация музыкальной группы</h2>
                <select
                    name="music_genre"
                    value={musicGenre as string}
                    onChange={(e) => setMusicGenre(e.target.value as MusicGenre)}>
                    {Object.values(MusicGenre).map((s) => (
                        <option key={s} value={s}>
                            { MusicGenreDictionary[s] }
                        </option>
                    ))}
                </select>
                <h3>Выбранная муз. группа: { (musicBandId === 0)? "" : `${musicBandId} - ${musicBandName}`}</h3>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Номинирование..." : "Номинировать"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={styles.success}>{successMessage}</div>}
                </div>
            </form>
            <MusicBandSelect onSelectMusicBand={handleSelectMusicBand} />
        </div>
    );
}
