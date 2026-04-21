import { useState, useEffect } from "react";

const getFoodImage = async (foodName) => {
  const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;
  const query = encodeURIComponent(foodName.split(',')[0].split(' ')[0]); 
  
  try {
    const res = await fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${query}+food&image_type=photo&per_page=3`);
    const data = await res.json();
    return data.hits?.length > 0 ? data.hits[0].webformatURL : "https://via.placeholder.com/150";
  } catch {
    return "https://via.placeholder.com/150";
  }
};

export function useDailyFoods() {
  const [dailyFoods, setDailyFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDaily = async () => {
      const apiKey = import.meta.env.VITE_USDA_API_KEY;
      const now = new Date().getTime();

      const cachedData = localStorage.getItem("daily_foods");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);

        if (now < parsed.expiry) {
          setDailyFoods(parsed.data);
          setLoading(false);
          return;
        }
      }

      try {
        const daySeed = new Date().getDate();
        
        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=raw&dataType=Foundation&pageSize=100&pageNumber=1&api_key=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.foods || data.foods.length === 0) {
          throw new Error("No foods found");
        }

        const selectedFoods = [0, 20, 40, 60, 80].map(index => {
          const safeIndex = (index + daySeed) % data.foods.length;
          return data.foods[safeIndex];
        });

        const cleanResults = await Promise.all(selectedFoods.map(async (food) => {
          if (!food) return null;
          
          const img = await getFoodImage(food.description);
          return {
            id: food.fdcId,
            name: food.description,
            image: img
          };
        }));

        const finalResults = cleanResults.filter(Boolean);

        const expiry = new Date().setHours(23, 59, 59, 999);
        localStorage.setItem("daily_foods", JSON.stringify({
          data: finalResults,
          expiry: expiry
        }));

        setDailyFoods(finalResults);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, []);

  return { dailyFoods, loading };
}