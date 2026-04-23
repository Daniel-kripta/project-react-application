import { NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logoHeader from "../../assets/logotipo/nutridayly.svg";
import searchIcon from "../../assets/icons/search_icon.svg";
import savedIcon from "../../assets/icons/saved_icon.svg";
import calculatorIcon from "../../assets/icons/calculate_icon.svg";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isSticky, setIsSticky] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    useEffect(() => {

        if (!isHomePage) return;

        const handleScroll = () => {

            setIsSticky(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll);
        

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHomePage]); 

    const showLogo = !isHomePage || isSticky;

    return (
        <div className={styles.header}>
            <div className={`${styles.logoHeader} ${showLogo ? styles.visible : styles.hidden}`}>
                <NavLink to="/">
                    <img src={logoHeader} alt="Logo NutriDayly" />
                </NavLink>
            </div>
            <nav className={styles.nav}>
                <ul className={styles.navlist}>
                    <li><NavLink to="/search"><img src={searchIcon} alt="Search" /><span className={showLogo ? styles.textHidden : styles.textVisible}> Search</span></NavLink></li>
                    <li><NavLink to="/savedfood"> <img src={savedIcon} alt="Saved" /><span className={showLogo ? styles.textHidden : styles.textVisible}> Saved</span></NavLink></li>
                    <li><NavLink to="/nutricalc"> <img src={calculatorIcon} alt="Calc" /><span className={showLogo ? styles.textHidden : styles.textVisible}> N-Calc</span></NavLink></li>
                </ul>
            </nav>
        </div>
    );
}