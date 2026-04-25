import { useSavedFood } from "../../context/SavedFoodContext";
import FoodResumeBar from "../../components/FoodResumeBar/FoodResumeBar";
import styles from "./SaveFoodPage.module.css";

export default function SavedFoodPage() {
  const { savedFoods, removeFromSaved } = useSavedFood();

  const totalSaved = savedFoods.length;

  const categoryStats = savedFoods.reduce((acc, food) => {
    const cat = food.foodCategory || "Others";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className={styles.savedPage}>
      <h1>Saved Ingredients</h1>

      <section className={styles.infoPanel}>
        <div className={styles.statCard}>
          <h3>Total Items</h3>
          <p>{totalSaved}</p>
        </div>

        <div className={styles.statCard}>
          <h3>By Category</h3>
          <ul>
            {Object.entries(categoryStats).map(([category, count]) => (
              <li key={category}>
                {category}: {((count / totalSaved) * 100).toFixed(0)}%
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.foodList}>
        {savedFoods.length > 0 ? (
          savedFoods.map((food) => (
            <div key={food.fdcId} className={styles.foodCard}>
              <h3>{food.description}</h3>
              <FoodResumeBar food={food} />
              <button 
                className={styles.removeBtn}
                onClick={() => removeFromSaved(food.fdcId)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>No ingredients saved yet.</p>
        )}
      </section>
    </main>
  );
}