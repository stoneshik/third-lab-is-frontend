import { useState, type JSX } from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";

export function Header(): JSX.Element {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen((v) => !v);
    const closeMenu = () => setOpen(false);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? "header__link header__link--active" : "header__link";

    return (
        <header className="header">
            <div className="header__inner container">
                <div className="header__brand">
                    <NavLink to="/" className="header__logo" onClick={closeMenu} end>
                        Информационные системы
                    </NavLink>
                    <div className="header__subtitle">Стрельбицкий Илья P3413</div>
                </div>

                <button
                    className={`header__burger ${open ? "header__burger--open" : ""}`}
                    aria-expanded={open}
                    aria-label={open ? "Закрыть меню" : "Открыть меню"}
                    onClick={toggleMenu}>
                    <span className="header__burger-box">
                        <span className="header__burger-inner" />
                    </span>
                </button>

                <nav className={`header__nav ${open ? "header__nav--open" : ""}`}>
                    <NavLink to="/" className={linkClass} onClick={closeMenu} end>
                        Главная
                    </NavLink>
                    <NavLink to="/music-bands" className={linkClass} onClick={closeMenu} id="music-bands-nav">
                        Муз. группы
                    </NavLink>
                    <NavLink to="/insertion" className={linkClass} onClick={closeMenu}>
                        Импорт
                    </NavLink>
                    <NavLink to="/coordinates" className={linkClass} onClick={closeMenu}>
                        Координаты
                    </NavLink>
                    <NavLink to="/albums" className={linkClass} onClick={closeMenu}>
                        Альбомы
                    </NavLink>
                    <NavLink to="/studios" className={linkClass} onClick={closeMenu}>
                        Студии
                    </NavLink>
                    <NavLink to="/nominations" className={linkClass} onClick={closeMenu}>
                        Номинации
                    </NavLink>
                    <NavLink to="/logout" className={linkClass} onClick={closeMenu}>
                        Выйти
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
