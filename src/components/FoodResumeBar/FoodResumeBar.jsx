import styles from "./FoodResumeBar.module.css";

export default function FoodResumeBar({ food }) {
  const getNutrientValue = (names) => {
    const nutrient = food?.foodNutrients?.find((n) => 
      names.includes(n.nutrientName) || 
      names.includes(n.nutrient?.name) ||
      names.includes(n.name)
    );
    
    return nutrient?.amount ?? nutrient?.value ?? 0;
  };

  const energy = getNutrientValue(["Energy", "Energy (kcal)", "ENERC_KCAL"]);
  const protein = getNutrientValue(["Protein", "PROCNT"]);
  const carbs = getNutrientValue(["Carbohydrate, by difference", "CHOCDF", "Carbohydrates"]);
  const fat = getNutrientValue(["Total lipid (fat)", "FAT", "Lipids"]);

  return (
    <div className={styles["nutrients-line"]}>
      <span>{energy} kcal</span>
      <span>{protein}g protein</span>
      <span>{carbs}g carbs</span>
      <span>{fat}g fat</span>
    </div>
  );
}