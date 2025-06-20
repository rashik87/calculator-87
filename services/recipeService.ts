import { FoodItem, RecipeIngredient, Macros } from '../types';

/**
 * Parses a serving size string to extract a gram value.
 * e.g., "100 جرام" -> 100, "1 بيضة (50g)" -> 50, "1 cup (approx 150g)" -> 150
 * @param servingSize The serving size string from FoodItem.
 * @returns The gram value, or null if not parseable.
 */
export function parseServingSizeToGrams(servingSize: string): number | null {
  if (!servingSize) return null;
  const gramMatch = servingSize.match(/(\d+(\.\d+)?)\s*(g|جرام|جم)/i);
  if (gramMatch && gramMatch[1]) {
    return parseFloat(gramMatch[1]);
  }
  // Try to match ml for liquids, assuming 1ml ~ 1g for common liquids like milk/water
  const mlMatch = servingSize.match(/(\d+(\.\d+)?)\s*ml/i);
  if (mlMatch && mlMatch[1]) {
    return parseFloat(mlMatch[1]); // Assuming 1ml ~ 1g
  }
  return null;
}

/**
 * Calculates the nutritional values for a given quantity of a food item.
 * @param foodItem The food item.
 * @param quantityGrams The desired quantity in grams.
 * @returns An object with calculated calories, protein, carbs, and fat, or null if calculation is not possible.
 */
export function calculateNutrientsForIngredientQuantity(
  foodItem: FoodItem,
  quantityGrams: number
): Omit<RecipeIngredient, 'foodItemId' | 'foodItemName' | 'quantityGram' | 'originalServingSize'> | null {
  const baseWeightGrams = parseServingSizeToGrams(foodItem.servingSize);

  if (baseWeightGrams === null || baseWeightGrams <= 0) {
    console.warn(`Cannot calculate nutrients for "${foodItem.name}". Its serving size "${foodItem.servingSize}" does not provide a parsable base weight in grams or is zero.`);
    return null;
  }

  // Nutrients per gram of the food item
  const caloriesPerGram = foodItem.calories / baseWeightGrams;
  const proteinPerGram = foodItem.protein / baseWeightGrams;
  const carbsPerGram = foodItem.carbs / baseWeightGrams;
  const fatPerGram = foodItem.fat / baseWeightGrams;

  return {
    calories: caloriesPerGram * quantityGrams,
    protein: proteinPerGram * quantityGrams,
    carbs: carbsPerGram * quantityGrams,
    fat: fatPerGram * quantityGrams,
  };
}

/**
 * Calculates total macros for a list of recipe ingredients.
 * @param ingredients Array of RecipeIngredient.
 * @returns Total Macros object.
 */
export function calculateTotalRecipeMacros(ingredients: RecipeIngredient[]): Macros {
  return ingredients.reduce(
    (totals, ing) => {
      totals.calories += ing.calories;
      totals.protein += ing.protein;
      totals.carbs += ing.carbs;
      totals.fat += ing.fat;
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/**
 * Calculates per-serving macros based on total macros and number of servings.
 * @param totalMacros The total macros for the recipe.
 * @param servings The number of servings.
 * @returns Macros per serving.
 */
export function calculatePerServingMacros(totalMacros: Macros, servings: number): Macros {
  if (servings <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  }
  return {
    calories: totalMacros.calories / servings,
    protein: totalMacros.protein / servings,
    carbs: totalMacros.carbs / servings,
    fat: totalMacros.fat / servings,
  };
}
