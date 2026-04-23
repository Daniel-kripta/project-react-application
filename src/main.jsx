import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./global.css"
import { FoodProvider } from './context/FoodContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FoodProvider>
      <App />
    </FoodProvider>
  </StrictMode>,
)
