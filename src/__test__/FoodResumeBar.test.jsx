import { render, screen } from '@testing-library/react';
import FoodResumeBar from '../components/FoodResumeBar/FoodResumeBar';

describe('FoodResumeBar Component Tests', () => {

  test('should correctly render nutrient values from the search API structure', () => {
    const mockFoodFromSearch = {
      description: "Test Apple",
      foodNutrients: [
        { nutrientName: "Energy", value: 95, unitName: "kcal" },
        { nutrientName: "Protein", value: 0.5, unitName: "g" },
        { nutrientName: "Carbohydrate, by difference", value: 25, unitName: "g" }
      ]
    };

    render(<FoodResumeBar food={mockFoodFromSearch} />);


    expect(screen.getByText(/95/i)).toBeInTheDocument();
    expect(screen.getByText(/25/i)).toBeInTheDocument();
  });

  test('should correctly render nutrient values from the detail API structure', () => {
    const mockFoodFromDetail = {
      description: "Test Banana",
      foodNutrients: [
        { nutrient: { name: "Energy", unitName: "kcal" }, amount: 105 },
        { nutrient: { name: "Protein", unitName: "g" }, amount: 1.3 },
        { nutrient: { name: "Carbohydrate, by difference", unitName: "g" }, amount: 27 }
      ]
    };

    render(<FoodResumeBar food={mockFoodFromDetail} />);


    expect(screen.getByText(/105/i)).toBeInTheDocument();
    expect(screen.getByText(/27/i)).toBeInTheDocument();
  });


  test('should render 0 gracefully if a nutrient is missing', () => {
    const mockFoodMissingData = {
      description: "Test Water",
      foodNutrients: []
    };

    render(<FoodResumeBar food={mockFoodMissingData} />);

    const zeroValues = screen.getAllByText(/0/i);
    expect(zeroValues.length).toBeGreaterThan(0);
  });

});