import { createContext, useContext, useState, useEffect } from "react";

const DishContext = createContext();

export const DishProvider = ({ children }) => {
  // Inicializamos el estado leyendo del localStorage si existe
  const [savedDishes, setSavedDishes] = useState(() => {
    const localData = localStorage.getItem("savedDishes");
    return localData ? JSON.parse(localData) : [];
  });

  // Efecto para sincronizar con localStorage cada vez que los platos cambien
  useEffect(() => {
    localStorage.setItem("savedDishes", JSON.stringify(savedDishes));
  }, [savedDishes]);

  // Función para guardar un nuevo plato
  // Recibirá un objeto completo con: { id, name, ingredients, fullNutrients, activeFilters }
  const saveDish = (dish) => {
    setSavedDishes((prev) => {
      // Si el plato ya existe (por ID), lo actualizamos (útil para el futuro paso 10 de editar)
      const existingDishIndex = prev.findIndex((d) => d.id === dish.id);
      if (existingDishIndex >= 0) {
        const updatedDishes = [...prev];
        updatedDishes[existingDishIndex] = dish;
        return updatedDishes;
      }
      // Si es nuevo, lo añadimos al principio de la lista
      return [dish, ...prev];
    });
  };

  // Función para eliminar un plato por su ID
  const deleteDish = (dishId) => {
    setSavedDishes((prev) => prev.filter((d) => d.id !== dishId));
  };

  return (
    <DishContext.Provider value={{ savedDishes, saveDish, deleteDish }}>
      {children}
    </DishContext.Provider>
  );
};

// Custom hook con protección
export const useDish = () => {
  const context = useContext(DishContext);
  if (!context) {
    throw new Error("useDish debe usarse dentro de un DishProvider");
  }
  return context;
};