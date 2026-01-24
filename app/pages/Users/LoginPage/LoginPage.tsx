import { type JSX } from "react";

import { LoginForm } from "~/components/Forms/Users/LoginForm/LoginForm";
import { HeaderWithoutAuth } from "~/components/HeaderWithoutAuth/HeaderWithoutAuth";
import styles from "./LoginPage.module.scss";

export default function LoginPage(): JSX.Element {
    return (
        <>
        <HeaderWithoutAuth />
        <div className={styles.wrapper}>
            <LoginForm />
        </div>
        </>
    );
}
