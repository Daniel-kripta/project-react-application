import { useState, useMemo } from "react";
import { useFoodSearch } from "../../hooks/useFoodSearch";
import { useFoodContext } from "../../context/FoodContext";

import styles from "./SearchPage.module.css";
import SaveButton from "../../components/SaveButton/SaveButton";
import FoodCard from "../../components/FoodCard/FoodCard";

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [onlyFoundation, setOnlyFoundation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [activeNutrients, setActiveNutrients] = useState([]);
  const [currentNutrient, setCurrentNutrient] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const itemsPerPage = 8;

  const { searchResults, searchLoading, searchError } = useFoodContext();
  const { searchFood } = useFoodSearch();

  // Categorías únicas extraídas de los resultados para el filtro de categoría
  const categories = useMemo(() => {
    const cats = searchResults.map((f) => f.foodCategory).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [searchResults]);

  // Lista de nutrientes disponibles para añadir como filtro
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
      setCurrentPage(1);
    }
  };

  const removeNutrientFilter = (name) => {
    setActiveNutrients(activeNutrients.filter((n) => n !== name));
    setCurrentPage(1);
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

  // Paginación: se calcula qué slice de resultados mostrar según la página actual
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return filteredResults.slice(firstIndex, lastIndex);
  }, [filteredResults, currentPage]);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setHasSearched(true);
      setCurrentPage(1);

      searchFood(inputValue, onlyFoundation);
    }
  };

  return (
    <main>
      <h1>Search Food</h1>

      <div className={styles.searchControls}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search..."
        />

        <button onClick={handleSearch}>Search</button>
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
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
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

      {searchLoading && (
        <div className={styles["results-container"]}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonImg}></div>
              <div className={styles.skeletonContent}>
                <div className={`${styles.skeletonText} ${styles.title}`}></div>
                <div className={`${styles.skeletonText} ${styles.bar}`}></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {searchError && <p>{searchError}</p>}

      {!searchLoading &&
        !searchError &&
        hasSearched &&
        searchResults.length === 0 && (
          <p className={styles.noResultsMsg}>
            No results found. Try a different search term.
          </p>
        )}

      {!searchLoading &&
        !searchError &&
        searchResults.length > 0 &&
        filteredResults.length === 0 && (
          <p className={styles.noResultsMsg}>
            No items match the selected filters.
          </p>
        )}

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
            actionButton={<SaveButton food={food} />}
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
