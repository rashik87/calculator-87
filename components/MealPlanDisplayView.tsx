
import React, { useMemo } from 'react';
// import { Meal, Macros } from '../types'; // Types might conflict if both active
// import { 
//   MEAL_PLAN_TITLE_MANUAL, EDIT_MEAL_BUTTON, CURRENT_DAILY_TOTAL_LABEL, TARGET_DAILY_NEEDS_LABEL,
//   DIFFERENCE_FROM_TARGET_LABEL, CREATE_INITIAL_MEAL_PLAN_BUTTON_MANUAL, NO_MEAL_PLAN_YET_MANUAL,
//   CALORIES_LABEL, PROTEIN_LABEL, CARBS_LABEL, FAT_LABEL, CALORIES_UNIT, PROTEIN_UNIT, CARBS_UNIT, FAT_UNIT,
//   CALCULATE_NEEDS_FIRST_PROMPT
// } from '../constants';

// interface MealPlanDisplayViewProps {
//   userTargetMacros: Macros | null;
//   currentMealPlan: Meal[] | null; // Old Meal type
//   onCreateInitialPlan: () => void;
//   onEditMeal: (meal: Meal) => void; // Old Meal type
//   onResetCalculator: () => void;
// }

// const MealCard: React.FC<{ meal: Meal; onEdit: () => void }> = ({ meal, onEdit }) => (
//   <div className="bg-card/90 p-3 sm:p-4 rounded-lg shadow-md border-s-4 border-primary mb-3 transition-shadow hover:shadow-lg">
//     <div className="flex justify-between items-center mb-2">
//       <h3 className="text-md sm:text-lg font-semibold text-primary-light">{meal.name}</h3>
//       <button 
//         onClick={onEdit}
//         className="text-xs sm:text-sm bg-secondary hover:bg-secondary-dark text-white py-1 px-3 rounded-md transition-colors shadow"
//         aria-label={`${EDIT_MEAL_BUTTON} ${meal.name}`}
//       >
//         {EDIT_MEAL_BUTTON}
//       </button>
//     </div>
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1 text-xs sm:text-sm">
//       <div><span className="font-medium text-textBase">{CALORIES_LABEL}: </span><span className="text-secondary-light">{meal.calories.toFixed(0)}</span></div>
//       <div><span className="font-medium text-textBase">{PROTEIN_LABEL}: </span><span className="text-secondary-light">{meal.protein.toFixed(1)}ج</span></div>
//       <div><span className="font-medium text-textBase">{CARBS_LABEL}: </span><span className="text-secondary-light">{meal.carbs.toFixed(1)}ج</span></div>
//       <div><span className="font-medium text-textBase">{FAT_LABEL}: </span><span className="text-secondary-light">{meal.fat.toFixed(1)}ج</span></div>
//     </div>
//   </div>
// );

// const MacroSummaryItem: React.FC<{ label: string; value: number; unit: string; colorClass?: string }> = ({ label, value, unit, colorClass = "text-secondary-light" }) => (
//   <p className="text-xs sm:text-sm">
//     <span className="font-medium text-textBase">{label}: </span>
//     <span className={`${colorClass} font-semibold`}>{value.toFixed(value % 1 === 0 ? 0 : 1)} {unit}</span>
//   </p>
// );

// const MealPlanDisplayView: React.FC<MealPlanDisplayViewProps> = ({
//   userTargetMacros,
//   currentMealPlan,
//   onCreateInitialPlan,
//   onEditMeal,
//   onResetCalculator,
// }) => {
//   const currentPlanTotals = useMemo((): Macros => {
//     if (!currentMealPlan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
//     return currentMealPlan.reduce(
//       (acc, meal) => {
//         acc.calories += meal.calories;
//         acc.protein += meal.protein;
//         acc.carbs += meal.carbs;
//         acc.fat += meal.fat;
//         return acc;
//       },
//       { calories: 0, protein: 0, carbs: 0, fat: 0 }
//     );
//   }, [currentMealPlan]);

//   const differenceFromTarget = useMemo((): Macros | null => {
//     if (!userTargetMacros) return null;
//     return {
//       calories: currentPlanTotals.calories - userTargetMacros.calories,
//       protein: currentPlanTotals.protein - userTargetMacros.protein,
//       carbs: currentPlanTotals.carbs - userTargetMacros.carbs,
//       fat: currentPlanTotals.fat - userTargetMacros.fat,
//     };
//   }, [currentPlanTotals, userTargetMacros]);

