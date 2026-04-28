import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useFoodSearch } from "../../hooks/useFoodSearch";
import { useFoodContext } from "../../context/FoodContext";
import DailyFoods from "../../components/DailyFood/DailyFood";
import styles from "./HomePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faMagnifyingGlass,
  faBowlFood,
  faShare,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBluesky,
  faFacebook,
  faInstagram,
  faNutritionix,
  faTiktok,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import FoodResumeBar from "../../components/FoodResumeBar/FoodResumeBar";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { searchFood } = useFoodSearch();
  const { selectedDailyFood } = useFoodContext();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    searchFood(query);
    navigate("/search");
  };

  return (
    <main>
      <section className={styles.aboutSection}>
        <header className={styles.aboutHeader}>
          <h2>Explore Your Nutrition</h2>
          <p>
            Welcome to your interactive food guide, where scientific data meets
            ease of use. Our platform utilizes the official USDA database to
            provide accurate and up-to-date nutritional information on thousands
            of ingredients.
          </p>
        </header>

        <div className={styles.featuresContainer}>
          <article className={styles.featureCard}>
            <div className={styles.aboutIcon}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <div>
              <h3>Smart Search</h3>
              <p>
                Quickly locate any food and get a detailed breakdown of its
                nutrients using our advanced search engine.
              </p>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search food..."
                />
                <button type="submit">Search</button>
              </form>
            </div>
          </article>

          <article className={styles.featureCard}>
            <div>
              <h3>Daily Featured Foods</h3>
              <p>
                Stay updated with our daily selection of foundation foods,
                curated to showcase complete nutritional profiles. You can share
                your better dishes!
              </p>
            </div>
            <div className={styles.aboutIcon}>
              <FontAwesomeIcon icon={faCalendarDay} />
            </div>
          </article>

          <article className={styles.featureCard}>
            <div className={styles.aboutIcon}>
              <FontAwesomeIcon icon={faNutritionix} />
            </div>
            <div>
              <h3>Nutritional Calculator</h3>
              <p>
                Ready to cook? Go to our Calculator section to select
                ingredients, build your custom dishes, and compare them with
                medical recommendations.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.dailyFood}>
        <h2>Here are our 5 ingredients for today!</h2>
        <div className={styles.dailyFoodCards}>
          <div className={`${styles.mainDisplayDaily} ${styles.dailyCard}`}>
            {selectedDailyFood ? (
              <article className={styles.featuredCard}>
                <img
                  src={selectedDailyFood.image}
                  alt={selectedDailyFood.name}
                />
                <h2 className={styles.truncateName}>
                  {selectedDailyFood.name}
                </h2>

                <FoodResumeBar food={selectedDailyFood} />

                <NavLink to={`/food/${selectedDailyFood.id}`}>
                  <div className={styles.linkDetailHP}>
                    View Full Nutritional Information
                  </div>
                </NavLink>
              </article>
            ) : (
              <p>Loading featured content...</p>
            )}
          </div>
          <div className={`${styles.otherDisplayDaily} ${styles.dailyCard}`}>
            <DailyFoods />
          </div>
        </div>
        <div className={styles.shareSocialDish}>
          <span style={{ fontWeight: `bold` }}>
            Can you mix them up to create a fantastic dish?
          </span>
          <span>Share it with us on socials!</span>
          <div>
            <span
              style={{
                backgroundColor: `var(--light-green)`,
                padding: `5px`,
                borderRadius: `10px`,
              }}
            >
              <FontAwesomeIcon icon={faBowlFood} />
              <FontAwesomeIcon icon={faHeart} />
              <FontAwesomeIcon icon={faShare} />
            </span>
            <span style={{ fontWeight: `bold`, fontSize: `1.3em` }}> | </span>
            <span
              style={{
                backgroundColor: `var(--light-green)`,
                padding: `5px`,
                borderRadius: `10px`,
              }}
            >
              <FontAwesomeIcon icon={faTwitter} />
              <FontAwesomeIcon icon={faBluesky} />
              <FontAwesomeIcon icon={faTiktok} />
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faInstagram} />
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
