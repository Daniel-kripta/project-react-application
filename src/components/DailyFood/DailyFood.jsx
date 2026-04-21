import { useDailyFoods } from "../../hooks/useDailyFoods";

export default function DailyFoods() {
  const { dailyFoods, loading } = useDailyFoods();

  if (loading) {
    return <p>Loading today's suggestions...</p>;
  }

  return (
    <section style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
      {dailyFoods.map((food) => (
        <div key={food.id} className="food-card" style={{ width: "150px", textAlign: "center" }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
          />
          <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>{food.name}</p>
        </div>
      ))}
    </section>
  );
}