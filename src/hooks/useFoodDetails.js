import { useState, useEffect } from "react";

// Cache en memoria para no repetir peticiones al navegar de vuelta a un detalle ya visitado
const detailsCache = {};

export function useFoodDetails(foodId) {
  const cachedEntry = foodId ? detailsCache[foodId] : null;
  const [details, setDetails] = useState(cachedEntry?.usda ?? null);
  const [loading, setLoading] = useState(false);
  const [wikiData, setWikiData] = useState(cachedEntry?.wiki ?? null);

  useEffect(() => {
    if (!foodId) return;

    if (!foodId || cachedEntry) return;

    const fetchDetails = async () => {
      setLoading(true);
      const apiKey = import.meta.env.VITE_USDA_API_KEY;

      try {
        const res = await fetch(
          `https://api.nal.usda.gov/fdc/v1/food/${foodId}?api_key=${apiKey}`,
        );
        const usdaData = await res.json();

        if (usdaData.foodNutrients) {
          // La API USDA a veces devuelve la energía en kJ; si ya existe en kcal, se descarta el de kJ
          const hasKcal = usdaData.foodNutrients.some((nut) => {
            const name = nut.nutrientName || nut.nutrient?.name;
            const unit = nut.unitName || nut.nutrient?.unitName;
            return (
              name?.toLowerCase().includes("energy") &&
              unit?.toLowerCase() === "kcal"
            );
          });

          // Conversión de kJ a kcal para normalizar las unidades de energía
          usdaData.foodNutrients = usdaData.foodNutrients
            .map((nut) => {
              const name = nut.nutrientName || nut.nutrient?.name;
              const unit = nut.unitName || nut.nutrient?.unitName;
              const isEnergy = name?.toLowerCase().includes("energy");
              const isKj = unit?.toLowerCase() === "kj";

              if (isEnergy && isKj) {
                if (hasKcal) return null;
                const convertedValue = (nut.value ?? nut.amount) / 4.184;
                return {
                  ...nut,
                  value: nut.value !== undefined ? convertedValue : undefined,
                  amount: nut.amount !== undefined ? convertedValue : undefined,
                  unitName: nut.unitName ? "kcal" : undefined,
                  nutrient: nut.nutrient
                    ? { ...nut.nutrient, unitName: "kcal" }
                    : undefined,
                };
              }
              return nut;
            })
            .filter(Boolean);
        }

        // Enriquecemos con información adicional de Wikipedia
        const cleanName = usdaData.description.split(",")[0];
        const wikiRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`,
        );

        let wikiJson = null;
        if (wikiRes.ok) {
          const data = await wikiRes.json();
          wikiJson = {
            extract: data.extract_html,
            image: data.thumbnail?.source,
            url: data.content_urls.desktop.page,
          };
        }

        detailsCache[foodId] = { usda: usdaData, wiki: wikiJson };

        setDetails(usdaData);
        setWikiData(wikiJson);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [foodId, cachedEntry]);

  return { details, wikiData, loading };
}
