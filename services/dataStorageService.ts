
import { FoodItem, Recipe, WeightEntry, UserData, GoalSettings, DietProtocol, Macros, CarbCycleConfig, IntermittentFastingConfig } from '../types';

// This service currently uses localStorage for data persistence.
// It's named generically to act as an abstraction layer.
// Future enhancements could involve replacing localStorage calls with
// API calls to a cloud-based storage solution like Google Drive.

const CUSTOM_FOODS_STORAGE_KEY_PREFIX = 'customFoodItems_user_';
const CUSTOM_RECIPES_STORAGE_KEY_PREFIX = 'customRecipes_user_';
const PROGRESS_ENTRIES_STORAGE_KEY_PREFIX = 'progressEntries_user_';
const CALCULATOR_STATE_STORAGE_KEY_PREFIX = 'calculatorState_user_';


// --- User-Specific Key Generation ---
const getFoodStorageKey = (userId: string) => `${CUSTOM_FOODS_STORAGE_KEY_PREFIX}${userId}`;
const getRecipeStorageKey = (userId: string) => `${CUSTOM_RECIPES_STORAGE_KEY_PREFIX}${userId}`;
const getProgressStorageKey = (userId: string) => `${PROGRESS_ENTRIES_STORAGE_KEY_PREFIX}${userId}`;
const getCalculatorStateKey = (userId: string) => `${CALCULATOR_STATE_STORAGE_KEY_PREFIX}${userId}`;

export interface StoredCalculatorState {
    userData: UserData;
    goalSettings: GoalSettings;
    selectedDiet: DietProtocol;
    initialTdee: number;
    finalTdee: number;
    userTargetMacros: Macros;
    carbCycleConfig: CarbCycleConfig | null;
    intermittentFastingConfig: IntermittentFastingConfig | null;
}

// --- Calculator State Persistence ---
// TODO: Replace with Google Drive API calls for cloud storage
export const saveCalculatorState = (userId: string, state: StoredCalculatorState): boolean => {
    if (!userId) return false;
    try {
        localStorage.setItem(getCalculatorStateKey(userId), JSON.stringify(state));
        return true;
    } catch (error) {
        console.error("Error saving calculator state for user to localStorage:", error);
        return false;
    }
};

// TODO: Replace with Google Drive API calls for cloud storage
export const getCalculatorState = (userId: string): StoredCalculatorState | null => {
    if (!userId) return null;
    try {
        const stateJson = localStorage.getItem(getCalculatorStateKey(userId));
        return stateJson ? JSON.parse(stateJson) : null;
    } catch (error) {
        console.error("Error retrieving calculator state for user from localStorage:", error);
        return null;
    }
};

// TODO: Replace with Google Drive API calls for cloud storage
export const clearCalculatorState = (userId: string): void => {
    if (!userId) return;
    try {
        localStorage.removeItem(getCalculatorStateKey(userId));
    } catch (error) {
        console.error("Error clearing calculator state for user from localStorage:", error);
    }
};


// --- Food Items ---
// TODO: Replace with Google Drive API calls for cloud storage
export const getCustomFoodItems = (userId: string): FoodItem[] => {
  if (!userId) return [];
  try {
    const itemsJson = localStorage.getItem(getFoodStorageKey(userId));
    return itemsJson ? JSON.parse(itemsJson) : [];
  } catch (error) {
    console.error("Error retrieving custom food items for user from localStorage:", error);
    return [];
  }
};

// TODO: Replace with Google Drive API calls for cloud storage
export const saveCustomFoodItems = (userId: string, items: FoodItem[]): boolean => {
  if (!userId) return false;
  try {
    localStorage.setItem(getFoodStorageKey(userId), JSON.stringify(items));
    return true;
  } catch (error) {
    console.error("Error saving custom food items for user to localStorage:", error);
    return false;
  }
};

// TODO: Replace with Google Drive API calls for cloud storage
export const addCustomFoodItem = (userId: string, newItemData: Omit<FoodItem, 'id' | 'isCustom' | 'userId'>): FoodItem | null => {
  if (!userId) return null;
  const currentItems = getCustomFoodItems(userId);
  const newItem: FoodItem = {
    ...newItemData,
    id: `custom_food_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`,
    isCustom: true,
    userId: userId,
  };
  const updatedItems = [...currentItems, newItem];
  if (saveCustomFoodItems(userId, updatedItems)) {
    return newItem;
  }
  return null;
};

// --- Recipes ---
// TODO: Replace with Google Drive API calls for cloud storage
export const getCustomRecipes = (userId: string): Recipe[] => {
  if (!userId) return [];
  try {
    const recipesJson = localStorage.getItem(getRecipeStorageKey(userId));
    return recipesJson ? JSON.parse(recipesJson) : [];
  } catch (error) {
    console.error("Error retrieving custom recipes for user from localStorage:", error);
    return [];
  }
};

