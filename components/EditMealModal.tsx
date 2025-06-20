
import React, { useState, useEffect } from 'react';
// import { Meal } from '../types'; // Old Meal type
// import { 
//   EDIT_MEAL_MODAL_TITLE_MANUAL, MEAL_NAME_LABEL, CALORIES_LABEL, PROTEIN_LABEL, CARBS_LABEL, FAT_LABEL, 
//   SAVE_MEAL_CHANGES_BUTTON, CANCEL_BUTTON, MEAL_MACROS_INPUT_ERROR, MEAL_NAME_REQUIRED
// } from '../constants';

// interface EditMealModalProps {
//   meal: Meal; // Old Meal type
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (updatedMeal: Meal) => void; // Old Meal type
// }

// type MealFormData = {
//   name: string;
//   calories: string;
//   protein: string;
//   carbs: string;
//   fat: string;
// };

// type FormErrors = Partial<Record<keyof MealFormData, string>>;

// const EditMealModal: React.FC<EditMealModalProps> = ({ meal, isOpen, onClose, onSave }) => {
//   const [formData, setFormData] = useState<MealFormData>({
//     name: meal.name,
//     calories: meal.calories.toString(),
//     protein: meal.protein.toString(),
//     carbs: meal.carbs.toString(),
//     fat: meal.fat.toString(),
//   });
//   const [errors, setErrors] = useState<FormErrors>({});

//   useEffect(() => {
//     setFormData({
//       name: meal.name,
//       calories: meal.calories.toString(),
//       protein: meal.protein.toString(),
//       carbs: meal.carbs.toString(),
//       fat: meal.fat.toString(),
//     });
//     setErrors({});
//   }, [meal, isOpen]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name as keyof MealFormData]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const validate = (): boolean => {
//     const newErrors: FormErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = MEAL_NAME_REQUIRED;
//     }

//     const numericFields: (keyof MealFormData)[] = ['calories', 'protein', 'carbs', 'fat'];
//     let hasNumericError = false;
//     numericFields.forEach(field => {
//       const val = parseFloat(formData[field]);
//       if (isNaN(val) || val < 0) {
//         hasNumericError = true;
//       }
//     });
//     if (hasNumericError) {
//         if (!newErrors.calories && !newErrors.protein && !newErrors.carbs && !newErrors.fat) {
//              newErrors.calories = MEAL_MACROS_INPUT_ERROR; 
//         }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validate()) {
//       onSave({
//         ...meal, 
//         name: formData.name.trim(),
//         calories: parseFloat(formData.calories),
//         protein: parseFloat(formData.protein),
//         carbs: parseFloat(formData.carbs),
//         fat: parseFloat(formData.fat),
//       });
//     }
//   };

//   if (!isOpen) return null;

//   const inputClass = "w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm";
//   const labelClass = "block text-sm font-medium text-textBase mb-1";

//   return (
//     <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="edit-meal-title">
//       <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto ring-1 ring-primary/20">
//         <h2 id="edit-meal-title" className="text-xl font-semibold text-primary mb-4">{EDIT_MEAL_MODAL_TITLE_MANUAL} - {meal.name}</h2>
        
//         <div>
//           <label htmlFor="mealName" className={labelClass}>{MEAL_NAME_LABEL}</label>
//           <input type="text" id="mealName" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
//           {errors.name && <p className="text-accent text-xs mt-1">{errors.name}</p>}
//         </div>

//         <div>
//           <label htmlFor="mealCalories" className={labelClass}>{CALORIES_LABEL}</label>
//           <input type="number" id="mealCalories" name="calories" value={formData.calories} onChange={handleChange} className={inputClass} step="any" min="0"/>
//           {errors.calories && <p className="text-accent text-xs mt-1">{errors.calories}</p>}
//         </div>

//         <div>
//           <label htmlFor="mealProtein" className={labelClass}>{PROTEIN_LABEL}</label>
//           <input type="number" id="mealProtein" name="protein" value={formData.protein} onChange={handleChange} className={inputClass} step="any" min="0"/>
//           {errors.protein && !errors.calories && <p className="text-accent text-xs mt-1">{MEAL_MACROS_INPUT_ERROR}</p>}
//         </div>

//         <div>
//           <label htmlFor="mealCarbs" className={labelClass}>{CARBS_LABEL}</label>
//           <input type="number" id="mealCarbs" name="carbs" value={formData.carbs} onChange={handleChange} className={inputClass} step="any" min="0"/>
//           {errors.carbs && !errors.calories && <p className="text-accent text-xs mt-1">{MEAL_MACROS_INPUT_ERROR}</p>}
//         </div>

//         <div>
//           <label htmlFor="mealFat" className={labelClass}>{FAT_LABEL}</label>
//           <input type="number" id="mealFat" name="fat" value={formData.fat} onChange={handleChange} className={inputClass} step="any" min="0"/>
//           {errors.fat && !errors.calories && <p className="text-accent text-xs mt-1">{MEAL_MACROS_INPUT_ERROR}</p>}
//         </div>

//         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 rtl:sm:space-x-reverse pt-4">
//           <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 shadow hover:shadow-md">
//             {SAVE_MEAL_CHANGES_BUTTON}
//           </button>
//           <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 text-textBase font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 shadow hover:shadow-md">
//             {CANCEL_BUTTON}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditMealModal;

// This component is being phased out in favor of recipe-driven meal planning.
// Keeping the code commented out for now.
const EditMealModal_DEPRECATED = () => null;
export default EditMealModal_DEPRECATED;
