import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSavedFood } from "../../context/SavedFoodContext";
import { useDish } from "../../context/DishContext";
import FoodResumeBar from "../../components/FoodResumeBar/FoodResumeBar";
import styles from "./SavedFoodPage.module.css";
import defaultDishImg from "../../assets/images/defaultDishes.png";
import FoodCard from "../../components/FoodCard/FoodCard";

const TOP_PRIORITY = [
  "Energy",
  "Protein",
  "Carbohydrate, by difference",
  "Total lipid (fat)",
  "Water",
];

const GROUPS = {
  "Carbohydrates & Sugars": [
    "Fiber, total dietary",
    "Total Sugars",
    "Sugars, total including NLEA",
    "Added Sugars",
    "Sucrose",
    "Glucose (dextrose)",
    "Fructose",
    "Lactose",
    "Maltose",
    "Galactose",
    "Starch",
  ],
  "Proteins & Amino Acids": [
    "Tryptophan",
    "Threonine",
    "Isoleucine",
    "Leucine",
    "Lysine",
    "Methionine",
    "Cystine",
    "Phenylalanine",
    "Tyrosine",
    "Valine",
    "Arginine",
    "Histidine",
    "Alanine",
    "Aspartic acid",
    "Glutamic acid",
    "Glycine",
    "Proline",
    "Serine",
  ],
  "Fats & Lipids": [
    "Saturated Fat",
    "Monounsaturated Fat",
    "Polyunsaturated Fat",
    "Cholesterol",
    "Fatty acids, total saturated",
    "Fatty acids, total monounsaturated",
    "Fatty acids, total polyunsaturated",
    "SFA 12:0",
    "SFA 14:0",
    "SFA 16:0",
    "SFA 18:0",
    "MUFA 16:1",
    "MUFA 18:1",
    "PUFA 18:2",
    "PUFA 18:3",
    "Phytosterols",
  ],
  Minerals: [
    "Calcium (Ca)",
    "Calcium, Ca",
    "Iron (Fe)",
    "Iron, Fe",
    "Magnesium (Mg)",
    "Magnesium, Mg",
    "Phosphorus (P)",
    "Phosphorus, P",
    "Potassium (K)",
    "Potassium, K",
    "Sodium (Na)",
    "Sodium, Na",
    "Zinc (Zn)",
    "Zinc, Zn",
    "Copper (Cu)",
    "Copper, Cu",
    "Manganese (Mn)",
    "Manganese, Mn",
    "Selenium (Se)",
    "Selenium, Se",
  ],
  "Vitamins & Phytochemicals": [
    "Vitamin C",
    "Vitamin C, total ascorbic acid",
    "Thiamin (B1)",
    "Thiamin",
    "Riboflavin (B2)",
    "Riboflavin",
    "Niacin (B3)",
    "Niacin",
    "Pantothenic acid (B5)",
    "Pantothenic acid",
    "Vitamin B-6",
    "Vitamin B-12",
    "Folate",
    "Folate, DFE",
    "Folate, total",
    "Folate, food",
    "Folic acid",
    "Vitamin A",
    "Vitamin A, IU",
    "Vitamin A, RAE",
    "Retinol",
    "Carotene, beta",
    "Carotene, alpha",
    "Lutein + zeaxanthin",
    "Lycopene",
    "Vitamin E (alpha-tocopherol)",
    "Vitamin E",
    "Vitamin D (D2 + D3)",
    "Vitamin D (D2 + D3), International Units",
    "Vitamin D",
    "Vitamin K (phylloquinone)",
    "Vitamin K",
    "Choline, total",
  ],
};

