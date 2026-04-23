import { createContext, useState, useContext } from "react";

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {

    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const [selectedDailyFood, setSelectedDailyFood] = useState(null);

    const value = {
    searchResults,
    setSearchResults,
    searchLoading,
    setSearchLoading,
    searchError,
    setSearchError,
    selectedDailyFood,
    setSelectedDailyFood,
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>
};

export const useFoodContext = () => {
    const context = useContext(FoodContext);
    if (!context) {
        throw new Error("useFoodContext debe usarse dentro de un FoodProvider");
    }
    return context;
};