import styles from "./FoodResumeBar.module.css";

export default function FoodResumeBar({ food }) {
  const getNutrientValue = (names, targetUnit = null) => {
    const nutrient = food?.foodNutrients?.find((n) => {
      const nameMatches =
        names.includes(n.nutrientName) ||
        names.includes(n.nutrient?.name) ||
        names.includes(n.name);

      if (nameMatches && targetUnit) {
        const unit = n.unitName || n.nutrient?.unitName;
        return unit?.toLowerCase() === targetUnit.toLowerCase();
      }

      return nameMatches;
    });

    const rawValue = nutrient?.amount ?? nutrient?.value ?? 0;

    return Math.round(rawValue * 100) / 100;
  };

  const energy = getNutrientValue(
    ["Energy", "Energy (kcal)", "ENERC_KCAL"],
    "kcal",
  );
  const protein = getNutrientValue(["Protein", "PROCNT"]);
  const carbs = getNutrientValue([
    "Carbohydrate, by difference",
    "Carbohydrate, by summation",
    "Carbohydrate",
    "Carbohydrates",
    "CHOCDF",
  ]);
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