function DishCard({ dish, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasFilters = dish.activeFilters && dish.activeFilters.length > 0;
  const totalMass = dish.ingredients.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0),
    0,
  );

  const renderNutrientList = (nutrients, sortByAlpha = true) => {
    const listToRender = sortByAlpha
      ? [...nutrients].sort((a, b) => a.name.localeCompare(b.name))
      : nutrients;

    return (
      <div className={styles.nutrientList}>
        {listToRender.map((n) => (
          <div key={n.name} className={styles.nutrientItem}>
            <span>{n.name}: </span>
            <span className={styles.nutrientValue}>
              {Number(n.value).toFixed(1)} {n.unit}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const topNutrients = TOP_PRIORITY.map((name) =>
    dish.fullNutrients.find((n) => n.name === name),
  ).filter(Boolean);

  return (
    <div className={`${styles.dishCard} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.dishInfo}>
        <div className={styles.dishImageWrapper}>
          <img
            src={dish.image}
            alt={dish.name}
            onError={(e) => {
              e.target.src = defaultDishImg;
            }}
          />
        </div>

        <div className={styles.dishHeader}>
          <h3>{dish.name}</h3>

          <div className={styles.dishIngredientsBox}>
            <strong>Ingredients:</strong>
            <ul>
              {dish.ingredients.map((ing) => (
                <li key={ing.fdcId}>
                  {ing.description} ({ing.quantity}g)
                </li>
              ))}
            </ul>
          </div>

          <button
            className={styles.btnDelete}
            onClick={() => onDelete(dish.id)}
          >
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className={styles.contentArea}>
        {hasFilters ? (
          <div className={styles.filteredView}>
            <h4>Selected Nutrients (per 100g)</h4>
            {renderNutrientList(
              dish.fullNutrients.filter((n) =>
                dish.activeFilters.includes(n.name),
              ),
              true,
            )}
          </div>
        ) : (
          <div className={styles.groupedView}>
            <div className={styles.categorySection}>
              <h4>General Information (per 100g)</h4>
              {renderNutrientList(topNutrients, false)}
            </div>

            {isExpanded && (
              <div className={styles.expandedContent}>
                {Object.entries(GROUPS).map(([groupName, nutrientNames]) => {
                  const filtered = dish.fullNutrients.filter((n) =>
                    nutrientNames.includes(n.name),
                  );
                  if (filtered.length === 0) return null;

                  return (
                    <div key={groupName} className={styles.categorySection}>
                      <h4>{groupName}</h4>
                      {renderNutrientList(filtered, true)}
                    </div>
                  );
                })}

                <div className={styles.categorySection}>
                  <h4>Others</h4>
                  {renderNutrientList(
                    dish.fullNutrients.filter(
                      (n) =>
                        !TOP_PRIORITY.includes(n.name) &&
                        !Object.values(GROUPS).flat().includes(n.name),
                    ),
                    true,
                  )}
                </div>
              </div>
            )}

            <button
              className={styles.showMoreBtn}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : "Show All Details"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SavedFoodPage() {
  const { savedFoods, removeFromSaved } = useSavedFood();
  const { savedDishes, deleteDish } = useDish();

  const isCompletelyEmpty = savedFoods.length === 0 && savedDishes.length === 0;

  return (
    <main className={styles.savedPage}>
      <h1>Saved Food</h1>

      {isCompletelyEmpty ? (
        <section className={styles.globalEmptyState}>
          <h2>Your pantry is completely empty!</h2>
          <p>
            You haven't saved any ingredients or created any custom dishes yet.
          </p>
          <div className={styles.emptyStateActions}>
            <NavLink to="/search" className={styles.btnLinkEmpty}>
              Go find ingredients
            </NavLink>
          </div>
        </section>
      ) : (
        <>
          <section className={styles.infoPanel}>
            <span>Resume:</span>
            <div className={styles.statCard}>
              <h3>Saved Ingredients</h3>
              <p>{savedFoods.length}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Custom Dishes</h3>
              <p>{savedDishes.length}</p>
            </div>
          </section>

          <section className={styles.dishesSection}>
            <h2>My Custom Dishes</h2>
            {savedDishes.length > 0 ? (
              <div className={styles.dishesGrid}>
                {savedDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} onDelete={deleteDish} />
                ))}
              </div>
            ) : (
              <div className={styles.partialEmptyState}>
                <p>
                  No dishes saved yet. Mix your ingredients in the calculator!
                </p>
                <NavLink to="/nutricalc" className={styles.btnLinkEmpty}>
                  Open NutriCalc
                </NavLink>
              </div>
            )}
          </section>

          <section className={styles.foodList}>
            <h2>Raw Ingredients</h2>
            {savedFoods.length > 0 ? (
              <div className={styles.ingredientsGrid}>
                {savedFoods.map((food) => (
                  <FoodCard
                    key={food.fdcId}
                    food={food}
                    extraContent={<div></div>}
                    actionButton={
                      <button
                        className={styles.btnDelete}
                        onClick={() => removeFromSaved(food.fdcId)}
                      >
                        <span>Delete</span>
                      </button>
                    }
                  />
                ))}
              </div>
            ) : (
              <div className={styles.partialEmptyState}>
                <p>No raw ingredients saved.</p>
                <NavLink to="/search" className={styles.btnLinkEmpty}>
                  Search ingredients
                </NavLink>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
