import { useCallback, useEffect, useState, type JSX } from "react";

import { logoutUser } from "~/api/Users/LogoutUser";
import { HeaderWithoutAuth } from "~/components/HeaderWithoutAuth/HeaderWithoutAuth";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./LogoutPage.module.scss";
import { tokenService } from "~/services/tokenService";

export default function LogoutPage(): JSX.Element {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const load = useCallback(
        async () => {
            try {
                await logoutUser();
                setSuccessMessage("Выход успешен");
                setErrorMessage("");
                setTimeout(() => globalThis.location.assign("/login"), 100);
            } catch (error) {
                if (isErrorMessage(error)) {
                    const message = createMessageStringFromErrorMessage(error);
                    setErrorMessage(message);
                    return;
                }
            }
        }, []
    );

    useEffect(() => {
        if (tokenService.isEmpty()) {
            globalThis.location.assign("/login");
        }
        let mounted = true;
        let intervalId: NodeJS.Timeout;
        const fetchData = async () => {
            if (!mounted) return;
            try {
                await load();
            } catch {
                setErrorMessage("Не получилось выйти");
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 10_000);
        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, []);
    return (
        <>
        <HeaderWithoutAuth />
        <div className={styles.wrapper}>
            <h1>Выполняется выход из аккаунта</h1>
            <div className={styles.error}>{errorMessage}</div>
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
        </>
    );
}
