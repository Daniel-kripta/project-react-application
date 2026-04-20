import { useState } from "react";

//Images of Pixabay
const getFoodImage = async (foodName) => {
  const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;

  const query = encodeURIComponent(foodName.split(',')[0].split(' ')[0]); 
  
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${pixabayKey}&q=${query}+food&image_type=photo&per_page=3`
    );
    const data = await res.json();
    return data.hits && data.hits.length > 0 
      ? data.hits[0].webformatURL 
      : "https://via.placeholder.com/150?text=No+Image";
  } catch (error) {
    return "https://via.placeholder.com/150?text=Error+Image";
  }
};

export function useFoodSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_USDA_API_KEY;

  const searchFood = async (query) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      // Foods details of USDA
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=10&api_key=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Error at connect to USDA");

      const data = await response.json();


      const cleanResults = await Promise.all(
        data.foods.map(async (food) => {

          const energia = food.foodNutrients.find(
            (n) => n.nutrientName === "Energy" && n.unitName === "KCAL"
          );


          const imagenReal = await getFoodImage(food.description);

          return {
            id: food.fdcId,
            nombre: food.description,
            marca: food.brandOwner || "Alimento genérico/Crudo",
            imagen: imagenReal, 
            calorias: energia ? energia.value : "No disponible"
          };
        })
      );

      setResults(cleanResults);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchFood };
}