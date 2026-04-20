import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css"



export default function Navbar() {
  return (

    <nav className={styles.nav}>
        <ul className={styles.navlist}>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/search">Search Food</NavLink></li>
            <li><NavLink to="/savedfood">Saved Food</NavLink></li>
        </ul>
    </nav>
    )
}