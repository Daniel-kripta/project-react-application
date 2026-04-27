import { render, screen, fireEvent } from "@testing-library/react";
import SaveButton from "../components/SaveButton/SaveButton";
import { SavedFoodProvider } from "../context/SavedFoodContext";

describe("SaveButton integration with SavedFoodContext", () => {
  test("toggles between Save and Saved on click", () => {
    const mockFood = {
      fdcId: 12345,
      description: "Test Food",
      foodNutrients: [],
      imagen: "https://via.placeholder.com/150",
    };

    render(
      <SavedFoodProvider>
        <SaveButton food={mockFood} />
      </SavedFoodProvider>
    );

    const saveButton = screen.getByRole("button", { name: /save/i });

    fireEvent.click(saveButton);
    expect(screen.getByRole("button", { name: /saved/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /saved/i }));
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});