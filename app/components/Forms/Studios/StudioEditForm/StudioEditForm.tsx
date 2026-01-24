import { useCallback, useEffect, useState, type JSX } from "react";
import { updateStudio, type ParamsForUpdateStudio } from "~/api/Studios/UpdateStudio";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { Studio } from "~/types/studio/Studio";
import styles from "./StudioEditForm.module.scss";

type Props = { studio: Studio; };

export function StudioEditForm({ studio }: Readonly<Props>): JSX.Element {
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    useEffect(() => {
        if (studio) {
            setName(studio.name);
            setAddress(studio.address);
            setErrorMessage("");
            setSuccessMessage("");
        }
    }, [studio]);

    const validate = useCallback(() => {
        return true;
    }, [name, address]);

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                const params: ParamsForUpdateStudio = {
                    id: studio.id,
                    name: name.trim(),
                    address: address.trim(),
                };
                await updateStudio(params);
                setSuccessMessage("Студия успешно обновлена");
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
        [studio, name, address, validate]
    );
    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Обновить студию</h2>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="album-name">Название</label>
                    <input
                        id="album-name"
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        maxLength={50}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="album-address">Адрес</label>
                    <input
                        id="album-address"
                        className={styles.input}
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={loading}
                        maxLength={50}
                        required />
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Обновление..." : "Обновить"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={styles.success}>{successMessage}</div>}
                </div>
            </form>
        </div>
    );
}
