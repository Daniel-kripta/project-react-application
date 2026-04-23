import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useFoodSearch } from "../../hooks/useFoodSearch";
import { useFoodContext } from "../../context/FoodContext";
import DailyFoods from "../../components/DailyFood/DailyFood";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  
  const { searchFood } = useFoodSearch();
  const { selectedDailyFood } = useFoodContext();

  const energyNutrient = selectedDailyFood?.foodNutrients?.find(n => 
    n.nutrientId === 1008 || 
    n.nutrient?.id === 1008 ||
    n.nutrientName === "Energy" || 
    n.nutrient?.name === "Energy"
  );

  const caloriesValue = energyNutrient?.amount ?? energyNutrient?.value ?? 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    searchFood(query);
    navigate("/search");
  };

  return (
    <main>
      <section className="hero">
        <h1>Nutrition Guide</h1>
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search food..." 
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="featured-layout">
        <div className="main-display">
          {selectedDailyFood ? (
            <article className="featured-card">
              <img src={selectedDailyFood.image} alt={selectedDailyFood.name} />
              <h2>{selectedDailyFood.name}</h2>
              <p>Calories: {caloriesValue} kcal</p>
              <NavLink to={`/food/${selectedDailyFood.id}`}>View Details</NavLink>
            </article>
          ) : (
            <p>Loading featured content...</p>
          )}
        </div>

        <aside className="sidebar">
          <DailyFoods />
        </aside>
      </section>
    </main>
  );
}