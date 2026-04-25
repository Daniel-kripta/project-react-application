import { NavLink } from "react-router-dom";
import FoodResumeBar from "../FoodResumeBar/FoodResumeBar";
import styles from "./FoodCard.module.css"; 

export default function FoodCard({ food, extraContent, actionButton }) {
  // FÍJATE: Aquí no hay ningún currentItems ni ningún .map(). 
  // Solo dibujamos "food".
  return (
    <div className={styles.resultTable}>
      <NavLink to={`/food/${food.fdcId}`} className={styles.resultItem}>
<img src={food.imagen} alt={food.description} className={styles.foodThumbnail} />        
        <div>
          <h4>{food.description}</h4>
          <FoodResumeBar food={food} />
        </div>
        
        {extraContent && (
          <div>
            {extraContent}
          </div>
        )}
        
        <div className={styles.btnsSearch}>
          <div className="linkDetailHP">
            View Full Nutritional Information
          </div>
          
          <div 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {actionButton}
          </div>
        </div>
      </NavLink>
    </div>
  );
}