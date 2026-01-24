import { type JSX } from "react";

import { RegisterForm } from "~/components/Forms/Users/RegisterForm/RegisterForm";
import { HeaderWithoutAuth } from "~/components/HeaderWithoutAuth/HeaderWithoutAuth";
import styles from "./RegisterPage.module.scss";

export default function RegisterPage(): JSX.Element {
    return (
        <>
        <HeaderWithoutAuth />
        <div className={styles.wrapper}>
            <RegisterForm />
        </div>
        </>
    );
}
