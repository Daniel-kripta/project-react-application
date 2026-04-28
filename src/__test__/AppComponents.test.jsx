import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FoodCard from "../components/FoodCard/FoodCard";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

describe("Core Components Tests", () => {
  test("FoodCard should correctly render the food name and action button", () => {
    const mockFood = { fdcId: 999, description: "Test Banana" };

    render(
      <MemoryRouter>
        <FoodCard
          food={mockFood}
          actionButton={<button>Save to Context</button>}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Banana")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Save to Context/i }),
    ).toBeInTheDocument();
  });

  test("ErrorBoundary should catch errors and display the fallback UI", () => {
    const spy = vi.spyOn(console, "error");
    spy.mockImplementation(() => {});

    const BombComponent = () => {
      throw new Error("Triggered test error");
    };

    render(
      <ErrorBoundary>
        <BombComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    spy.mockRestore();
  });
});
