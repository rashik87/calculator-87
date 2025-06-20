
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Recipe, RecipeIngredient, FoodItem, Macros } from '../types';
import {
  calculateNutrientsForIngredientQuantity,
  calculateTotalRecipeMacros,
  calculatePerServingMacros,
  parseServingSizeToGrams,
} from '../services/recipeService';
import {
  ADD_RECIPE_TITLE, EDIT_RECIPE_TITLE, RECIPE_NAME_LABEL, RECIPE_DESCRIPTION_LABEL,
  RECIPE_IMAGE_LABEL, UPLOAD_IMAGE_BUTTON, CHANGE_IMAGE_BUTTON, REMOVE_IMAGE_BUTTON, IMAGE_PREVIEW_ALT, IMAGE_UPLOAD_NOTE, ERROR_IMAGE_UPLOAD_SIZE, ERROR_IMAGE_UPLOAD_TYPE, ERROR_IMAGE_LOAD_PREVIEW,
  RECIPE_SERVINGS_LABEL, ADD_INGREDIENT_BUTTON, INGREDIENTS_LABEL,
  INGREDIENT_FOOD_ITEM_LABEL, INGREDIENT_QUANTITY_GRAM_LABEL, TOTAL_RECIPE_MACROS_LABEL,
  PER_SERVING_MACROS_LABEL, SAVE_RECIPE_BUTTON, CANCEL_BUTTON, REMOVE_INGREDIENT_LABEL,
  REQUIRED_FIELD_ERROR, RECIPE_SERVINGS_POSITIVE, RECIPE_INGREDIENTS_REQUIRED,
  INGREDIENT_QUANTITY_POSITIVE, NO_VALID_FOOD_ITEMS_FOR_RECIPE, ERROR_INGREDIENT_NO_GRAMS,
  CALORIES_LABEL, PROTEIN_LABEL, CARBS_LABEL, FAT_LABEL, SELECT_INGREDIENT_PLACEHOLDER,
  CALORIES_UNIT, PROTEIN_UNIT, CARBS_UNIT, FAT_UNIT, IMAGE_URL_INPUT_PLACEHOLDER,
} from '../constants';

const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface RecipeCreationViewProps {
  allFoodItems: FoodItem[];
  onSaveRecipe: (recipe: Recipe | Omit<Recipe, 'id' | 'isCustom' | 'createdAt' | 'userId'>) => void;
  onCancel: () => void;
  existingRecipe?: Recipe | null;
}

type RecipeFormData = {
  name: string;
  description: string;
  servings: string;
  // imageUrl will store the data URI or external URL
};

type FormErrors = {
  name?: string;
  servings?: string;
  ingredients?: string;
  general?: string;
  image?: string; // For image-specific errors (size, type)
};

