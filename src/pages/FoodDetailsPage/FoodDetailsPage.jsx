import { useParams } from "react-router-dom";
import { useFoodDetails } from "../../hooks/useFoodDetails"; 
import FoodResumeBar from "../../components/FoodResumeBar/FoodResumeBar";
import styles from "./FoodDetailsPage.module.css"; 


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
  

  const { details: food, wikiData, loading } = useFoodDetails(id);

  if (loading || !food) {
    return (
      <main className={styles.mainContainer}>
        <p>Loading nutritional data...</p>
      </main>
    );
  }

 
  const getNutrient = (name) => food.foodNutrients?.find((n) => n.nutrient.name === name);

  return (
    <main className={styles.mainContainer}>
      <h1>{food.description}</h1>

      
      <div className={styles.foodSummary}>
        <FoodResumeBar food={food} />
      </div>

      
      <div className={styles.wikiSection}>
        {wikiData?.image && (
          <img
            src={wikiData.image}
            alt={food.description}
            className={styles.wikiImage}
          />
        )}
        <div className={styles.textWikiSection}>
        <span>Food description:</span>
        {wikiData?.extract && (
          <div dangerouslySetInnerHTML={{ __html: wikiData.extract }} />
        )}
        </div>
      </div>
      <h2 className={styles.h2NutrientsList}>Nutrients list</h2>
<div className={styles.nutrientCards}>
      {Object.entries(NUTRIENT_GROUPS).map(([groupName, nutrientNames]) => (
        <div key={groupName} className={styles.nutrientGroup}>
          <h3>{groupName}</h3>
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
                if (!nutrient) return null; 
                
                return (
                  <tr key={name}>
                    <td>
                      
                      {["Protein", "Total lipid (fat)"].includes(name) ? (
                        <strong>{name}</strong>
                      ) : (
                        name
                      )}
                    </td>
                    <td className={styles.tableAmount}>{nutrient.amount}</td>
                    <td className={styles.tableUnit}>{nutrient.nutrient.unitName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      </div>
    </main>
  );
}