import { useFoodContext } from "../context/FoodContext";

// Para enriquecer cada resultado de búsqueda con una imagen de Pixabay
const getFoodImage = async (foodName) => {
  const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;
  const query = encodeURIComponent(foodName.split(",")[0].split(" ")[0]);
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${pixabayKey}&q=${query}+food&image_type=photo&per_page=3`,
    );
    const data = await res.json();
    return data.hits?.length > 0
      ? data.hits[0].webformatURL
      : "https://via.placeholder.com/150?text=No+Image";
  } catch {
    return "https://via.placeholder.com/150?text=Error+Image";
  }
};

export function useFoodSearch() {
  const { setSearchResults, setSearchLoading, setSearchError } =
    useFoodContext();

  const apiKey = import.meta.env.VITE_USDA_API_KEY;

  const searchFood = async (query, onlyFoundation = false) => {
    setSearchLoading(true);
    setSearchError(null);

    try {
      const dataTypes = onlyFoundation
        ? "Foundation"
        : "Foundation,SR%20Legacy";
      const q = query.trim() === "" ? "%20" : encodeURIComponent(query);

      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${q}&dataType=${dataTypes}&pageSize=50&api_key=${apiKey}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error connecting to USDA");
      const data = await response.json();

      if (!data.foods || data.foods.length === 0) {
        setSearchResults([]);
        return;
      }

      const enrichedResults = await Promise.all(
        data.foods.map(async (food) => {
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
                    value: nut.value !== undefined ? convertedValue : undefined,
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

          const imagenReal = await getFoodImage(food.description);

          return {
            ...food,
            foodNutrients: cleanedNutrients,
            imagen: imagenReal,
          };
        }),
      );

      setSearchResults(enrichedResults);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  return { searchFood };
}
