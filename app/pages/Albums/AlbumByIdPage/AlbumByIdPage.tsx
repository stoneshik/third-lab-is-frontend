import { useCallback, useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";

import { deleteAlbum } from "~/api/Albums/DeleteAlbum";
import { getAlbumById, type ParamsForGetAlbumId } from "~/api/Albums/GetAlbumById";
import { AlbumEditForm } from "~/components/Forms/Albums/AlbumEditForm/AlbumEditForm";
import { Header } from "~/components/Header/Header";
import { AlbumTable } from "~/components/Tables/Album/AlbumTable/AlbumTable";
import { Button } from "~/components/UI/Button/Button";
import { tokenService } from "~/services/tokenService";
import type { Album } from "~/types/album/Album";
import { createMessageStringFromErrorMessage, isErrorMessage } from "~/types/ErrorMessage";
import styles from "./AlbumByIdPage.module.scss";

export default function AlbumByIdPage(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [album, setAlbum] = useState<Album | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const load = useCallback(
        async (params: ParamsForGetAlbumId) => {
            try {
                const data = await getAlbumById(params);
                setAlbum(data);
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
        const fetchData = async () => {
            if (!mounted) return;
            const albumId: number = (id === undefined)? 0 : +id;
            try {
                await load({ id: albumId });
            } catch {
                setErrorMessage("Не получилось загрузить данные");
            }
        };
        fetchData();
        return () => { mounted = false; };
    }, [id, load]);

    const handlingDelete = async () => {
        const albumId: number = (id === undefined)? 0 : +id;
        try {
            await deleteAlbum({id: albumId});
            setSuccessMessage("Альбом успешно удален");
            setErrorMessage("");
            setTimeout(() => globalThis.location.assign('/albums'), 2000);
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
            <h1>Музыкальный альбом</h1>
            <div className={styles.error}>{errorMessage}</div>
            {album && <AlbumTable albums={[album]} />}
            {album && <AlbumEditForm album={album} />}
            <Button
                className={styles.delete}
                onClick={handlingDelete}
                textButton={"❌ Удаление музыкального альбома"} />
            {successMessage && <div className="success">{successMessage}</div>}
        </div>
        </>
    );
}
