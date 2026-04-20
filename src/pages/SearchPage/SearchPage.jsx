import { useState } from "react";
import { useFoodSearch } from "../../hooks/useFoodSearch";

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");

  const { results, loading, error, searchFood } = useFoodSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    searchFood(inputValue);
  };

  return (
    <main>
      <h1>Search Food</h1>
      
      <div>
  <input 
    type="text" 
    placeholder="Ej. Hummus, Apple, Rice..." 
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={(e) => {

      if (e.key === 'Enter') {
        e.preventDefault();
        searchFood(inputValue);
      }
    }}
  />

  <button type="button" onClick={() => searchFood(inputValue)}>
    Search
  </button>
</div>


      {loading && <p>Searching food...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}


      <ul>
        {results.map((food) => (
            <li key={food.id}>
            <img src={food.imagen} alt={food.nombre} width="50" />
            <strong>{food.nombre}</strong> - <em>{food.marca}</em> 
            <span style={{ color: "green", marginLeft: "10px" }}>
                ({food.calorias} kcal)
            </span>
            </li>
        ))}
      </ul>
    </main>
  );
}