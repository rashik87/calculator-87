
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary', // جالس (مكتب)
  LIGHT = 'light',       // نشاط خفيف (1-3 أيام/أسبوع)
  MODERATE = 'moderate',   // نشاط معتدل (3-5 أيام/أسبوع)
  ACTIVE = 'active',       // نشاط عالي (6-7 أيام/أسبوع)
  VERY_ACTIVE = 'veryActive', // نشاط عالي جداً (رياضي محترف أو عمل بدني شاق)
}

export interface UserData { // Data for BMR/TDEE calculation
  gender: Gender;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
}

export enum DietProtocol {
  NONE = 'none',
  KETO = 'keto',
  CARB_CYCLING = 'carbCycling',
  INTERMITTENT_FASTING = 'intermittentFasting',
}

export enum Goal {
  LOSE_WEIGHT = 'loseWeight',
  MAINTAIN_WEIGHT = 'maintainWeight',
  GAIN_WEIGHT = 'gainWeight',
}

export interface GoalSettings {
  goal: Goal;
  modifier: number; // e.g., 0.10 for 10% deficit/surplus. 0 for maintain.
}

export interface Macros {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
}

export interface CarbCycleConfig {
  highCarbDays: number;
  mediumCarbDays: number;
  lowCarbDays: number;
}

export interface IntermittentFastingConfig {
  eatingWindowStart: string; // e.g., "12:00"
  eatingWindowEnd: string;   // e.g., "20:00"
}

export interface FoodItem {
  id: string;
  userId: string | null; // null for predefined, userId for custom
  name: string;
  calories: number; // per servingSize
  protein: number;  // grams per servingSize
  carbs: number;    // grams per servingSize
  fat: number;      // grams per servingSize
  servingSize: string; // e.g., "100g", "1 piece", "1 cup"
  isCustom: boolean; // True if added by the user
}

export interface RecipeIngredient {
  foodItemId: string; // ID from FoodItem
  foodItemName: string; // Name for display (denormalized for convenience)
  quantityGram: number; // Quantity in grams
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  originalServingSize: string; 
}

export interface Recipe {
  id: string;
  userId: string; // All recipes are user-specific
  name: string;
  description: string;
  imageUrl?: string; // Can be a URL or a base64 data URI
  ingredients: RecipeIngredient[]; 
  totalMacros: Macros; 
  servings: number; 
  perServingMacros: Macros;
  isCustom: true; // All recipes are custom
  createdAt: string; 
}

export interface PlannedRecipeMeal {
  id: string; 
  slotName: string; 
  assignedRecipeId: string | null;
  recipeSnapshot: {
      id: string; 
      name: string;
      perServingMacros: Macros; 
      ingredients: RecipeIngredient[]; 
      definedServingsInRecipe: number; 
  } | null;
  quantityOfRecipeServings: number; 
}

// Authentication Types
export interface SimulatedUser {
  id: string;
  email: string;
  // passwordHash is not stored on client, only used during registration/login check in authService
  isGoogleLogin?: boolean; 
}

export type AuthView = 'login' | 'register';

// Progress Tracking Types
export interface MeasurementDetails {
  neck?: number;    // cm
  waist?: number;   // cm, at navel
  hips?: number;    // cm, for females, at largest point
  thigh?: number;   // cm, optional
}

export interface WeightEntry {
  id: string;
  userId: string;
  date: string; // ISO string for date
  weight: number; // kg
  measurements: MeasurementDetails;
  bodyFatPercentage?: number; // Calculated using U.S. Navy method
  bodyFatMass?: number;       // kg
  leanMass?: number;          // kg
}

export interface BodyFatInputs {
    gender: Gender;
    heightCm: number;
    neckCm: number;
    waistCm: number;
    hipCm?: number; // Required for females
    weightKg: number; // Needed for fat mass and lean mass calculation
}

export interface BodyFatResult {
    percentage: number;
    category: string;
    fatMassKg?: number;
    leanMassKg?: number;
}


export type AppView = 
  | 'authGate' 
  | 'login'
  | 'register'
  | 'userDashboard' // Added new view
  | 'userInput' 
  | 'goalSelection' 
  | 'dietSelection' 
  | 'carbCycleSetup' 
  | 'intermittentFastingSetup' 
  | 'results'
  | 'foodDatabase'
  | 'recipeList'
  | 'recipeCreation'
  | 'recipeDetail'
  | 'recipeDrivenMealPlan'
  | 'progressTracking';