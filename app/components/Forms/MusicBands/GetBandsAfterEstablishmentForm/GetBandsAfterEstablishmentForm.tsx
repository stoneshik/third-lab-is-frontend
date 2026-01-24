import { useCallback, useState, type JSX } from "react";
import { getBandsAfterEstablishment, type ParamsForGetBandsAfterEstablishment } from "~/api/MusicBands/GetBandsAfterEstablishment";
import { MusicBandTable } from "~/components/Tables/MusicBand/MusicBandTable/MusicBandTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { MusicBand } from "~/types/musicBand/MusicBand";
import styles from "./GetBandsAfterEstablishmentForm.module.scss";

export function GetBandsAfterEstablishmentForm(): JSX.Element {
    const [musicBands, setMusicBands] = useState<MusicBand[] | null>(null);
    const [establishmentDate, setEstablishmentDate] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const validate = useCallback(() => {
        if (establishmentDate === "") {
            setErrorMessage("Дата основания обязательна");
            return false;
        }
        return true;
    }, [establishmentDate]);

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                const params: ParamsForGetBandsAfterEstablishment = { date: establishmentDate };
                const response = await getBandsAfterEstablishment(params);
                setMusicBands(response);
                setSuccessMessage("");
                setErrorMessage("");
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Ошибка при получении муз. групп с датой основания позже заданной");
            } finally { setLoading(false); }
        },
        [establishmentDate, validate]
    );

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2>Получение муз. групп c датой основания позже заданной</h2>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="establishment-date">Дата основания</label>
                    <input
                        id="establishment-date"
                        className={styles.input}
                        type="date"
                        value={establishmentDate ?? ""}
                        onChange={(e) => setEstablishmentDate(e.target.value)}
                        disabled={loading}
                        required />
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Получение..." : "Получить"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={styles.success}>{successMessage}</div>}
                </div>
            </form>
            {musicBands && <MusicBandTable musicBands={musicBands}/>}
        </div>
    );
}
