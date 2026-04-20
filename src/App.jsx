import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage"
import FoodDetailsPage from "./pages/FoodDetailsPage/FoodDetailsPage";
import SavedFoodPage from "./pages/SavedFoodPage/SavedFoodPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Navbar from "./components/Navbar/Navbar";


function App() {

  return (
    
  <BrowserRouter>

    <Navbar />

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/food/:id" element={<FoodDetailsPage />} />
      <Route path="/savedfood" element={<SavedFoodPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>

  </BrowserRouter>

  )
}

export default App;