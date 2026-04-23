import { useState, useEffect } from "react";
import { useFoodContext } from "../context/FoodContext";

const getFoodImage = async (foodName) => {
  const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;
  const query = encodeURIComponent(foodName.split(',')[0].split(' ')[0]); 
  try {
    const res = await fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${query}+food&image_type=photo&per_page=3`);
    const data = await res.json();
    return data.hits?.[0]?.webformatURL || "https://via.placeholder.com/150";
  } catch {
    return "https://via.placeholder.com/150";
  }
};

export function useDailyFoods() {
  const [dailyFoods, setDailyFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedDailyFood, selectedDailyFood } = useFoodContext();

  useEffect(() => {
    const fetchDaily = async () => {
      const apiKey = import.meta.env.VITE_USDA_API_KEY;
      const cachedData = localStorage.getItem("daily_foods");
      const now = new Date().getTime();

      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (now < parsed.expiry) {
          setDailyFoods(parsed.data);
          if (!selectedDailyFood) setSelectedDailyFood(parsed.data[0]);
          setLoading(false);
          return;
        }
      }

      try {
        
        const foodIds = [1103351, 1103935, 1100579, 1102750, 1103557]; 
        const url = `https://api.nal.usda.gov/fdc/v1/foods?fdcIds=${foodIds.join(',')}&api_key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        const enriched = await Promise.all(data.map(async (food) => {
          const img = await getFoodImage(food.description);
          return { ...food, id: food.fdcId, name: food.description, image: img };
        }));

        const expiry = new Date().setHours(23, 59, 59, 999);
        localStorage.setItem("daily_foods", JSON.stringify({ data: enriched, expiry }));

        setDailyFoods(enriched);
        setSelectedDailyFood(enriched[0]);
      } catch (error) {
        console.error("Error fetching daily foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, []);

  return { dailyFoods, loading };
}