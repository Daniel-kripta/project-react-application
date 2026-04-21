import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css"
import logoHeader from "../../assets/logotipo/nutridayly.svg"



export default function Navbar() {
  return (

    <div className={styles.header}>
        <div className={styles.logoHeader}><NavLink to="/"><img src={logoHeader} alt="Logo NutriDayly" /></NavLink></div>
        <nav className={styles.nav}>
            <ul className={styles.navlist}>
                <li><NavLink to="/search">Search Food</NavLink></li>
                <li><NavLink to="/savedfood">Saved Food</NavLink></li>
            </ul>
        </nav>
    </div>
    )
}