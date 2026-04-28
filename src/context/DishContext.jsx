import { createContext, useContext, useState, useEffect } from "react";

// Contexto global para gestionar los platos creados en NutriCalc
const DishContext = createContext();

export const DishProvider = ({ children }) => {
  // Se inicializa desde localStorage para que los platos persistan entre sesiones
  const [savedDishes, setSavedDishes] = useState(() => {
    const localData = localStorage.getItem("savedDishes");
    return localData ? JSON.parse(localData) : [];
  });

  // Sincroniza con localStorage cada vez que cambia la lista de platos
  useEffect(() => {
    localStorage.setItem("savedDishes", JSON.stringify(savedDishes));
  }, [savedDishes]);

  // Si el plato ya existe por ID lo actualiza; si es nuevo lo añade al principio
  const saveDish = (dish) => {
    setSavedDishes((prev) => {
      const existingDishIndex = prev.findIndex((d) => d.id === dish.id);
      if (existingDishIndex >= 0) {
        const updatedDishes = [...prev];
        updatedDishes[existingDishIndex] = dish;
        return updatedDishes;
      }
      return [dish, ...prev];
    });
  };

  const deleteDish = (dishId) => {
    setSavedDishes((prev) => prev.filter((d) => d.id !== dishId));
  };

  return (
    <DishContext.Provider value={{ savedDishes, saveDish, deleteDish }}>
      {children}
    </DishContext.Provider>
  );
};

export const useDish = () => {
  const context = useContext(DishContext);
  if (!context) {
    throw new Error("useDish debe usarse dentro de un DishProvider");
  }
  return context;
};
