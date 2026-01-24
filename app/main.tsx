import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App, { ErrorBoundary } from "./root";

import HomePage from "./pages/Home/HomePage";

import MusicBandByIdPage from "./pages/MusicBands/MusicBandPage/MusicBandPage";
import MusicBandsListPage from "./pages/MusicBands/MusicBandsPage/MusicBandsPage";

import CoordinateByIdPage from "./pages/Coordinates/CoordinatesByIdPage/CoordinatesByIdPage";
import CoordinatesListPage from "./pages/Coordinates/CoordinatesListPage/CoordinatesListPage";

import AlbumByIdPage from "./pages/Albums/AlbumByIdPage/AlbumByIdPage";
import AlbumsListPage from "./pages/Albums/AlbumsListPage/AlbumsListPage";

import StudioByIdPage from "./pages/Studios/StudioByIdPage/StudioByIdPage";
import StudiosListPage from "./pages/Studios/StudiosListPage/StudiosListPage";

import NominationByIdPage from "./pages/Nominations/NominationByIdPage/NominationByIdPage";
import NominationsListPage from "./pages/Nominations/NominationsListPage/NominationsListPage";

import "~/styles/globals.scss";
import InsertionPage from "./pages/Insertion/InsertionPage";
import LoginPage from "./pages/Users/LoginPage/LoginPage";
import LogoutPage from "./pages/Users/LogoutPage/LogoutPage";
import RegisterPage from "./pages/Users/RegisterPage/RegisterPage";

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} errorElement={<ErrorBoundary />}>
                <Route index element={<HomePage />} />

                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="logout" element={<LogoutPage />} />

                <Route path="music-bands" element={<MusicBandsListPage />} />
                <Route path="music-bands/:id" element={<MusicBandByIdPage />} />

                <Route path="insertion" element={<InsertionPage />} />

                <Route path="coordinates" element={<CoordinatesListPage />} />
                <Route path="coordinates/:id" element={<CoordinateByIdPage />} />

                <Route path="albums" element={<AlbumsListPage />} />
                <Route path="albums/:id" element={<AlbumByIdPage />} />

                <Route path="studios" element={<StudiosListPage />} />
                <Route path="studios/:id" element={<StudioByIdPage />} />

                <Route path="nominations" element={<NominationsListPage />} />
                <Route path="nominations/:id" element={<NominationByIdPage />} />
            </Route>
        </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

