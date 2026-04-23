import { useState } from "react";

const cache = {}; 

const getFoodImage = async (foodName) => {
  const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;
  const query = encodeURIComponent(foodName.split(',')[0].split(' ')[0]); 
  
  if (cache[`img_${query}`]) return cache[`img_${query}`];

  try {
    const res = await fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${query}+food&image_type=photo&per_page=3`);
    const data = await res.json();
    const url = data.hits?.length > 0 ? data.hits[0].webformatURL : "https://via.placeholder.com/150?text=No+Image";
    cache[`img_${query}`] = url;
    return url;
  } catch (error) {
    return "https://via.placeholder.com/150?text=Error+Image";
  }
};

export function useFoodSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_USDA_API_KEY;

  const searchFood = async (query, onlyFoundation = false) => {
    const trimmedQuery = query.trim();
    const searchKey = `${trimmedQuery}_${onlyFoundation}`;

    if (cache[searchKey]) {
      setResults(cache[searchKey]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataTypes = onlyFoundation ? "Foundation" : "Foundation,SR%20Legacy";
      const q = trimmedQuery === "" ? "%20" : encodeURIComponent(trimmedQuery);
      const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${q}&dataType=${dataTypes}&pageSize=100&api_key=${apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error connecting to USDA");
      const data = await response.json();

      if (!data.foods) {
        setResults([]);
        return;
      }

      const enrichedResults = await Promise.all(
        data.foods.map(async (food) => {
          const imagenReal = await getFoodImage(food.description);
          return { ...food, imagen: imagenReal };
        })
      );

      cache[searchKey] = enrichedResults;
      setResults(enrichedResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchFood };
}