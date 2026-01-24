import { useCallback, useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import { deleteNomination } from "~/api/Nominations/DeleteNomination";
import { getNominationById, type ParamsForGetNominationId } from "~/api/Nominations/GetNominationById";
import { Header } from "~/components/Header/Header";
import { NominationTable } from "~/components/Tables/Nomination/NominationTable/NominationTable";
import { Button } from "~/components/UI/Button/Button";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { Nomination } from "~/types/nomination/Nomination";
import styles from "./NominationByIdPage.module.scss";
import { tokenService } from "~/services/tokenService";

export default function NominationByIdPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [nomination, setNomination] = useState<Nomination | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const load = useCallback(
        async (params: ParamsForGetNominationId) => {
            try {
                const data = await getNominationById(params);
                setNomination(data);
                setErrorMessage("");
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
            const nominationId: number = (id === undefined)? 0 : +id;
            try {
                await load({ id: nominationId });
            } catch {
                setErrorMessage("Не получилось загрузить данные");
            }
        };
        fetchData();
        intervalId = setInterval(fetchData, 10_000);
        return () => {
            mounted = false;
            clearInterval(intervalId);
        };
    }, [id, load]);

    const handlingDelete = async () => {
        const nominationId: number = (id === undefined)? 0 : +id;
        try {
            await deleteNomination({id: nominationId});
            setSuccessMessage("Номинация успешно удалена");
            setErrorMessage("");
            setTimeout(() => globalThis.location.assign('/nominations'), 2000);
        } catch (error) {
            if (isErrorMessage(error)) {
                const message = createMessageStringFromErrorMessage(error);
                setErrorMessage(message);
                return;
            }
        }
    };

    return (
        <>
        <Header />
        <div className={styles.wrapper}>
            <h1>Номинация муз. группы</h1>
            <div className={styles.error}>{errorMessage}</div>
            {!nomination && <div className={styles.error}>Номинация не найдена</div>}
            {nomination && <NominationTable nominations={[nomination]} />}
            {nomination &&
                <Button className={styles.delete} onClick={handlingDelete} textButton={"❌ Удаление номинации"} /> }
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
        </>
    );
}
