import { useSavedFood } from "../../context/SavedFoodContext";
import savedIcon from "../../assets/icons/saved_icon.svg";
import styles from "./SaveButton.module.css";

export default function SaveButton({ food }) {
  const { isSaved, addToSaved, removeFromSaved } = useSavedFood();
  

  const saved = isSaved(food.fdcId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (saved) {
      removeFromSaved(food.fdcId);
    } else {
      addToSaved(food);
    }
  };

  return (
    <button 
      className={`${styles.btnFav} ${saved ? styles.active : ""}`}
      onClick={handleClick}
    >
      <img src={savedIcon} alt="save" /> 
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}