import { createContext, useContext, useState, useEffect } from "react";

// Contexto global para gestionar los alimentos guardados como favoritos
const SavedFoodContext = createContext();

export const SavedFoodProvider = ({ children }) => {
  // Se inicializa desde localStorage para que los favoritos persistan entre sesiones
  const [savedFoods, setSavedFoods] = useState(() => {
    const localData = localStorage.getItem("savedFoods");
    return localData ? JSON.parse(localData) : [];
  });

  // Sincroniza con localStorage cada vez que cambia la lista de favoritos
  useEffect(() => {
    localStorage.setItem("savedFoods", JSON.stringify(savedFoods));
  }, [savedFoods]);

  const addToSaved = (food) => {
    setSavedFoods((prev) => {
      if (prev.some((f) => f.fdcId === food.fdcId)) return prev;
      return [...prev, food];
    });
  };

  const removeFromSaved = (fdcId) => {
    setSavedFoods((prev) => prev.filter((f) => f.fdcId !== fdcId));
  };

  const isSaved = (fdcId) => {
    return savedFoods.some((f) => f.fdcId === fdcId);
  };

  return (
    <SavedFoodContext.Provider
      value={{ savedFoods, addToSaved, removeFromSaved, isSaved }}
    >
      {children}
    </SavedFoodContext.Provider>
  );
};

export const useSavedFood = () => {
  const context = useContext(SavedFoodContext);
  if (!context) {
    throw new Error("useSavedFood debe usarse dentro de un SavedFoodProvider");
  }
  return context;
};
