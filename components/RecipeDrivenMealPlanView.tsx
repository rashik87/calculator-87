import React, { useMemo } from 'react';
import { PlannedRecipeMeal, Macros, RecipeIngredient } from '../types';
import {
  RECIPE_DRIVEN_MEAL_PLAN_TITLE, NUMBER_OF_MEALS_LABEL,
  ASSIGN_RECIPE_BUTTON, CHANGE_RECIPE_BUTTON, ADJUST_PLAN_TO_MACROS_BUTTON,
  TARGET_DAILY_NEEDS_LABEL, CALCULATE_NEEDS_FIRST_PROMPT,
  ADJUSTED_SERVINGS_LABEL, ADJUSTED_INGREDIENTS_LABEL, MIN_MEALS, MAX_MEALS,
  CALORIES_LABEL, PROTEIN_LABEL, CARBS_LABEL, FAT_LABEL,
  CALORIES_UNIT, PROTEIN_UNIT, CARBS_UNIT, FAT_UNIT, MEAL_NUMBER_INPUT_ERROR,
  PLAN_TOTALS_TITLE, PLAN_DIFFERENCE_TITLE, RECIPE_NOT_ASSIGNED, MEAL_SLOT_SETUP_TITLE
} from '../constants';

interface RecipeDrivenMealPlanViewProps {
  userTargetMacros: Macros | null;
  activePlan: PlannedRecipeMeal[] | null;
  numberOfMeals: number;
  onNumberOfMealsChange: (numMeals: number) => void;
  onOpenSelectRecipeModal: (mealSlotId: string) => void;
  onAdjustPlan: () => void;
  onUpdateRecipeServings: (mealSlotId: string, newServings: number) => void;
  onResetCalculator: () => void;
}

const MacroDisplay: React.FC<{ macros: Macros, title?: string, titleClass?: string }> = ({ macros, title, titleClass = "text-primary" }) => (
  <div className="p-3 bg-card/60 rounded-md shadow-sm">
    {title && <h4 className={`text-md font-semibold mb-2 ${titleClass}`}>{title}</h4>}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1 text-xs sm:text-sm">
      <p><strong className="text-textBase">{CALORIES_LABEL}:</strong> <span className="text-secondary">{macros.calories.toFixed(0)}</span> {CALORIES_UNIT}</p>
      <p><strong className="text-textBase">{PROTEIN_LABEL}:</strong> <span className="text-secondary">{macros.protein.toFixed(1)}</span> {PROTEIN_UNIT}</p>
      <p><strong className="text-textBase">{CARBS_LABEL}:</strong> <span className="text-secondary">{macros.carbs.toFixed(1)}</span> {CARBS_UNIT}</p>
      <p><strong className="text-textBase">{FAT_LABEL}:</strong> <span className="text-secondary">{macros.fat.toFixed(1)}</span> {FAT_UNIT}</p>
    </div>
  </div>
);

