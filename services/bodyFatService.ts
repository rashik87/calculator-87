import { Gender, BodyFatInputs, BodyFatResult } from '../types';
import { BODY_FAT_CATEGORIES_MALE, BODY_FAT_CATEGORIES_FEMALE, BF_CALCULATION_ERROR_MESSAGE, HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE, BODY_FAT_INPUTS_REQUIRED } from '../constants';

// U.S. Navy Body Fat Formula
// All measurements in centimeters. Height in centimeters.
export const calculateNavyBodyFatPercentage = (
    gender: Gender,
    heightCm: number,
    neckCm: number,
    waistCm: number,
    hipCm?: number // Only for females
): number => {
    let percentage: number;

    if (heightCm <= 0 || neckCm <=0 || waistCm <=0) return NaN; 

    if (gender === Gender.MALE) {
        // Men: Percentage Fat = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
        if (waistCm - neckCm <= 0) { // Ensure waist - neck is positive for log10
            return NaN; 
        }
        percentage = 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
    } else { // FEMALE
        if (!hipCm || hipCm <= 0) {
            return NaN; // Hip measurement is crucial and must be positive for females
        }
        // Women: Percentage Fat = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
        if (waistCm + hipCm - neckCm <= 0) { // Ensure (waist + hip - neck) is positive
            return NaN; 
        }
        percentage = 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
    }
    
    const roundedPercentage = parseFloat(percentage.toFixed(1));

    if (isNaN(roundedPercentage)) return NaN; // Propagate if calculation resulted in NaN (e.g. from log10 of bad height after primary checks)
    
    return Math.max(0, Math.min(100, roundedPercentage)); // Clamp valid numbers between 0 and 100
};

export const getBodyFatCategory = (percentage: number, gender: Gender): string => {
    const categories = gender === Gender.MALE ? BODY_FAT_CATEGORIES_MALE : BODY_FAT_CATEGORIES_FEMALE;
    for (const key in categories) {
        if (percentage >= categories[key].min && percentage <= categories[key].max) {
            return categories[key].label;
        }
    }
    return "غير محدد";
};

export const calculateBodyFatDetails = (inputs: BodyFatInputs): BodyFatResult => {
    const { gender, heightCm, neckCm, waistCm, hipCm, weightKg } = inputs;

    // Check for missing height/gender (which should come from UserData) or essential measurements
    if (!heightCm || heightCm <=0 ) {
         return {
            percentage: 0,
            category: HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE,
            fatMassKg: undefined,
            leanMassKg: undefined,
        };
    }
    if (!neckCm || neckCm <=0 || !waistCm || waistCm <=0 || (gender === Gender.FEMALE && (!hipCm || hipCm <=0))) {
        return {
            percentage: 0,
            category: BODY_FAT_INPUTS_REQUIRED, 
            fatMassKg: undefined,
            leanMassKg: undefined,
        };
    }


    const percentage = calculateNavyBodyFatPercentage(gender, heightCm, neckCm, waistCm, hipCm);

    if (isNaN(percentage)) { // This handles cases where formula inputs were valid but calculation failed (e.g., waist < neck)
         return {
            percentage: 0, 
            category: BF_CALCULATION_ERROR_MESSAGE, // Generic error for formula logic issues
            fatMassKg: undefined,
            leanMassKg: undefined,
        };
    }

    const category = getBodyFatCategory(percentage, gender);

    let fatMassKg: number | undefined = undefined;
    let leanMassKg: number | undefined = undefined;

    if (weightKg && weightKg > 0 && percentage > 0) { // Ensure percentage is positive to calculate mass
        fatMassKg = parseFloat(((weightKg * percentage) / 100).toFixed(1));
        leanMassKg = parseFloat((weightKg - fatMassKg).toFixed(1));
    }

    return {
        percentage,
        category,
        fatMassKg,
        leanMassKg,
    };
};
