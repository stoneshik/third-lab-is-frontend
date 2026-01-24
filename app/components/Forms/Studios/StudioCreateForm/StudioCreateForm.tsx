import { useCallback, useState, type JSX } from "react";
import { createStudio, type ParamsForCreateStudio } from "~/api/Studios/CreateStudio";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./StudioCreateForm.module.scss";

export function StudioCreateForm(): JSX.Element {
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

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
                const params: ParamsForCreateStudio = {
                    name: name.trim(),
                    address: address.trim(),
                };
                await createStudio(params);
                setSuccessMessage("Студия успешно добавлена");
                setErrorMessage("");
                setTimeout(() => globalThis.location.reload(), 2000);
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Ошибка при добавлении");
            } finally { setLoading(false); }
        },
        [name, address, validate]
    );
    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Добавить студию</h2>
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
                    <Button onClick={handleSubmit} textButton={loading ? "Добавление..." : "Добавить"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={styles.error} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={styles.success}>{successMessage}</div>}
                </div>
            </form>
        </div>
    );
}
