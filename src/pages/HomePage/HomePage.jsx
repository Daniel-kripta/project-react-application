import DailyFoods from "../../components/DailyFood/DailyFood";
import Hero from "../../components/Hero/Hero";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section>
        <h2>Featured Foods of the Day</h2>
        <DailyFoods />
      </section>
    </main>
  );
}