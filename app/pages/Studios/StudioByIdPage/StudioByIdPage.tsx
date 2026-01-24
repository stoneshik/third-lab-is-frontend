import { useCallback, useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import { deleteStudio } from "~/api/Studios/DeleteStudio";
import { getStudioById, type ParamsForGetStudioId } from "~/api/Studios/GetStudioById";
import { StudioEditForm } from "~/components/Forms/Studios/StudioEditForm/StudioEditForm";
import { Header } from "~/components/Header/Header";
import { StudioTable } from "~/components/Tables/Studio/StudioTable/StudioTable";
import { Button } from "~/components/UI/Button/Button";
import { tokenService } from "~/services/tokenService";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import type { Studio } from "~/types/studio/Studio";
import styles from "./StudioByIdPage.module.scss";

export default function StudioByIdPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [studio, setStudio] = useState<Studio | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const load = useCallback(
        async (params: ParamsForGetStudioId) => {
            try {
                const data = await getStudioById(params);
                setStudio(data);
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
            const studioId: number = (id === undefined)? 0 : +id;
            try {
                await load({ id: studioId });
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
        const studioId: number = (id === undefined)? 0 : +id;
        try {
            await deleteStudio({id: studioId});
            setSuccessMessage("Студия успешно удалена");
            setErrorMessage("");
            setTimeout(() => globalThis.location.assign('/studios'), 2000);
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
            <h1>Студия</h1>
            <div className={styles.error}>{errorMessage}</div>
            {!studio && <div className={styles.error}>Студия не найдена</div>}
            {studio && <StudioTable studios={[studio]} />}
            {studio && <StudioEditForm studio={studio} />}
            {studio && <Button className={styles.delete} onClick={handlingDelete} textButton={"❌ Удаление студии"} /> }
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
        </>
    );
}