//   const getDifferenceColor = (value: number) => {
//     if (value > 5) return "text-accent"; 
//     if (value < -5) return "text-blue-400"; 
//     return "text-secondary"; 
//   };

//   if (!userTargetMacros) {
//     return (
//       <div className="w-full max-w-xl text-center p-6 bg-card/60 rounded-lg shadow-lg">
//         <h2 className="text-xl md:text-2xl font-semibold text-primary mb-4">{MEAL_PLAN_TITLE_MANUAL}</h2>
//         <p className="text-textMuted mb-4">{CALCULATE_NEEDS_FIRST_PROMPT}</p>
//         <button
//           onClick={onResetCalculator}
//           className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-md transition-colors duration-200 shadow hover:shadow-md"
//         >
//           الذهاب إلى حاسبة السعرات
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-2xl space-y-6">
//       <h2 className="text-xl md:text-2xl font-bold text-primary text-center">{MEAL_PLAN_TITLE_MANUAL}</h2>

//       <div className="p-4 bg-card/70 rounded-lg shadow-md space-y-3">
//         <div>
//           <h4 className="text-md sm:text-lg font-semibold text-primary mb-1">{TARGET_DAILY_NEEDS_LABEL}</h4>
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1">
//             <MacroSummaryItem label={CALORIES_LABEL} value={userTargetMacros.calories} unit={CALORIES_UNIT} />
//             <MacroSummaryItem label={PROTEIN_LABEL} value={userTargetMacros.protein} unit={PROTEIN_UNIT} />
//             <MacroSummaryItem label={CARBS_LABEL} value={userTargetMacros.carbs} unit={CARBS_UNIT} />
//             <MacroSummaryItem label={FAT_LABEL} value={userTargetMacros.fat} unit={FAT_UNIT} />
//           </div>
//         </div>
        
//         {currentMealPlan && (
//           <>
//             <div className="border-t border-primary/20 pt-3">
//               <h4 className="text-md sm:text-lg font-semibold text-primary mb-1">{CURRENT_DAILY_TOTAL_LABEL}</h4>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1">
//                 <MacroSummaryItem label={CALORIES_LABEL} value={currentPlanTotals.calories} unit={CALORIES_UNIT} />
//                 <MacroSummaryItem label={PROTEIN_LABEL} value={currentPlanTotals.protein} unit={PROTEIN_UNIT} />
//                 <MacroSummaryItem label={CARBS_LABEL} value={currentPlanTotals.carbs} unit={CARBS_UNIT} />
//                 <MacroSummaryItem label={FAT_LABEL} value={currentPlanTotals.fat} unit={FAT_UNIT} />
//               </div>
//             </div>

//             {differenceFromTarget && (
//               <div className="border-t border-primary/20 pt-3">
//                 <h4 className="text-md sm:text-lg font-semibold text-primary mb-1">{DIFFERENCE_FROM_TARGET_LABEL}</h4>
//                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1">
//                     <MacroSummaryItem label={CALORIES_LABEL} value={differenceFromTarget.calories} unit={CALORIES_UNIT} colorClass={getDifferenceColor(differenceFromTarget.calories)} />
//                     <MacroSummaryItem label={PROTEIN_LABEL} value={differenceFromTarget.protein} unit={PROTEIN_UNIT} colorClass={getDifferenceColor(differenceFromTarget.protein)} />
//                     <MacroSummaryItem label={CARBS_LABEL} value={differenceFromTarget.carbs} unit={CARBS_UNIT} colorClass={getDifferenceColor(differenceFromTarget.carbs)} />
//                     <MacroSummaryItem label={FAT_LABEL} value={differenceFromTarget.fat} unit={FAT_UNIT} colorClass={getDifferenceColor(differenceFromTarget.fat)} />
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {!currentMealPlan ? (
//         <div className="text-center p-4">
//           <p className="text-textMuted mb-4">{NO_MEAL_PLAN_YET_MANUAL}</p>
//           <button
//             onClick={onCreateInitialPlan}
//             className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-md transition-colors duration-200 shadow-lg hover:shadow-md"
//           >
//             {CREATE_INITIAL_MEAL_PLAN_BUTTON_MANUAL}
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 sm:pr-2">
//           {currentMealPlan.map(meal => (
//             <MealCard key={meal.id} meal={meal} onEdit={() => onEditMeal(meal)} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MealPlanDisplayView;

// This component is being phased out in favor of RecipeDrivenMealPlanView.
// Keeping the code commented out for now in case parts are needed or it's reinstated.
const MealPlanDisplayView_DEPRECATED = () => null;
export default MealPlanDisplayView_DEPRECATED;
