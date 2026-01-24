import { useCallback, useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import { deleteCoordinates } from "~/api/Coordinates/DeleteCoordinates";
import { getCoordinatesById, type ParamsForGetCoordinatesId } from "~/api/Coordinates/GetCoordinatesById";
import { CoordinatesEditForm } from "~/components/Forms/Coordinates/CoordinatesEditForm/CoordinatesEditForm";
import { Header } from "~/components/Header/Header";
import { CoordinatesTable } from "~/components/Tables/Coordinates/CoordinatesTable/CoordinatesTable";
import { Button } from "~/components/UI/Button/Button";
import type { Coordinates } from "~/types/coordinates/Coordinates";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./CoordinatesByIdPage.module.scss";
import { tokenService } from "~/services/tokenService";

export default function CoordinatesByIdPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const load = useCallback(
        async (params: ParamsForGetCoordinatesId) => {
            try {
                const data = await getCoordinatesById(params);
                setCoordinates(data);
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
            const coordinatesId: number = (id === undefined)? 0 : +id;
            try {
                await load({ id: coordinatesId });
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
        const coordinatesId: number = (id === undefined)? 0 : +id;
        try {
            await deleteCoordinates({id: coordinatesId});
            setSuccessMessage("Координаты успешно удалены");
            setErrorMessage("");
            setTimeout(() => globalThis.location.assign('/coordinates'), 2000);
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
            <h1>Координаты муз. групп</h1>
            <div className={styles.error}>{errorMessage}</div>
            {!coordinates && <div className={styles.error}>Координаты не найдены</div>}
            {coordinates && <CoordinatesTable coordinates={[coordinates]} />}
            {coordinates && <CoordinatesEditForm coordinates={coordinates} />}
            {coordinates &&
                <Button className={styles.delete} onClick={handlingDelete} textButton={"❌ Удаление координат"} /> }
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
        </>
    );
}
