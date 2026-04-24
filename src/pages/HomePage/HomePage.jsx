import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useFoodSearch } from "../../hooks/useFoodSearch";
import { useFoodContext } from "../../context/FoodContext";
import DailyFoods from "../../components/DailyFood/DailyFood";
import "./HomePage.css";
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
      <section className="about-section">
        <header className="about-header">
          <h2>Explore Your Nutrition</h2>
          <p>
            Welcome to your interactive food guide, where scientific data meets
            ease of use. Our platform utilizes the official USDA database to
            provide accurate and up-to-date nutritional information on thousands
            of ingredients.
          </p>
        </header>

        <div className="features-container">
          <article className="feature-card">
            <div className="about-icon">
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

          <article className="feature-card">
            <div>
              <h3>Daily Featured Foods</h3>
              <p>
                Stay updated with our daily selection of foundation foods,
                curated to showcase complete nutritional profiles. You can share
                your better dishes!
              </p>
            </div>
            <div className="about-icon">
              <FontAwesomeIcon icon={faCalendarDay} />
            </div>
          </article>

          <article className="feature-card">
            <div className="about-icon">
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

      <section className="daily-food">
        <h2>Here are our 5 ingredients for today!</h2>
        <div className="daily-food-cards">
          <div className="main-display-dayly daily-card">
            {selectedDailyFood ? (
              <article className="featured-card">
                <img
                  src={selectedDailyFood.image}
                  alt={selectedDailyFood.name}
                />

                {/* Nombre truncado */}
                <h2 className="truncate-name">{selectedDailyFood.name}</h2>

                <FoodResumeBar food={selectedDailyFood} />
                
                <NavLink to={`/food/${selectedDailyFood.id}`}>
                  <div className="linkDetailHP">View Full Nutritional Information</div>
                </NavLink>
              </article>
            ) : (
              <p>Loading featured content...</p>
            )}
          </div>
          <div className="other-display-dayly daily-card">
            <DailyFoods />
          </div>
        </div>
        <div className="shareSocialDish">
          <span style={{ fontWeight: `bold` }}>
            Can you mix them up to create a fantástic dish?
          </span>
          <span>Share it with us on socials!</span>
          <div style={{}}>
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
