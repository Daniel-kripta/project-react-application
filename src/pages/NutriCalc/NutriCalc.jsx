import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useSavedFood } from "../../context/SavedFoodContext";
import { useDish } from "../../context/DishContext";
import styles from "./NutriCalc.module.css";
import defaultDishImg from "../../assets/images/defaultDishes.png";

export default function NutriCalc() {
  const buildDishId = (name, ingredients) => {
    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const ingredientKey = ingredients
      .map((item) => item.fdcId)
      .sort((a, b) => a - b)
      .join("-");
    return `${safeName || "dish"}-${ingredientKey || "empty"}`;
  };

  const { savedFoods } = useSavedFood();
  const { saveDish } = useDish();


  const [currentDishId, setCurrentDishId] = useState(null);
  const [currentDishIngredients, setCurrentDishIngredients] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [dishName, setDishName] = useState("");
  const [dishImage, setDishImage] = useState("");
  const [activeNutrients, setActiveNutrients] = useState([]);
  const [currentSelect, setCurrentSelect] = useState("");

  const [isDirty, setIsDirty] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const selectedFood = savedFoods.find(
    (f) => f.fdcId.toString() === selectedFoodId,
  );
  const isAlreadyInDish = currentDishIngredients.some(
    (item) => item.fdcId.toString() === selectedFoodId,
  );

  const handleNameChange = (e) => {
    setDishName(e.target.value);
    setIsDirty(true);
    setShowSavedMsg(false);
  };

  const handleImageChange = (e) => {
    setDishImage(e.target.value);
    setIsDirty(true);
    setShowSavedMsg(false);
  };

  const handleAddIngredient = () => {
    if (!selectedFood || quantity <= 0) return;
    setCurrentDishIngredients((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.fdcId === selectedFood.fdcId,
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity = Number(quantity);
        return updated;
      }
      return [...prev, { ...selectedFood, quantity: Number(quantity) }];
    });
    setSelectedFoodId("");
    setIsDirty(true);
    setShowSavedMsg(false);
  };

  const handleRemoveIngredient = (fdcId) => {
    setCurrentDishIngredients((prev) =>
      prev.filter((item) => item.fdcId !== fdcId),
    );
    setIsDirty(true);
    setShowSavedMsg(false);
  };

  const addNutrientFilter = () => {
    if (currentSelect && !activeNutrients.includes(currentSelect)) {
      setActiveNutrients([...activeNutrients, currentSelect]);
      setCurrentSelect("");
      setIsDirty(true);
      setShowSavedMsg(false);
    }
  };

  const removeNutrientFilter = (name) => {
    setActiveNutrients(activeNutrients.filter((n) => n !== name));
    setIsDirty(true);
    setShowSavedMsg(false);
  };

 
  const handleSaveDish = () => {
    const trimmedName = dishName.trim();
    if (!trimmedName || currentDishIngredients.length === 0) return;

  
    const dishIdToSave = currentDishId || buildDishId(trimmedName, currentDishIngredients);

    const newDish = {
      id: dishIdToSave,
      name: trimmedName,
      image: dishImage.trim() || defaultDishImg,
      ingredients: [...currentDishIngredients],
      fullNutrients: calculatedNutrients,
      activeFilters: [...activeNutrients],
    };

    saveDish(newDish);


    setCurrentDishId(dishIdToSave);
    setIsDirty(false);
    setShowSavedMsg(true);
  };

  const handleCloseDish = () => {
    if (isDirty) {
      const confirmExit = window.confirm(
        "You have unsaved changes. Are you sure you want to close this dish without saving?",
      );
      if (!confirmExit) return;
    }


    setDishName("");
    setDishImage("");
    setCurrentDishIngredients([]);
    setActiveNutrients([]);
    setCurrentDishId(null);
    setIsDirty(false);
    setShowSavedMsg(false);
  };


  const calculatedNutrients = (() => {
    const totals = {};
    let totalDishWeight = 0;

   
    currentDishIngredients.forEach((item) => {
      if (!item.foodNutrients) return;
      
      const itemWeight = Number(item.quantity);
      totalDishWeight += itemWeight;
      
      const multiplier = itemWeight / 100;
      
      item.foodNutrients.forEach((nut) => {
        const name = nut.nutrientName || nut?.nutrient?.name;
        const unit = nut.unitName || nut?.nutrient?.unitName;
        const value = nut.value ?? nut.amount ?? 0;
        if (!name) return;
        if (!totals[name]) totals[name] = { name, unit, value: 0 };
        totals[name].value += value * multiplier;
      });
    });

    const nutrientsPer100g = Object.values(totals).map((nut) => {
      const valuePer100g = totalDishWeight > 0 ? (nut.value / totalDishWeight) * 100 : 0;
      return { ...nut, value: valuePer100g };
    });

    return nutrientsPer100g
      .filter((nut) => nut.value > 0)
      .sort((a, b) => b.value - a.value);
  })();


  const availableNutrientsForFilter = useMemo(() => {
    const allNames = new Set();
    calculatedNutrients.forEach((n) => allNames.add(n.name));
    return Array.from(allNames).sort();
  }, [calculatedNutrients]);

  const hasMissingData = useMemo(() => {
    if (activeNutrients.length === 0) return false;
    return currentDishIngredients.some((item) =>
      activeNutrients.some(
        (filterName) =>
          !item.foodNutrients?.some(
            (nut) => (nut.nutrientName || nut?.nutrient?.name) === filterName,
          ),
      ),
    );
  }, [activeNutrients, currentDishIngredients]);

  const displayedNutrients = useMemo(() => {
    if (activeNutrients.length === 0) return calculatedNutrients;
    return calculatedNutrients.filter((n) => activeNutrients.includes(n.name));
  }, [activeNutrients, calculatedNutrients]);

  return (
    <main className={styles.nutriCalcContainer}>
      <div className={styles.titlePage}>
        <h1>NutriCalc</h1>
        <span>Your Dish Builder</span>
      </div>

      {savedFoods.length === 0 ? (
        <section className={styles.emptyState}>
          <h2>No ingredients available</h2>
          <p>
            We see you don't have any saved ingredients yet. Go to the Search
            Page to find your favorites!
          </p>
          <NavLink to="/search" className={styles.btnLinkEmpty}>
            Go to Search Page
          </NavLink>
        </section>
      ) : (
        <div className={styles.calculatorLayout}>
          <section className={styles.topSection}>
            <h2>Choose Ingredients from Favs</h2>

            <div className={styles.creatorControls}>
              <select
                value={selectedFoodId}
                onChange={(e) => setSelectedFoodId(e.target.value)}
              >
                <option value="">-- Select an ingredient --</option>
                {savedFoods.map((food) => (
                  <option key={food.fdcId} value={food.fdcId}>
                    {food.description}
                  </option>
                ))}
              </select>

              <div className={styles.quantityInput}>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <span>g/ml</span>
              </div>

              <button
                onClick={handleAddIngredient}
                disabled={!selectedFoodId || quantity <= 0}
              >
                {isAlreadyInDish ? "Update" : "Add to Dish"}
              </button>
            </div>

            {currentDishIngredients.length > 0 && (
              <div className={styles.currentDishList}>
                <h3>Current Dish Ingredients:</h3>
                <ul>
                  {currentDishIngredients.map((item) => (
                    <li key={item.fdcId} className={styles.dishItem}>
                      <span>
                        {item.description} -{" "}
                        <strong>{item.quantity} g/ml</strong>
                      </span>
                      <button
                        onClick={() => handleRemoveIngredient(item.fdcId)}
                      >
                        <span>×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className={styles.bottomSection}>
            <h2>Dish Nutritional Profile</h2>

            {currentDishIngredients.length === 0 ? (
              <p>Add ingredients above to see the nutritional profile.</p>
            ) : (
              <div className={styles.profileContainer}>
                <div className={styles.saveControls}>
                  <div className={styles.inputsSave}>
                    <input
                      type="text"
                      placeholder="Enter dish name..."
                      value={dishName}
                      onChange={handleNameChange}
                    />
                    <input
                      type="text"
                      placeholder="Image URL (optional)..."
                      value={dishImage}
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className={styles.imagePreview}>
                    <img
                      src={dishImage.trim() ? dishImage : defaultDishImg}
                      alt="preview"
                      onError={(e) => {
                        e.target.src = defaultDishImg;
                      }}
                    />
                    <span>Image preview</span>
                  </div>

                  <div className={styles.actionButtons}>
                    <button
                      onClick={handleSaveDish}
                      disabled={!dishName.trim()}
                    >
                      {currentDishId ? "Update Dish" : "Save Dish"}
                    </button>
                    <button
                      onClick={handleCloseDish}
                      className={styles.closeBtn}
                    >
                      Close Dish
                    </button>
                  </div>
                </div>
                {showSavedMsg && (
                  <div className={styles.savedMessage}>
                    <span> Dish saved successfully! </span> <br />
                    <NavLink to="/savedfood">
                      <span className={styles.LinkSavedDishes}>
                        View saved dishes
                      </span>
                    </NavLink>
                  </div>
                )}
                <h2>Total Nutritional Info per 100g</h2>
                <div className={styles.totalNutrients}>
                  <div className={styles.filterControls}>
                    <div className={styles.filtersNutrient}>
                      <select
                        value={currentSelect}
                        onChange={(e) => setCurrentSelect(e.target.value)}
                      >
                        <option value="">Add nutrient to filter...</option>
                        {availableNutrientsForFilter.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <button onClick={addNutrientFilter}>Add Filter</button>
                    </div>

                    <div className={styles.activeTags}>
                      {activeNutrients.map((n) => (
                        <span key={n} className={styles.tag}>
                          {n}{" "}
                          <button
                            className={styles.filterButton}
                            onClick={() => removeNutrientFilter(n)}
                          >
                            ☒
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {hasMissingData && (
                    <div className={styles.warningAlert}>
                      ⚠️ <strong>Warning:</strong> Missing data for some
                      selected filters.
                    </div>
                  )}

                  <div className={styles.nutrientsGrid}>
                    {displayedNutrients.map((nut) => (
                      <div key={nut.name} className={styles.nutrientBadge}>
                        <span className={styles.nutName}>{nut.name}</span>
                        <span className={styles.nutValue}>
                          {nut.value.toFixed(1)} {nut.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