const RecipeDrivenMealPlanView: React.FC<RecipeDrivenMealPlanViewProps> = ({
  userTargetMacros,
  activePlan,
  numberOfMeals,
  onNumberOfMealsChange,
  onOpenSelectRecipeModal,
  onAdjustPlan,
  onUpdateRecipeServings,
  onResetCalculator,
}) => {

  const handleNumMealsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = numberOfMeals; // keep current if input is not a number
    else if (val < MIN_MEALS) val = MIN_MEALS;
    else if (val > MAX_MEALS) val = MAX_MEALS;
    onNumberOfMealsChange(val);
  };
  
  const currentPlanTotalMacros = useMemo((): Macros => {
    if (!activePlan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return activePlan.reduce((totals, meal) => {
      if (meal.recipeSnapshot) {
        totals.calories += meal.recipeSnapshot.perServingMacros.calories * meal.quantityOfRecipeServings;
        totals.protein += meal.recipeSnapshot.perServingMacros.protein * meal.quantityOfRecipeServings;
        totals.carbs += meal.recipeSnapshot.perServingMacros.carbs * meal.quantityOfRecipeServings;
        totals.fat += meal.recipeSnapshot.perServingMacros.fat * meal.quantityOfRecipeServings;
      }
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [activePlan]);

  const planDifferenceMacros = useMemo((): Macros | null => {
    if (!userTargetMacros) return null;
    return {
      calories: currentPlanTotalMacros.calories - userTargetMacros.calories,
      protein: currentPlanTotalMacros.protein - userTargetMacros.protein,
      carbs: currentPlanTotalMacros.carbs - userTargetMacros.carbs,
      fat: currentPlanTotalMacros.fat - userTargetMacros.fat,
    };
  }, [currentPlanTotalMacros, userTargetMacros]);

  if (!userTargetMacros) {
    return (
      <div className="w-full max-w-xl text-center p-6 bg-card/70 rounded-lg shadow-xl">
        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">{RECIPE_DRIVEN_MEAL_PLAN_TITLE}</h2>
        <p className="text-textMuted mb-4">{CALCULATE_NEEDS_FIRST_PROMPT}</p>
        <button
          onClick={onResetCalculator}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-md transition-colors duration-200 shadow hover:shadow-md"
        >
          الذهاب إلى حاسبة السعرات
        </button>
      </div>
    );
  }

  const inputClass = "bg-card border border-primary/30 text-textBase rounded-md p-2 focus:ring-1 focus:ring-primary focus:border-primary outline-none shadow-sm text-sm";
  const buttonClass = "bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-3 rounded-md transition-colors duration-150 shadow text-xs sm:text-sm";
  const secondaryButtonClass = "bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-3 rounded-md transition-colors duration-150 shadow text-xs sm:text-sm";
  
  return (
    <div className="w-full max-w-3xl space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">{RECIPE_DRIVEN_MEAL_PLAN_TITLE}</h2>

      {/* Target Macros Display */}
      <MacroDisplay macros={userTargetMacros} title={TARGET_DAILY_NEEDS_LABEL} />

      {/* Number of Meals Input */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-4 bg-card/70 rounded-lg shadow-md">
        <label htmlFor="numberOfMeals" className="text-md font-medium text-textBase whitespace-nowrap">{NUMBER_OF_MEALS_LABEL}:</label>
        <input
          type="number"
          id="numberOfMeals"
          value={numberOfMeals}
          onChange={handleNumMealsChange}
          min={MIN_MEALS}
          max={MAX_MEALS}
          className={`${inputClass} w-20 text-center`}
        />
        {(numberOfMeals < MIN_MEALS || numberOfMeals > MAX_MEALS) && <p className="text-accent text-xs">{MEAL_NUMBER_INPUT_ERROR}</p>}
        <button onClick={onAdjustPlan} className={`${buttonClass} w-full sm:w-auto mt-2 sm:mt-0`}>
          {ADJUST_PLAN_TO_MACROS_BUTTON}
        </button>
      </div>
      
      {/* Meal Slots Setup */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">{MEAL_SLOT_SETUP_TITLE}</h3>
        {activePlan && activePlan.map((mealSlot) => {
          const mealMacros: Macros = mealSlot.recipeSnapshot 
            ? {
                calories: mealSlot.recipeSnapshot.perServingMacros.calories * mealSlot.quantityOfRecipeServings,
                protein: mealSlot.recipeSnapshot.perServingMacros.protein * mealSlot.quantityOfRecipeServings,
                carbs: mealSlot.recipeSnapshot.perServingMacros.carbs * mealSlot.quantityOfRecipeServings,
                fat: mealSlot.recipeSnapshot.perServingMacros.fat * mealSlot.quantityOfRecipeServings,
              }
            : { calories: 0, protein: 0, carbs: 0, fat: 0 };

          return (
            <div key={mealSlot.id} className="p-3 sm:p-4 bg-card/80 rounded-lg shadow-lg border-l-4 border-primary">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
                <h4 className="text-lg font-semibold text-primary-light">{mealSlot.slotName}</h4>
                <button 
                  onClick={() => onOpenSelectRecipeModal(mealSlot.id)}
                  className={secondaryButtonClass}
                >
                  {mealSlot.assignedRecipeId ? CHANGE_RECIPE_BUTTON : ASSIGN_RECIPE_BUTTON}
                </button>
              </div>

              {mealSlot.recipeSnapshot ? (
                <div className="space-y-3">
                  <p className="text-md font-medium text-textBase">الوصفة: <span className="text-secondary-light">{mealSlot.recipeSnapshot.name}</span></p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <label htmlFor={`servings-${mealSlot.id}`} className="text-sm text-textMuted whitespace-nowrap">{ADJUSTED_SERVINGS_LABEL}:</label>
                    <input 
                      type="number" 
                      id={`servings-${mealSlot.id}`}
                      value={mealSlot.quantityOfRecipeServings.toFixed(2)} // Display with 2 decimal places
                      onChange={(e) => onUpdateRecipeServings(mealSlot.id, parseFloat(e.target.value) || 0)}
                      className={`${inputClass} w-24 text-center`}
                      step="0.1"
                      min="0.1"
                    />
                  </div>
                  
                  <MacroDisplay macros={mealMacros} />

                  <div>
                    <h5 className="text-sm font-semibold text-textBase mt-2 mb-1">{ADJUSTED_INGREDIENTS_LABEL}</h5>
                    <ul className="list-disc ps-5 space-y-1 text-xs text-textMuted max-h-32 overflow-y-auto">
                      {mealSlot.recipeSnapshot.ingredients.map(ing => {
                        const adjustedQuantity = (ing.quantityGram / mealSlot.recipeSnapshot!.definedServingsInRecipe) * mealSlot.quantityOfRecipeServings;
                        return (
                          <li key={ing.foodItemId + ing.foodItemName}>
                            {ing.foodItemName}: {adjustedQuantity.toFixed(1)} جرام
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-textMuted text-sm italic">{RECIPE_NOT_ASSIGNED}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Plan Totals and Difference */}
      {activePlan && activePlan.length > 0 && (
         <div className="space-y-3 mt-6 p-4 bg-card/70 rounded-lg shadow-md">
            <MacroDisplay macros={currentPlanTotalMacros} title={PLAN_TOTALS_TITLE} titleClass="text-primary-light"/>
            {planDifferenceMacros && (
                <div className="border-t border-primary/20 pt-3">
                    <h4 className="text-md font-semibold text-accent mb-2">{PLAN_DIFFERENCE_TITLE}</h4>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1 text-xs sm:text-sm">
                        <p><strong className="text-textBase">{CALORIES_LABEL}:</strong> <span className={planDifferenceMacros.calories >= 0 ? 'text-green-400' : 'text-red-400'}>{planDifferenceMacros.calories.toFixed(0)}</span> {CALORIES_UNIT}</p>
                        <p><strong className="text-textBase">{PROTEIN_LABEL}:</strong> <span className={planDifferenceMacros.protein >= 0 ? 'text-green-400' : 'text-red-400'}>{planDifferenceMacros.protein.toFixed(1)}</span> {PROTEIN_UNIT}</p>
                        <p><strong className="text-textBase">{CARBS_LABEL}:</strong> <span className={planDifferenceMacros.carbs >= 0 ? 'text-green-400' : 'text-red-400'}>{planDifferenceMacros.carbs.toFixed(1)}</span> {CARBS_UNIT}</p>
                        <p><strong className="text-textBase">{FAT_LABEL}:</strong> <span className={planDifferenceMacros.fat >= 0 ? 'text-green-400' : 'text-red-400'}>{planDifferenceMacros.fat.toFixed(1)}</span> {FAT_UNIT}</p>
                    </div>
                </div>
            )}
         </div>
      )}
    </div>
  );
};

export default RecipeDrivenMealPlanView;