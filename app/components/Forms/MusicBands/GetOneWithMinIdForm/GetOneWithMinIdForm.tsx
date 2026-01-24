import { useCallback, useState, type JSX } from "react";
import { getOneWithMinId } from "~/api/MusicBands/GetOneWithMinId";
import { MusicBandTable } from "~/components/Tables/MusicBand/MusicBandTable/MusicBandTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { MusicBand } from "~/types/musicBand/MusicBand";
import styles from "./GetOneWithMinIdForm.module.scss";

export function GetOneWithMinIdForm(): JSX.Element {
    const [musicBand, setMusicBand] = useState<MusicBand | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            setLoading(true);
            try {
                const response = await getOneWithMinId();
                setMusicBand(response);
                setSuccessMessage("");
                setErrorMessage("");
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Ошибка при получении муз. группы с минимальным id");
            } finally { setLoading(false); }
        },
        [musicBand]
    );

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2>Получение муз. группы с минимальным id</h2>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Получение..." : "Получить"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={styles.success}>{successMessage}</div>}
                </div>
            </form>
            {musicBand && <MusicBandTable musicBands={[musicBand]}/>}
        </div>
    );
}
