import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faPinterest, faTelegram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
import styles from "./Footer.module.css";
import logoFooter from "../../assets/logotipo/nutridayly-sq.svg";
import { NavLink} from "react-router-dom";

export default function Footer() {
    return (
        <footer>

            <div className={styles.logoFooter}  >
                <img src={logoFooter}  alt="Logo NUtriDayly" />
            </div>

            <div className={styles.socialIconsDiv}>
                <h4>Follow us [♥]</h4>
                <div>
                    <a href="https://www.instagram.com/" target="_blank"><FontAwesomeIcon className={`${styles.socialIcon} ${styles.socialIconFirst}`} icon={faInstagram} /></a>
                    <a href="https://es.pinterest.com/" target="_blank"><FontAwesomeIcon className={styles.socialIcon} icon={faPinterest} /></a>
                    <a href="https://www.youtube.com/" target="_blank"><FontAwesomeIcon className={styles.socialIcon} icon={faYoutube} /></a>
                    <a href="https://telegram.org/" target="_blank"><FontAwesomeIcon className={styles.socialIcon} icon={faTelegram} /></a>
                    <a href="https://www.whatsapp.com" target="_blank"><FontAwesomeIcon className={styles.socialIcon} icon={faWhatsapp} /></a>
                </div>


            </div>
            <div className={styles.legalInfo}>
                <div className={styles.infoWebPage}>
                    <ul>
                        <li><NavLink to="/">Contact Us</NavLink></li>
                        <li><NavLink to="/">Accessibility Statement</NavLink></li>
                        <li><NavLink to="/">Legal Notice</NavLink></li>
                        <li><NavLink to="/">Privacy Policy</NavLink></li>
                        <li><NavLink to="/">Cookie Policy</NavLink></li>
                    </ul>
                </div>
                <div className={styles.signWeb}>© 2026 Nutridayly, Daniel-Kripta</div>
            </div>
        </footer>
    );
}