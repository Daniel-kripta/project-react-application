import { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";

import savedIcon from "../../assets/icons/saved_icon.svg";
import { useFoodSearch } from "../../hooks/useFoodSearch";
import { useFoodContext } from "../../context/FoodContext";
import { useSavedFood } from "../../context/SavedFoodContext";

import styles from "./SearchPage.module.css";

// Importamos la nueva tarjeta reutilizable
import FoodCard from "../../components/FoodCard/FoodCard";

export default function SearchPage() {
  // --- TODA TU LÓGICA Y ESTADOS INTACTOS ---
  const [inputValue, setInputValue] = useState("");
  const [onlyFoundation, setOnlyFoundation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [activeNutrients, setActiveNutrients] = useState([]);
  const [currentNutrient, setCurrentNutrient] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { searchResults, searchLoading, searchError } = useFoodContext();
  const { searchFood } = useFoodSearch();
  const { addToSaved, removeFromSaved, isSaved } = useSavedFood();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults, selectedCategory, activeNutrients]);

  const categories = useMemo(() => {
    const cats = searchResults.map((f) => f.foodCategory).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [searchResults]);

  const availableNutrients = useMemo(() => {
    const allNutrients = searchResults.flatMap((f) =>
      f.foodNutrients.map((n) => n.nutrientName),
    );
    return [...new Set(allNutrients)].sort();
  }, [searchResults]);

  const addNutrientFilter = () => {
    if (currentNutrient && !activeNutrients.includes(currentNutrient)) {
      setActiveNutrients([...activeNutrients, currentNutrient]);
      setSortBy(currentNutrient);
      setCurrentNutrient("");
    }
  };

  const removeNutrientFilter = (name) => {
    setActiveNutrients(activeNutrients.filter((n) => n !== name));
  };

  const filteredResults = useMemo(() => {
    let filtered = [...searchResults];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((f) => f.foodCategory === selectedCategory);
    }

    activeNutrients.forEach((nutrientName) => {
      filtered = filtered.filter((f) =>
        f.foodNutrients.some(
          (n) => n.nutrientName === nutrientName && n.value > 0,
        ),
      );
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        const valA =
          a.foodNutrients.find((n) => n.nutrientName === sortBy)?.value || 0;
        const valB =
          b.foodNutrients.find((n) => n.nutrientName === sortBy)?.value || 0;
        return valB - valA;
      });
    }

    return filtered;
  }, [searchResults, selectedCategory, activeNutrients, sortBy]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return filteredResults.slice(firstIndex, lastIndex);
  }, [filteredResults, currentPage]);

  // --- FIN DE LA LÓGICA, EMPIEZA EL RENDERIZADO ---

  return (
    <main>
      <h1>Search Food</h1>

      <div className={styles.searchControls}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search..."
        />

        <button onClick={() => searchFood(inputValue, onlyFoundation)}>
          Search
        </button>
        <label>
          <div>
            <input
              type="checkbox"
              checked={onlyFoundation}
              onChange={(e) => setOnlyFoundation(e.target.checked)}
            />
          </div>
          <div>Only Foundation ℹ️</div>
        </label>
      </div>

      {searchResults.length > 0 && (
        <div className={styles.filtersSection}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={currentNutrient}
            onChange={(e) => setCurrentNutrient(e.target.value)}
          >
            <option value="">Choose nutrient...</option>
            {availableNutrients.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button onClick={addNutrientFilter}>Add Nutrient</button>

          <div className="active-tags">
            {activeNutrients.map((n) => (
              <span key={n} className="tag">
                {n}{" "}
                <button onClick={() => removeNutrientFilter(n)}>&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {searchLoading && <p>Loading data...</p>}
      {searchError && <p>{searchError}</p>}

      {/* AQUÍ ES DONDE PASA LA MAGIA LIMPIA DE REACT */}
      <div className={styles["results-container"]}>
        {currentItems.map((food) => (
          <FoodCard 
            key={food.fdcId} 
            food={food}
            extraContent={
              <div className={styles.foodTitle}>
                {activeNutrients.map((nutName) => {
                  const nut = food.foodNutrients.find(
                    (n) => n.nutrientName === nutName,
                  );
                  return (
                    <span key={nutName} className={styles.nutrientBadge}>
                      {nutName}: {nut?.value} {nut?.unitName}
                    </span>
                  );
                })}
              </div>
            }
            actionButton={
              <button 
                className={`${styles.btnFav} ${isSaved(food.fdcId) ? styles.active : ""}`}
                onClick={() => isSaved(food.fdcId) ? removeFromSaved(food.fdcId) : addToSaved(food)}
              >
                <img className={styles.niputocaso} src={savedIcon} alt="save" /> 
                <div>{isSaved(food.fdcId) ? "Saved" : "Save"}</div>
              </button>
            }
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}