import { useDailyFoods } from "../../hooks/useDailyFoods";
import { useFoodContext } from "../../context/FoodContext";

export default function DailyFoods() {
  const { dailyFoods, loading } = useDailyFoods();
  const { setSelectedDailyFood, selectedDailyFood } = useFoodContext();

  if (loading) return <p>Loading...</p>;

  const otherFoods = dailyFoods.filter(food => food.id !== selectedDailyFood?.id);

  return (
    <div className="daily-grid">
      {otherFoods.map((food) => (
        <div 
          key={food.id} 
          className="small-card"
          onClick={() => setSelectedDailyFood(food)} 
        >
          <img src={food.image} alt={food.name} />
          <p>{food.name}</p>
        </div>
      ))}
    </div>
  );
}