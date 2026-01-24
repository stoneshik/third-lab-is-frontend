import { useCallback, useState, type JSX } from "react";
import { createCoordinates, type ParamsForCreateCoordinates } from "~/api/Coordinates/CreateCoordinates";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./CoordinatesCreateForm.module.scss";

export function CoordinatesCreateForm(): JSX.Element {
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const validate = useCallback(() => {
        return true;
    }, [x, y]);

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                const params: ParamsForCreateCoordinates = {
                    x: x,
                    y: Math.floor(y),
                };
                await createCoordinates(params);
                setSuccessMessage("Координаты успешно добавлены");
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
        [x, y, validate]
    );

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Добавление координат</h2>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="coordinates-x">x</label>
                    <input
                        id="coordinates-x"
                        className={styles.input}
                        type="number"
                        value={Number.isFinite(x) ? x : ""}
                        onChange={(e) => setX(Number(e.target.value))}
                        disabled={loading}
                        step={0.01}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="coordinates-y">y</label>
                    <input
                        id="coordinates-y"
                        className={styles.input}
                        type="number"
                        value={Number.isFinite(y) ? y : ""}
                        onChange={(e) => setY(Number(e.target.value))}
                        disabled={loading}
                        step={1}
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
