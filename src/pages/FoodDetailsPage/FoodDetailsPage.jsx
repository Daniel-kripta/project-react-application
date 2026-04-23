import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FoodDetailsPage() {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [wikiData, setWikiData] = useState("");

  useEffect(() => {
    const getFoodDetails = async () => {
      const apiKey = import.meta.env.VITE_USDA_API_KEY;
      const url = `https://api.nal.usda.gov/fdc/v1/food/${id}?api_key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error to connect to USDA");

        const data = await response.json();

        setFood(data);

        const cleanName = data.description.split(",")[0];

        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`;
        const wikiRes = await fetch(wikiUrl);

        if (wikiRes.ok) {
          const data = await wikiRes.json();
          setWikiData({
            extract: data.extract_html,
            image: data.thumbnail?.source,
            url: data.content_urls.desktop.page,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    getFoodDetails();
  }, [id]);

  if (!food)
    return (
      <main>
        <p>Loading...</p>
      </main>
    );

  const getNutrient = (name) =>
    food.foodNutrients?.find((n) => n.nutrient.name === name);

  //Basic and Minerals
  const water = getNutrient("Water");
  const calories = getNutrient("Energy");
  const protein = getNutrient("Protein");
  const fat = getNutrient("Total lipid (fat)");
  const carbohydrate = getNutrient("Carbohydrate, by difference");
  const fiber = getNutrient("Fiber, total dietary");
  const calcium = getNutrient("Calcium, Ca");
  const iron = getNutrient("Iron, Fe");
  const magnesium = getNutrient("Magnesium, Mg");
  const phosphorus = getNutrient("Phosphorus, P");
  const potassium = getNutrient("Potassium, K");
  const sodium = getNutrient("Sodium, Na");
  const zinc = getNutrient("Zinc, Zn");
  const copper = getNutrient("Copper, Cu");
  const manganese = getNutrient("Manganese, Mn");
  const selenium = getNutrient("Selenium, Se");

  // Vitamins
  const vitC = getNutrient("Vitamin C, total ascorbic acid");
  const thiamin = getNutrient("Thiamin");
  const riboflavin = getNutrient("Riboflavin");
  const niacin = getNutrient("Niacin");
  const pantothenicAcid = getNutrient("Pantothenic acid");
  const vitB6 = getNutrient("Vitamin B-6");
  const vitB12 = getNutrient("Vitamin B-12");
  const folateTotal = getNutrient("Folate, total");
  const vitARAE = getNutrient("Vitamin A, RAE");
  const retinol = getNutrient("Retinol");

  // Aminoacids
  const tryptophan = getNutrient("Tryptophan");
  const threonine = getNutrient("Threonine");
  const isoleucine = getNutrient("Isoleucine");
  const leucine = getNutrient("Leucine");
  const lysine = getNutrient("Lysine");
  const methionine = getNutrient("Methionine");
  const cystine = getNutrient("Cystine");
  const phenylalanine = getNutrient("Phenylalanine");
  const tyrosine = getNutrient("Tyrosine");
  const valine = getNutrient("Valine");
  const arginine = getNutrient("Arginine");
  const histidine = getNutrient("Histidine");
  const alanine = getNutrient("Alanine");
  const asparticAcid = getNutrient("Aspartic acid");
  const glutamicAcid = getNutrient("Glutamic acid");
  const glycine = getNutrient("Glycine");
  const proline = getNutrient("Proline");
  const serine = getNutrient("Serine");

  // Fatty acids and Lipids
  const cholesterol = getNutrient("Cholesterol");
  const saturatedFat = getNutrient("Fatty acids, total saturated");
  const monounsaturatedFat = getNutrient("Fatty acids, total monounsaturated");
  const polyunsaturatedFat = getNutrient("Fatty acids, total polyunsaturated");

  console.log(food);
  return (
    <main>
      <h1>{food.description}</h1>

      <div className="food-summary">
        <span>
          <strong>Calories:</strong> {calories?.amount}{" "}
          {calories?.nutrient.unitName}
        </span>{" "}
        |
        <span>
          <strong>Water:</strong> {water?.amount} g
        </span>{" "}
        |
        <span>
          <strong>Fiber:</strong> {fiber?.amount} g
        </span>
      </div>

      <div className="wiki-section">
        {wikiData?.image && (
          <img
            src={wikiData.image}
            alt={food.description}
            style={{ borderRadius: "8px", maxWidth: "300px" }}
          />
        )}

        {wikiData?.extract && (
          <div dangerouslySetInnerHTML={{ __html: wikiData.extract }} />
        )}
      </div>

      <div className="nutrient-group">
        <h2>Proteins</h2>
        <table className="nutrient-table">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Amount</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Total Protein</strong>
              </td>
              <td>{protein?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Tryptophan</td>
              <td>{tryptophan?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Threonine</td>
              <td>{threonine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Isoleucine</td>
              <td>{isoleucine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Leucine</td>
              <td>{leucine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Lysine</td>
              <td>{lysine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Methionine</td>
              <td>{methionine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Cystine</td>
              <td>{cystine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Phenylalanine</td>
              <td>{phenylalanine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Tyrosine</td>
              <td>{tyrosine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Valine</td>
              <td>{valine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Arginine</td>
              <td>{arginine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Histidine</td>
              <td>{histidine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Alanine</td>
              <td>{alanine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Aspartic acid</td>
              <td>{asparticAcid?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Glutamic acid</td>
              <td>{glutamicAcid?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Glycine</td>
              <td>{glycine?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Proline</td>
              <td>{proline?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Serine</td>
              <td>{serine?.amount}</td>
              <td>g</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="nutrient-group">
        <h2>Fats & Lipids</h2>
        <table className="nutrient-table">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Amount</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Total lipid (fat)</strong>
              </td>
              <td>{fat?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Saturated Fat</td>
              <td>{saturatedFat?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Monounsaturated Fat</td>
              <td>{monounsaturatedFat?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Polyunsaturated Fat</td>
              <td>{polyunsaturatedFat?.amount}</td>
              <td>g</td>
            </tr>
            <tr>
              <td>Cholesterol</td>
              <td>{cholesterol?.amount}</td>
              <td>mg</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="nutrient-group">
        <h2>Minerals</h2>
        <table className="nutrient-table">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Amount</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Calcium (Ca)</td>
              <td>{calcium?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Iron (Fe)</td>
              <td>{iron?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Magnesium (Mg)</td>
              <td>{magnesium?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Phosphorus (P)</td>
              <td>{phosphorus?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Potassium (K)</td>
              <td>{potassium?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Sodium (Na)</td>
              <td>{sodium?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Zinc (Zn)</td>
              <td>{zinc?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Copper (Cu)</td>
              <td>{copper?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Manganese (Mn)</td>
              <td>{manganese?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Selenium (Se)</td>
              <td>{selenium?.amount}</td>
              <td>µg</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="nutrient-group">
        <h2>Vitamins</h2>
        <table className="nutrient-table">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Amount</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vitamin C</td>
              <td>{vitC?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Thiamin (B1)</td>
              <td>{thiamin?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Riboflavin (B2)</td>
              <td>{riboflavin?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Niacin (B3)</td>
              <td>{niacin?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Pantothenic acid (B5)</td>
              <td>{pantothenicAcid?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Vitamin B-6</td>
              <td>{vitB6?.amount}</td>
              <td>mg</td>
            </tr>
            <tr>
              <td>Vitamin B-12</td>
              <td>{vitB12?.amount}</td>
              <td>µg</td>
            </tr>
            <tr>
              <td>Folate</td>
              <td>{folateTotal?.amount}</td>
              <td>µg</td>
            </tr>
            <tr>
              <td>Vitamin A</td>
              <td>{vitARAE?.amount}</td>
              <td>µg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
