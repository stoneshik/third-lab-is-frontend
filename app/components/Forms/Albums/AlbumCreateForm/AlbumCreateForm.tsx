import clsx from "clsx";
import { useCallback, useState, type JSX } from "react";
import { createAlbum, type ParamsForCreateAlbum } from "~/api/Albums/CreateAlbum";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./AlbumCreateForm.module.scss";

export function AlbumCreateForm(): JSX.Element {
    const [name, setName] = useState<string>("");
    const [length, setLength] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const validate = useCallback(() => {
        if (!name || name.trim().length === 0) {
            setErrorMessage("Название альбома обязательно");
            return false;
        }
        if (!Number.isFinite(length) || Math.floor(length) <= 0) {
            setErrorMessage("Длина альбома должна быть положительным целым числом");
            return false;
        }
        return true;
    }, [name, length]);

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                const params: ParamsForCreateAlbum = {
                    name: name.trim(),
                    length: Math.floor(length),
                };
                await createAlbum(params);
                setSuccessMessage("Альбом успешно добавлен");
                setErrorMessage("");
                setTimeout(() => globalThis.location.reload(), 2000);
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Ошибка при создании");
            } finally { setLoading(false); }
        },
        [name, length, validate]
    );
    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Добавить альбом</h2>
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
                    <label className={styles.label} htmlFor="album-length">Длина (секунд)</label>
                    <input
                        id="album-length"
                        className={styles.input}
                        type="number"
                        value={Number.isFinite(length) ? length : ""}
                        onChange={(e) => setLength(Number(e.target.value))}
                        disabled={loading}
                        min={1}
                        step={1}
                        required />
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Добавление..." : "Добавить"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={clsx(styles.error)} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={clsx(styles.success)}>{successMessage}</div>}
                </div>
            </form>
        </div>
    );
}
