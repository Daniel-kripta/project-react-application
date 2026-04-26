import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage"
import FoodDetailsPage from "./pages/FoodDetailsPage/FoodDetailsPage";
import SavedFoodPage from "./pages/SavedFoodPage/SavedFoodPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import NutriCalc from "./pages/NutriCalc/NutriCalc";
import Footer from "./components/Footer/Footer";
import styles from './App.module.css';
import { SavedFoodProvider } from "./context/SavedFoodContext";
import { DishProvider } from "./context/DishContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className={styles.appContainer}>
      <div className={styles.mainContent}>
        {isHomePage && <Hero />}
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/food/:id" element={<FoodDetailsPage />} />
          <Route path="/savedfood" element={<SavedFoodPage />} />
          <Route path="/nutricalc" element={<NutriCalc />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function App(){
  return(
    <ErrorBoundary>
      <BrowserRouter basename="/project-react-application">
        <SavedFoodProvider>
          <DishProvider>
            <AppContent />
          </DishProvider>
        </SavedFoodProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;