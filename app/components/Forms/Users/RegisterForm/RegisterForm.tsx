import clsx from "clsx";
import { useCallback, useState, type JSX } from "react";
import { registerUser, type ParamsForRegisterUser } from "~/api/Users/RegisterUser";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./RegisterForm.module.scss";

export function RegisterForm(): JSX.Element {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const validate = useCallback(() => {
        if (!login || login.trim().length === 0) {
            setErrorMessage("Логин обязателен");
            return false;
        }
        if (!password || password.trim().length === 0) {
            setErrorMessage("Пароль обязателен");
            return false;
        }
        if (login.trim().length < 4 || login.trim().length > 20) {
            setErrorMessage("Логин должен быть длиннее 4 и короче 20 символов");
            return false;
        }
        if (password.trim().length < 4 || password.trim().length > 30) {
            setErrorMessage("Пароль должен быть длиннее 4 и короче 30 символов");
            return false;
        }
        const LOGIN_REGEX = /^\w{4,20}$/;
        const PASSWORD_REGEX = /^\w{4,30}$/;
        if (!LOGIN_REGEX.test(login)) {
            setErrorMessage("Логин может состоять только из латинских символов, цифр и символов нижнего подчеркивания");
            return false;
        }
        if (!PASSWORD_REGEX.test(password)) {
            setErrorMessage("Пароль может состоять только из латинских символов, цифр и символов нижнего подчеркивания");
            return false;
        }
        return true;
    }, [login, password]);

    const handleSubmit = useCallback(
        async () => {
            setErrorMessage("");
            setSuccessMessage("");
            if (!validate()) { return; }
            setLoading(true);
            try {
                const params: ParamsForRegisterUser = {
                    login: login.trim(),
                    role: null,
                    password: password.trim(),
                };
                await registerUser(params);
                setSuccessMessage("Успешная регистрация");
                setErrorMessage("");
                setTimeout(() => globalThis.location.assign("/login"), 2000);
            } catch (error) {
                if (import.meta.env.DEV) { console.log(error); }
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
                setErrorMessage("Ошибка при регистрации");
            } finally { setLoading(false); }
        },
        [login, password, validate]
    );
    return (
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={(e) => e?.preventDefault()}>
                <h2 className={styles.title}>Регистрация</h2>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="login">Логин</label>
                    <input
                        id="login"
                        className={styles.input}
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        disabled={loading}
                        minLength={4}
                        maxLength={20}
                        required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        className={styles.input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        minLength={4}
                        maxLength={30}
                        required />
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleSubmit} textButton={loading ? "Регистрация..." : "Зарегистрироваться"} disabled={loading} />
                </div>
                <div className={styles.feedback}>
                    {errorMessage && <div className={clsx(styles.error)} role="alert">{errorMessage}</div>}
                    {successMessage && <div className={clsx(styles.success)}>{successMessage}</div>}
                </div>
            </form>
        </div>
    );
}
