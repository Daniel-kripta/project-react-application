import { useState, useEffect } from "react";
import { useFoodContext } from "../context/FoodContext";

// Para enriquecer cada alimento con una imagen de Pixabay
const getFoodImage = async (foodName) => {
  const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;
  const query = encodeURIComponent(foodName.split(",")[0].split(" ")[0]);
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${pixabayKey}&q=${query}+food&image_type=photo&per_page=3`,
    );
    const data = await res.json();
    return data.hits?.[0]?.webformatURL || "https://via.placeholder.com/150";
  } catch {
    return "https://via.placeholder.com/150";
  }
};

export function useDailyFoods() {
  const [dailyFoods, setDailyFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedDailyFood } = useFoodContext();

  useEffect(() => {
    const fetchDaily = async () => {
      const apiKey = import.meta.env.VITE_USDA_API_KEY;
      const cachedData = localStorage.getItem("daily_foods");
      const now = new Date().getTime();

      // Cache diaria para no repetir peticiones a la API durante la misma jornada
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (now < parsed.expiry) {
          setDailyFoods(parsed.data);
          setSelectedDailyFood((prev) => prev || parsed.data[0]);
          setLoading(false);
          return;
        }
      }

      try {
        const today = new Date();
        // Seed basado en la fecha para que la selección de alimentos sea consistente durante el día
        let dailySeed =
          today.getFullYear() * 10000 +
          (today.getMonth() + 1) * 100 +
          today.getDate();

        const pageNumber = (dailySeed % 5) + 1;

        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?dataType=Foundation&pageSize=50&pageNumber=${pageNumber}&api_key=${apiKey}`;

        const response = await fetch(url);
        const rawData = await response.json();

        // Mezcla pseudoaleatoria reproducible para variar los alimentos cada día
        const randomSeeded = () => {
          let x = Math.sin(dailySeed++) * 10000;
          return x - Math.floor(x);
        };

        const shuffled = [...rawData.foods].sort(() => 0.5 - randomSeeded());
        const validFoods = shuffled.slice(0, 5);

        const enriched = await Promise.all(
          validFoods.map(async (food) => {
            // La API USDA a veces devuelve la energía en kJ; si ya existe en kcal, se descarta el de kJ
            const hasKcal = food.foodNutrients?.some((nut) => {
              const name = nut.nutrientName || nut.nutrient?.name;
              const unit = nut.unitName || nut.nutrient?.unitName;
              return (
                name?.toLowerCase().includes("energy") &&
                unit?.toLowerCase() === "kcal"
              );
            });

            // Conversión de kJ a kcal para normalizar las unidades de energía
            const cleanedNutrients =
              food.foodNutrients
                ?.map((nut) => {
                  const name = nut.nutrientName || nut.nutrient?.name;
                  const unit = nut.unitName || nut.nutrient?.unitName;
                  const isEnergy = name?.toLowerCase().includes("energy");
                  const isKj = unit?.toLowerCase() === "kj";

                  if (isEnergy && isKj) {
                    if (hasKcal) return null;
                    const convertedValue = (nut.value ?? nut.amount) / 4.184;
                    return {
                      ...nut,
                      value:
                        nut.value !== undefined ? convertedValue : undefined,
                      amount:
                        nut.amount !== undefined ? convertedValue : undefined,
                      unitName: nut.unitName ? "kcal" : undefined,
                      nutrient: nut.nutrient
                        ? { ...nut.nutrient, unitName: "kcal" }
                        : undefined,
                    };
                  }
                  return nut;
                })
                .filter(Boolean) || [];

            const img = await getFoodImage(food.description);
            return {
              ...food,
              foodNutrients: cleanedNutrients,
              id: food.fdcId,
              name: food.description,
              image: img,
            };
          }),
        );

        // Guardamos con expiración al final del día
        const expiry = new Date().setHours(23, 59, 59, 999);
        localStorage.setItem(
          "daily_foods",
          JSON.stringify({ data: enriched, expiry }),
        );

        setDailyFoods(enriched);
        setSelectedDailyFood((prev) => prev || enriched[0]);
      } catch (error) {
        console.error("Error fetching daily foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, [setSelectedDailyFood]);

  return { dailyFoods, loading };
}
