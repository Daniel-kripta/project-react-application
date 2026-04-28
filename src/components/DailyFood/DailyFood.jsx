import { useDailyFoods } from "../../hooks/useDailyFoods";
import { useFoodContext } from "../../context/FoodContext";
import styles from "./DailyFood.module.css";

export default function DailyFoods() {
  const { dailyFoods, loading } = useDailyFoods();
  const { setSelectedDailyFood, selectedDailyFood } = useFoodContext();

  if (loading) return <p>Loading...</p>;

  const otherFoods = dailyFoods
    ?.filter((food) => food.id !== selectedDailyFood?.id)
    .slice(0, 4);

  if (!otherFoods || otherFoods.length === 0) {
    return <p>No foods available right now.</p>;
  }

  return (
    <div className={styles.dailyGrid}>
      {otherFoods.map((food) => (
        <div
          key={food.id}
          className={styles.smallCard}
          onClick={() => setSelectedDailyFood(food)}
        >
          <img src={food.image} alt={food.name} />
          <p>{food.name}</p>
        </div>
      ))}
    </div>
  );
}