const RecipeCreationView: React.FC<RecipeCreationViewProps> = ({
  allFoodItems,
  onSaveRecipe,
  onCancel,
  existingRecipe,
}) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: existingRecipe?.name || '',
    description: existingRecipe?.description || '',
    servings: existingRecipe?.servings?.toString() || '1',
  });
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(existingRecipe?.imageUrl || null);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(existingRecipe?.ingredients || []);
  const [totalMacros, setTotalMacros] = useState<Macros>(existingRecipe?.totalMacros || { calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [perServingMacros, setPerServingMacros] = useState<Macros>(existingRecipe?.perServingMacros || { calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const availableFoodItems = useMemo(() => {
    return allFoodItems.filter(item => parseServingSizeToGrams(item.servingSize) !== null);
  }, [allFoodItems]);

  useEffect(() => {
    setFormData({
        name: existingRecipe?.name || '',
        description: existingRecipe?.description || '',
        servings: existingRecipe?.servings?.toString() || '1',
    });
    setImageDataUrl(existingRecipe?.imageUrl || null);
    setIngredients(existingRecipe?.ingredients || []);
    setErrors({});
    setImagePreviewError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  }, [existingRecipe]);


  useEffect(() => {
    const currentTotalMacros = calculateTotalRecipeMacros(ingredients);
    setTotalMacros(currentTotalMacros);
    const currentServings = parseInt(formData.servings, 10) || 1;
    setPerServingMacros(calculatePerServingMacros(currentTotalMacros, currentServings));
  }, [ingredients, formData.servings]);

  useEffect(() => {
    setImagePreviewError(false); 
    if (errors.image) {
        setErrors(prev => ({...prev, image: undefined}));
    }
  }, [imageDataUrl]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setErrors(prev => ({ ...prev, image: ERROR_IMAGE_UPLOAD_SIZE(MAX_IMAGE_SIZE_MB) }));
        setImageDataUrl(null); // Clear previous valid image if any
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
        return;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: ERROR_IMAGE_UPLOAD_TYPE }));
        setImageDataUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setErrors(prev => ({ ...prev, image: undefined })); // Clear any previous image errors
      setImagePreviewError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUrl(reader.result as string);
      };
      reader.onerror = () => {
        setImagePreviewError(true);
        setImageDataUrl(null);
        setErrors(prev => ({ ...prev, image: ERROR_IMAGE_LOAD_PREVIEW }));
      }
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImageDataUrl(null);
    setImagePreviewError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    setErrors(prev => ({ ...prev, image: undefined }));
  };

  const handleAddIngredient = () => {
    if (availableFoodItems.length === 0) {
      setErrors(prev => ({ ...prev, ingredients: NO_VALID_FOOD_ITEMS_FOR_RECIPE }));
      return;
    }
    const firstAvailableFoodItem = availableFoodItems[0];
    const nutrients = calculateNutrientsForIngredientQuantity(firstAvailableFoodItem, 100); 

    if (nutrients) {
      setIngredients(prev => [
        ...prev,
        {
          foodItemId: firstAvailableFoodItem.id,
          foodItemName: firstAvailableFoodItem.name,
          quantityGram: 100, 
          originalServingSize: firstAvailableFoodItem.servingSize,
          ...nutrients,
        },
      ]);
      if (errors.ingredients) setErrors(prev => ({ ...prev, ingredients: undefined }));
    } else {
       setErrors(prev => ({ ...prev, ingredients: ERROR_INGREDIENT_NO_GRAMS }));
    }
  };

  const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    setIngredients(prevIngredients => {
      const newIngredients = [...prevIngredients];
      const ingredient = { ...newIngredients[index] };

      if (field === 'foodItemId') {
        const foodItem = allFoodItems.find(fi => fi.id === value);
        if (foodItem) {
          ingredient.foodItemId = foodItem.id;
          ingredient.foodItemName = foodItem.name;
          ingredient.originalServingSize = foodItem.servingSize;
          const nutrients = calculateNutrientsForIngredientQuantity(foodItem, ingredient.quantityGram);
          if (nutrients) {
            ingredient.calories = nutrients.calories;
            ingredient.protein = nutrients.protein;
            ingredient.carbs = nutrients.carbs;
            ingredient.fat = nutrients.fat;
             if (errors.ingredients) setErrors(prev => ({ ...prev, ingredients: undefined }));
          } else {
             setErrors(prev => ({ ...prev, ingredients: `${ERROR_INGREDIENT_NO_GRAMS} (${foodItem.name})` }));
          }
        }
      } else if (field === 'quantityGram') {
        const quantity = parseFloat(value as string) || 0;
        ingredient.quantityGram = quantity;
        const foodItem = allFoodItems.find(fi => fi.id === ingredient.foodItemId);
        if (foodItem) {
          const nutrients = calculateNutrientsForIngredientQuantity(foodItem, quantity);
          if (nutrients) {
            ingredient.calories = nutrients.calories;
            ingredient.protein = nutrients.protein;
            ingredient.carbs = nutrients.carbs;
            ingredient.fat = nutrients.fat;
          }
        }
      }
      newIngredients[index] = ingredient;
      return newIngredients;
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = REQUIRED_FIELD_ERROR;
    
    const servingsNum = parseInt(formData.servings, 10);
    if (isNaN(servingsNum) || servingsNum <= 0) {
      newErrors.servings = RECIPE_SERVINGS_POSITIVE;
    }
    if (ingredients.length === 0) {
      newErrors.ingredients = RECIPE_INGREDIENTS_REQUIRED;
    }
    let ingredientErrors: string[] = [];
    ingredients.forEach((ing, index) => {
        if(ing.quantityGram <= 0) {
            ingredientErrors.push(`كمية المكون '${ing.foodItemName}' (رقم ${index + 1}) ${INGREDIENT_QUANTITY_POSITIVE}`);
        }
        if(!parseServingSizeToGrams(ing.originalServingSize)){
             ingredientErrors.push(`مكون '${ing.foodItemName}' (رقم ${index + 1}) ${ERROR_INGREDIENT_NO_GRAMS}`);
        }
    });
    if(ingredientErrors.length > 0) {
        newErrors.ingredients = ingredientErrors.join(' | ');
    }
    // Image URL is now imageDataUrl and its validation is handled during file selection/URL input
    // If an external URL was typed and failed to load, imagePreviewError would be true.
    // If it's a base64, it's generally valid if it got to imageDataUrl state.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !errors.image; // Also check existing image errors
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const recipeData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: imageDataUrl || undefined, // Use imageDataUrl (can be base64 or external link)
        servings: parseInt(formData.servings, 10),
        ingredients,
        totalMacros,
        perServingMacros,
      };
      
      if(existingRecipe){
        onSaveRecipe({ ...existingRecipe, ...recipeData });
      } else {
        onSaveRecipe(recipeData as Omit<Recipe, 'id' | 'isCustom' | 'createdAt' | 'userId'>);
      }
    }
  };
  
  const inputClass = "w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm";
  const labelClass = "block text-sm font-medium text-textBase mb-1";
  const buttonClass = "bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 shadow hover:shadow-md";
  const smallButtonClass = "text-xs bg-primary/80 hover:bg-primary text-white font-medium py-1 px-2.5 rounded-md transition-colors duration-150 shadow";


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 bg-card/80 p-4 sm:p-6 rounded-lg shadow-xl ring-1 ring-primary/20">
      <h2 className="text-xl md:text-2xl font-bold text-primary text-center">
        {existingRecipe ? EDIT_RECIPE_TITLE : ADD_RECIPE_TITLE}
      </h2>

      {errors.general && <p className="text-accent text-sm p-2 bg-accent/20 rounded-md">{errors.general}</p>}

      <div>
        <label htmlFor="name" className={labelClass}>{RECIPE_NAME_LABEL}</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className={inputClass} />
        {errors.name && <p className="text-accent text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>{RECIPE_DESCRIPTION_LABEL}</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleFormChange} className={inputClass} rows={3}></textarea>
      </div>

      {/* Image Upload/URL Section */}
      <div>
        <label className={labelClass}>{RECIPE_IMAGE_LABEL}</label>
        {imageDataUrl && !imagePreviewError ? (
          <div className="mt-2 space-y-2">
            <img 
              src={imageDataUrl} 
              alt={IMAGE_PREVIEW_ALT} 
              className="rounded-md max-h-48 w-auto object-contain border border-primary/20 shadow-sm" 
              onError={() => {
                // This error might happen if imageDataUrl was an external link that became invalid
                // Or if base64 data got corrupted somehow (less likely)
                setImagePreviewError(true);
                // Don't clear imageDataUrl here as it might be an external link they want to fix
                setErrors(prev => ({...prev, image: ERROR_IMAGE_LOAD_PREVIEW}));
              }}
            />
            <div className="flex gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className={smallButtonClass}>
                    {CHANGE_IMAGE_BUTTON}
                </button>
                <button type="button" onClick={handleRemoveImage} className={`${smallButtonClass} bg-accent/80 hover:bg-accent`}>
                    {REMOVE_IMAGE_BUTTON}
                </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => fileInputRef.current?.click()} className={`${buttonClass} w-auto`}>
            {UPLOAD_IMAGE_BUTTON}
          </button>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageFileChange} 
          accept="image/png, image/jpeg, image/gif, image/webp" 
          className="hidden" 
          aria-label={RECIPE_IMAGE_LABEL}
        />
        <p className="text-xs text-textMuted mt-1">{IMAGE_UPLOAD_NOTE}</p>
        {errors.image && <p className="text-accent text-xs mt-1">{errors.image}</p>}
        {imagePreviewError && !errors.image && ( // Show generic load error if no specific validation error
             <div className="mt-1 p-1 text-xs text-accent bg-accent/10 rounded-md border border-accent/30">
                {ERROR_IMAGE_LOAD_PREVIEW}
            </div>
        )}
         {/* Optional: Allow pasting external URL as a fallback or alternative */}
        <div className="mt-2">
             <label htmlFor="imageUrlExternal" className="text-xs text-textMuted">{IMAGE_URL_INPUT_PLACEHOLDER}:</label>
            <input 
                type="url" 
                id="imageUrlExternal"
                placeholder="https://example.com/image.jpg"
                className={`${inputClass} text-sm mt-0.5 p-2`}
                value={imageDataUrl && (imageDataUrl.startsWith('http://') || imageDataUrl.startsWith('https://')) ? imageDataUrl : ''}
                onChange={(e) => {
                    const url = e.target.value;
                    if (url.trim() === '') {
                        handleRemoveImage(); // If they clear the URL field
                    } else {
                        setImageDataUrl(url); // Allow typing/pasting a URL
                        setImagePreviewError(false); // Assume it might load, onError will catch it
                        setErrors(prev => ({ ...prev, image: undefined })); // Clear file-specific errors
                    }
                }}
            />
        </div>
      </div>


      <div>
        <label htmlFor="servings" className={labelClass}>{RECIPE_SERVINGS_LABEL}</label>
        <input type="number" id="servings" name="servings" value={formData.servings} onChange={handleFormChange} className={inputClass} min="1" step="1" />
        {errors.servings && <p className="text-accent text-xs mt-1">{errors.servings}</p>}
      </div>

      <div className="space-y-4 p-3 sm:p-4 border border-primary/20 rounded-lg bg-card/50">
        <h3 className="text-lg font-semibold text-primary">{INGREDIENTS_LABEL}</h3>
        {errors.ingredients && <p className="text-accent text-xs mb-2 p-2 bg-accent/20 rounded-md whitespace-pre-wrap">{errors.ingredients}</p>}
        {ingredients.map((ing, index) => (
          <div key={index} className="p-3 bg-card/70 rounded-md space-y-2 border-s-4 border-primary/50 shadow-sm">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-textBase">المكون #{index + 1}</p>
                <button type="button" onClick={() => handleRemoveIngredient(index)} 
                        className="text-accent hover:text-accent-dark text-sm font-bold"
                        aria-label={`${REMOVE_INGREDIENT_LABEL} ${ing.foodItemName || `المكون رقم ${index+1}`}`}>
                  &times;
                </button>
            </div>
            <div>
              <label htmlFor={`ingredientFoodItem-${index}`} className={labelClass}>{INGREDIENT_FOOD_ITEM_LABEL}</label>
              <select 
                id={`ingredientFoodItem-${index}`} 
                value={ing.foodItemId} 
                onChange={(e) => handleIngredientChange(index, 'foodItemId', e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>{SELECT_INGREDIENT_PLACEHOLDER}</option>
                {availableFoodItems.map(fi => (
                  <option key={fi.id} value={fi.id}>{fi.name} ({fi.servingSize})</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`ingredientQuantity-${index}`} className={labelClass}>{INGREDIENT_QUANTITY_GRAM_LABEL}</label>
              <input 
                type="number" 
                id={`ingredientQuantity-${index}`} 
                value={ing.quantityGram} 
                onChange={(e) => handleIngredientChange(index, 'quantityGram', e.target.value)}
                className={inputClass}
                min="0.1" 
                step="any"
              />
            </div>
            <div className="text-xs text-textMuted pt-1 border-t border-primary/10">
              <span>{CALORIES_LABEL}: {ing.calories.toFixed(0)}, </span>
              <span>{PROTEIN_LABEL}: {ing.protein.toFixed(1)}ج, </span>
              <span>{CARBS_LABEL}: {ing.carbs.toFixed(1)}ج, </span>
              <span>{FAT_LABEL}: {ing.fat.toFixed(1)}ج</span>
            </div>
          </div>
        ))}
        {availableFoodItems.length > 0 ? (
          <button type="button" onClick={handleAddIngredient} className={`${buttonClass} w-full mt-2 bg-secondary hover:bg-secondary-dark text-white`}>
            {ADD_INGREDIENT_BUTTON}
          </button>
        ) : (
          <p className="text-sm text-textMuted text-center p-2 bg-card/30 rounded-md">{NO_VALID_FOOD_ITEMS_FOR_RECIPE}</p>
        )}
      </div>

      <div className="space-y-3 p-3 sm:p-4 bg-card/70 rounded-lg shadow">
        <div>
          <h4 className="text-md font-semibold text-primary">{TOTAL_RECIPE_MACROS_LABEL}</h4>
          <p className="text-sm text-textBase">
            {totalMacros.calories.toFixed(0)} {CALORIES_UNIT} &bull; {totalMacros.protein.toFixed(1)} {PROTEIN_UNIT} &bull; {totalMacros.carbs.toFixed(1)} {CARBS_UNIT} &bull; {totalMacros.fat.toFixed(1)} {FAT_UNIT}
          </p>
        </div>
        <div>
          <h4 className="text-md font-semibold text-primary">{PER_SERVING_MACROS_LABEL} (لـ {formData.servings} حصص)</h4>
          <p className="text-sm text-textBase">
            {perServingMacros.calories.toFixed(0)} {CALORIES_UNIT} &bull; {perServingMacros.protein.toFixed(1)} {PROTEIN_UNIT} &bull; {perServingMacros.carbs.toFixed(1)} {CARBS_UNIT} &bull; {perServingMacros.fat.toFixed(1)} {FAT_UNIT}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 rtl:sm:space-x-reverse pt-4">
        <button type="submit" className={`${buttonClass} flex-1`}>
          {SAVE_RECIPE_BUTTON}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-600 hover:bg-gray-700 text-textBase font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 shadow hover:shadow-md">
          {CANCEL_BUTTON}
        </button>
      </div>
    </form>
  );
};

export default RecipeCreationView;
