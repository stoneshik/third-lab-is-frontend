import { useCallback, useState, type JSX } from "react";
import { addSingleToBand, type ParamsForAddSingleToBand } from "~/api/MusicBands/AddSingleToBand";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import { MusicBandSelect } from "../../MusicBands/MusicBandSelect/MusicBandSelect";
import styles from "./AddSingleToBandForm.module.scss";

export function AddSingleToBandForm(): JSX.Element {
    const [musicBandId, setMusicBandId] = useState<number>(0);
    const [musicBandName, setMusicBandName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const validate = useCallback(() => {
        if (!Number.isFinite(musicBandId) || Math.floor(musicBandId) <= 0) {
            setErrorMessage("Значение id музыкальной группы должно быть более 0");
            return false;
        }
        return true;
    }, [musicBandId]);

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                const params: ParamsForAddSingleToBand = { id: Math.floor(musicBandId) };
                await addSingleToBand(params);
                setSuccessMessage("Музыкальной группе добавлен сингл");
                setErrorMessage("");
                setTimeout(() => globalThis.location.assign("/"), 2000);
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Ошибка при добавлении сингла муз. группе");
            } finally { setLoading(false); }
        },
        [musicBandId, validate]
    );

    const handleSelectMusicBand = (newMusicBandId: number, newMusicBandName: string): void => {
        setMusicBandId(newMusicBandId);
        setMusicBandName(newMusicBandName);
    };

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2>Добавление муз. группе сингла</h2>
                <h3>Выбранная муз. группа: { (musicBandId === 0)? "" : `${musicBandId} - ${musicBandName}`}</h3>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Добавление сингла..." : "Добавить сингл"} disabled={loading} />
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
