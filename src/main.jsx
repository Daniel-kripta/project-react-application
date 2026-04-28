// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./global.css";

import { FoodProvider } from "./context/FoodContext.jsx";
import { SavedFoodProvider } from "./context/SavedFoodContext";
import { DishProvider } from "./context/DishContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <FoodProvider>
        <SavedFoodProvider>
          <DishProvider>
            <App />
          </DishProvider>
        </SavedFoodProvider>
      </FoodProvider>
    </ErrorBoundary>
  </StrictMode>,
);
