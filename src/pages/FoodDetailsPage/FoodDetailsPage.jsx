import { useParams } from "react-router-dom";
import { useFoodDetails } from "../../hooks/useFoodDetails"; // ¡Usamos tu hook!
import styles from "./FoodDetailsPage.module.css"; // Cambiado a CSS Module

// 1. Configuramos los grupos una sola vez (como hiciste en SavedFoodPage)
const NUTRIENT_GROUPS = {
  "Proteins": [
    "Protein", "Tryptophan", "Threonine", "Isoleucine", "Leucine", "Lysine", 
    "Methionine", "Cystine", "Phenylalanine", "Tyrosine", "Valine", "Arginine", 
    "Histidine", "Alanine", "Aspartic acid", "Glutamic acid", "Glycine", "Proline", "Serine"
  ],
  "Fats & Lipids": [
    "Total lipid (fat)", "Fatty acids, total saturated", "Fatty acids, total monounsaturated", 
    "Fatty acids, total polyunsaturated", "Cholesterol"
  ],
  "Minerals": [
    "Calcium, Ca", "Iron, Fe", "Magnesium, Mg", "Phosphorus, P", "Potassium, K", 
    "Sodium, Na", "Zinc, Zn", "Copper, Cu", "Manganese, Mn", "Selenium, Se"
  ],
  "Vitamins": [
    "Vitamin C, total ascorbic acid", "Thiamin", "Riboflavin", "Niacin", 
    "Pantothenic acid", "Vitamin B-6", "Vitamin B-12", "Folate, total", "Vitamin A, RAE"
  ]
};

export default function FoodDetailsPage() {
  const { id } = useParams();
  
  // 2. Consumimos tu Custom Hook (esto maneja el fetch, caché y estados)
  const { details: food, wikiData, loading } = useFoodDetails(id);

  if (loading || !food) {
    return (
      <main className={styles.mainContainer}>
        <p>Loading nutritional data...</p>
      </main>
    );
  }

  // Helper para buscar nutrientes
  const getNutrient = (name) => food.foodNutrients?.find((n) => n.nutrient.name === name);

  // Nutrientes principales para el resumen
  const calories = getNutrient("Energy");
  const water = getNutrient("Water");
  const fiber = getNutrient("Fiber, total dietary");

  return (
    <main className={styles.mainContainer}>
      <h1>{food.description}</h1>

      {/* Resumen principal */}
      <div className={styles.foodSummary}>
        <span>
          <strong>Calories:</strong> {calories?.amount || 0} {calories?.nutrient.unitName || 'kcal'}
        </span> |
        <span>
          <strong>Water:</strong> {water?.amount || 0} g
        </span> |
        <span>
          <strong>Fiber:</strong> {fiber?.amount || 0} g
        </span>
      </div>

      {/* Sección de Wikipedia */}
      <div className={styles.wikiSection}>
        {wikiData?.image && (
          <img
            src={wikiData.image}
            alt={food.description}
            className={styles.wikiImage}
          />
        )}
        {wikiData?.extract && (
          <div dangerouslySetInnerHTML={{ __html: wikiData.extract }} />
        )}
      </div>

      {/* 3. Mapeo Dinámico de Tablas */}
      {Object.entries(NUTRIENT_GROUPS).map(([groupName, nutrientNames]) => (
        <div key={groupName} className={styles.nutrientGroup}>
          <h2>{groupName}</h2>
          <table className={styles.nutrientTable}>
            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Amount</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {nutrientNames.map((name) => {
                const nutrient = getNutrient(name);
                if (!nutrient) return null; // Si no tiene el nutriente, no pinta la fila
                
                return (
                  <tr key={name}>
                    <td>
                      {/* Negrita si es un macro principal */}
                      {["Protein", "Total lipid (fat)"].includes(name) ? (
                        <strong>{name}</strong>
                      ) : (
                        name
                      )}
                    </td>
                    <td>{nutrient.amount}</td>
                    <td>{nutrient.nutrient.unitName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </main>
  );
}