// TODO: Replace with Google Drive API calls for cloud storage
export const saveCustomRecipes = (userId: string, recipes: Recipe[]): boolean => {
  if (!userId) return false;
  try {
    localStorage.setItem(getRecipeStorageKey(userId), JSON.stringify(recipes));
    return true;
  } catch (error) {
    console.error("Error saving custom recipes for user to localStorage:", error);
    return false;
  }
};

// TODO: Replace with Google Drive API calls for cloud storage
export const addCustomRecipe = (userId: string, newRecipeData: Omit<Recipe, 'id' | 'isCustom' | 'createdAt' | 'userId'>): Recipe | null => {
  if (!userId) return null;
  const currentRecipes = getCustomRecipes(userId);
  const newRecipe: Recipe = {
    ...newRecipeData,
    id: `custom_recipe_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`,
    isCustom: true,
    createdAt: new Date().toISOString(),
    userId: userId,
  };
  const updatedRecipes = [...currentRecipes, newRecipe];
  if (saveCustomRecipes(userId, updatedRecipes)) {
    return newRecipe;
  }
  return null;
};

// TODO: Replace with Google Drive API calls for cloud storage
export const updateCustomRecipe = (userId: string, updatedRecipe: Recipe): Recipe | null => {
  if (!userId || userId !== updatedRecipe.userId) return null; // Ensure recipe belongs to user
  const currentRecipes = getCustomRecipes(userId);
  const recipeIndex = currentRecipes.findIndex(r => r.id === updatedRecipe.id);
  if (recipeIndex === -1) {
    console.error("Recipe not found for update:", updatedRecipe.id);
    return null;
  }
  const updatedRecipes = [...currentRecipes];
  updatedRecipes[recipeIndex] = { ...updatedRecipe, createdAt: currentRecipes[recipeIndex].createdAt };
  
  if (saveCustomRecipes(userId, updatedRecipes)) {
    return updatedRecipe;
  }
  return null;
};

// TODO: Replace with Google Drive API calls for cloud storage
export const deleteCustomRecipe = (userId: string, recipeId: string): boolean => {
  if (!userId) return false;
  const currentRecipes = getCustomRecipes(userId);
  const updatedRecipes = currentRecipes.filter(r => r.id !== recipeId);
  if (currentRecipes.length === updatedRecipes.length) {
    console.warn("Recipe not found for deletion:", recipeId);
    return false; // Indicate recipe wasn't found or no change made
  }
  return saveCustomRecipes(userId, updatedRecipes);
};


// --- Progress Entries (Weight & Measurements) ---
// TODO: Replace with Google Drive API calls for cloud storage
export const getWeightEntries = (userId: string): WeightEntry[] => {
  if (!userId) return [];
  try {
    const entriesJson = localStorage.getItem(getProgressStorageKey(userId));
    const entries = entriesJson ? JSON.parse(entriesJson) : [];
    // Sort by date descending (newest first)
    return entries.sort((a: WeightEntry, b: WeightEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error retrieving weight entries for user from localStorage:", error);
    return [];
  }
};

// TODO: Replace with Google Drive API calls for cloud storage
export const saveWeightEntries = (userId: string, entries: WeightEntry[]): boolean => {
  if (!userId) return false;
  try {
    localStorage.setItem(getProgressStorageKey(userId), JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error("Error saving weight entries for user to localStorage:", error);
    return false;
  }
};

// TODO: Replace with Google Drive API calls for cloud storage
export const addWeightEntry = (userId: string, newEntryData: Omit<WeightEntry, 'id' | 'userId'>): WeightEntry | null => {
  if (!userId) return null;
  const currentEntries = getWeightEntries(userId);
  const newEntry: WeightEntry = {
    ...newEntryData,
    id: `weight_entry_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`,
    userId: userId,
  };
  const updatedEntries = [newEntry, ...currentEntries]; 
  updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (saveWeightEntries(userId, updatedEntries)) {
    return newEntry;
  }
  return null;
};

// TODO: Replace with Google Drive API calls for cloud storage
export const deleteWeightEntry = (userId: string, entryId: string): boolean => {
  if (!userId) return false;
  const currentEntries = getWeightEntries(userId);
  const updatedEntries = currentEntries.filter(e => e.id !== entryId);
  if (currentEntries.length === updatedEntries.length) {
    console.warn("Weight entry not found for deletion:", entryId);
    return false;
  }
  return saveWeightEntries(userId, updatedEntries);
};
