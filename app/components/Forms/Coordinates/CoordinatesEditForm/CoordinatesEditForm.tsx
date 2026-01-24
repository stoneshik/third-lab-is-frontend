import { useCallback, useEffect, useState, type JSX } from "react";
import { updateCoordinates, type ParamsForUpdateCoordinates } from "~/api/Coordinates/UpdateCoordinates";
import { Button } from "~/components/UI/Button/Button";
import type { Coordinates } from "~/types/coordinates/Coordinates";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./CoordinatesEditForm.module.scss";

type Props = { coordinates: Coordinates; };

export function CoordinatesEditForm({ coordinates }: Readonly<Props>): JSX.Element {
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    useEffect(() => {
        if (coordinates) {
            setX(coordinates.x);
            setY(coordinates.y);
            setErrorMessage("");
            setSuccessMessage("");
        }
    }, [coordinates]);

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
                const params: ParamsForUpdateCoordinates = {
                    id: coordinates.id,
                    x: x,
                    y: Math.floor(y),
                };
                await updateCoordinates(params);
                setSuccessMessage("Координаты успешно обновлены");
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
        [coordinates, x, y, validate]
    );

    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Обновить координаты</h2>
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
