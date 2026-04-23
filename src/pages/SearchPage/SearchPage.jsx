import { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useFoodSearch } from "../../hooks/useFoodSearch"; 
import { useFoodContext } from "../../context/FoodContext"; 

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [onlyFoundation, setOnlyFoundation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState(""); 
  const [activeNutrients, setActiveNutrients] = useState([]);
  const [currentNutrient, setCurrentNutrient] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


  const { searchResults, searchLoading, searchError } = useFoodContext(); 

  const { searchFood } = useFoodSearch(); 

  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults, selectedCategory, activeNutrients]);


  const categories = useMemo(() => {
    const cats = searchResults.map(f => f.foodCategory).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [searchResults]);

  const availableNutrients = useMemo(() => {
    const allNutrients = searchResults.flatMap(f => f.foodNutrients.map(n => n.nutrientName));
    return [...new Set(allNutrients)].sort();
  }, [searchResults]);

  const addNutrientFilter = () => {
    if (currentNutrient && !activeNutrients.includes(currentNutrient)) {
      setActiveNutrients([...activeNutrients, currentNutrient]);
      setSortBy(currentNutrient); 
      setCurrentNutrient("");
    }
  };

  const removeNutrientFilter = (name) => {
    setActiveNutrients(activeNutrients.filter(n => n !== name));
  };

  const filteredResults = useMemo(() => {
    let filtered = [...searchResults];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(f => f.foodCategory === selectedCategory);
    }

    activeNutrients.forEach(nutrientName => {
      filtered = filtered.filter(f => 
        f.foodNutrients.some(n => n.nutrientName === nutrientName && n.value > 0)
      );
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        const valA = a.foodNutrients.find(n => n.nutrientName === sortBy)?.value || 0;
        const valB = b.foodNutrients.find(n => n.nutrientName === sortBy)?.value || 0;
        return valB - valA;
      });
    }

    return filtered;
  }, [searchResults, selectedCategory, activeNutrients, sortBy]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    return filteredResults.slice(firstIndex, lastIndex);
  }, [filteredResults, currentPage]);

  return (
    <main>
      <h1>Search Food</h1>
      
      <div className="search-controls">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Search..." 
        />
        <label>
          <input 
            type="checkbox" 
            checked={onlyFoundation} 
            onChange={(e) => setOnlyFoundation(e.target.checked)} 
          /> 
          Only Foundation
        </label>
        <button onClick={() => searchFood(inputValue, onlyFoundation)}>Search</button>
      </div>

      {searchResults.length > 0 && (
        <div className="filters-section">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={currentNutrient} onChange={(e) => setCurrentNutrient(e.target.value)}>
            <option value="">Choose nutrient...</option>
            {availableNutrients.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={addNutrientFilter}>Add Nutrient</button>

          <div className="active-tags">
            {activeNutrients.map(n => (
              <span key={n} className="tag">
                {n} <button onClick={() => removeNutrientFilter(n)}>&times;</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {searchLoading && <p>Loading data...</p>}
      {searchError && <p>{searchError}</p>}
      
      <div className="results-container">
        {currentItems.map((food) => (
          <div key={food.fdcId} className="result-item">
            <NavLink to={`/food/${food.fdcId}`}>
              <img src={food.imagen} alt={food.description} />
              <h4>{food.description}</h4>
              <div className="nutrients-display">
                {activeNutrients.map(nutName => {
                  const nut = food.foodNutrients.find(n => n.nutrientName === nutName);
                  return <span key={nutName}>{nutName}: {nut?.value} {nut?.unitName}</span>;
                })}
              </div>
            </NavLink>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
        </div>
      )}
    </main>
  );
}