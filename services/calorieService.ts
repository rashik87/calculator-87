import { UserData, Gender, ActivityLevel, Macros, DietProtocol, CarbCycleConfig, Goal } from '../types';
import { 
  MACRO_DISTRIBUTIONS, 
  GRAMS_PER_CALORIE, 
  KETO_CARB_LIMIT_GRAMS,
  PROTEIN_PER_KG_LOSE_WEIGHT,
  FAT_PER_KG_LOSE_WEIGHT,
  PROTEIN_PER_KG_GAIN_WEIGHT,
  FAT_PER_KG_GAIN_WEIGHT
} from '../constants';

export const calculateBMR = (userData: UserData): number => {
  const { gender, age, height, weight } = userData;
  // Mifflin-St Jeor Equation
  if (gender === Gender.MALE) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const activityMultipliers: Record<ActivityLevel, number> = {
    [ActivityLevel.SEDENTARY]: 1.2,
    [ActivityLevel.LIGHT]: 1.375,
    [ActivityLevel.MODERATE]: 1.55,
    [ActivityLevel.ACTIVE]: 1.725,
    [ActivityLevel.VERY_ACTIVE]: 1.9,
  };
  return bmr * activityMultipliers[activityLevel];
};

export const calculateAdjustedTDEE = (
  baseTDEE: number,
  goal: Goal,
  modifier: number // 0 for maintain, positive for surplus (e.g., 0.1), negative for deficit (e.g., -0.1)
): number => {
  if (goal === Goal.LOSE_WEIGHT) {
    return baseTDEE * (1 - modifier);
  } else if (goal === Goal.GAIN_WEIGHT) {
    return baseTDEE * (1 + modifier);
  }
  return baseTDEE; // Maintain weight
};

const distributeMacrosByPercentage = (calories: number, distribution: { carbs: number; protein: number; fat: number }): Macros => {
  const carbsCalories = calories * distribution.carbs;
  const proteinCalories = calories * distribution.protein;
  const fatCalories = calories * distribution.fat;

  return {
    calories: Math.round(calories),
    carbs: Math.round(carbsCalories / GRAMS_PER_CALORIE.carbs),
    protein: Math.round(proteinCalories / GRAMS_PER_CALORIE.protein),
    fat: Math.round(fatCalories / GRAMS_PER_CALORIE.fat),
  };
};

export const calculateMacros = (
  targetCalories: number, // This is the (potentially adjusted) TDEE
  diet: DietProtocol,
  goal: Goal,
  userWeightKg: number,
  carbCycleDayType?: 'high' | 'medium' | 'low'
): Macros => {
  // 1. Diet-specific macro distributions take precedence (Keto, Carb Cycling)
  if (diet === DietProtocol.KETO) {
    return distributeMacrosByPercentage(targetCalories, MACRO_DISTRIBUTIONS[DietProtocol.KETO]);
  }
  if (diet === DietProtocol.CARB_CYCLING) {
    let distribution = MACRO_DISTRIBUTIONS.CARB_CYCLING_MEDIUM; // Default to medium
    if (carbCycleDayType === 'high') distribution = MACRO_DISTRIBUTIONS.CARB_CYCLING_HIGH;
    else if (carbCycleDayType === 'low') distribution = MACRO_DISTRIBUTIONS.CARB_CYCLING_LOW;
    return distributeMacrosByPercentage(targetCalories, distribution);
  }

  // 2. Goal-specific per-kg rules (for Lose/Gain when diet is not Keto/Carb Cycling)
  if (goal === Goal.LOSE_WEIGHT) {
    const proteinGrams = userWeightKg * PROTEIN_PER_KG_LOSE_WEIGHT;
    const fatGrams = userWeightKg * FAT_PER_KG_LOSE_WEIGHT;
    const proteinCalories = proteinGrams * GRAMS_PER_CALORIE.protein;
    const fatCalories = fatGrams * GRAMS_PER_CALORIE.fat;
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.max(0, carbCalories / GRAMS_PER_CALORIE.carbs); // Ensure carbs are not negative
    return {
      calories: Math.round(targetCalories),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
    };
  }

  if (goal === Goal.GAIN_WEIGHT) {
    const proteinGrams = userWeightKg * PROTEIN_PER_KG_GAIN_WEIGHT;
    const fatGrams = userWeightKg * FAT_PER_KG_GAIN_WEIGHT;
    const proteinCalories = proteinGrams * GRAMS_PER_CALORIE.protein;
    const fatCalories = fatGrams * GRAMS_PER_CALORIE.fat;
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.max(0, carbCalories / GRAMS_PER_CALORIE.carbs); // Ensure carbs are not negative
    return {
      calories: Math.round(targetCalories),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
    };
  }

  // 3. Default (Maintain Weight, or if goal is not Lose/Gain and diet is not Keto/CarbCycling, e.g., IF/None with Maintain)
  // This typically means DietProtocol.NONE or DietProtocol.INTERMITTENT_FASTING with Goal.MAINTAIN_WEIGHT
  return distributeMacrosByPercentage(targetCalories, MACRO_DISTRIBUTIONS.BALANCED);
};


export const getKetoCarbWarning = (calculatedCarbs: number): string | null => {
  if (calculatedCarbs > KETO_CARB_LIMIT_GRAMS) {
    return `تجاوز الحد المسموح للكربوهيدرات (${KETO_CARB_LIMIT_GRAMS} جم).`;
  }
  return null;
};