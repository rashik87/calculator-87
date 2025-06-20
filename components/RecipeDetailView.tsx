
import React, { useState } from 'react';
import { Recipe, RecipeIngredient } from '../types';
import {
  RECIPE_DETAIL_TITLE, EDIT_THIS_RECIPE_BUTTON, DELETE_THIS_RECIPE_BUTTON, BACK_TO_RECIPES_BUTTON,
  CONFIRM_DELETE_RECIPE_MESSAGE, IMAGE_PREVIEW_ALT, NO_DESCRIPTION_AVAILABLE, INGREDIENTS_LABEL,
  TOTAL_RECIPE_MACROS_LABEL, PER_SERVING_MACROS_LABEL, CALORIES_UNIT, PROTEIN_UNIT, CARBS_UNIT, FAT_UNIT,
  CALORIES_LABEL, PROTEIN_LABEL, CARBS_LABEL, FAT_LABEL
} from '../constants';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onEdit: (recipeId: string) => void;
  onDelete: (recipeId: string) => void;
  onBack: () => void;
}

const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onEdit, onDelete, onBack }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  React.useEffect(() => {
    setImageError(false); // Reset error if recipe (and thus imageUrl) changes
  }, [recipe.imageUrl]);

  const handleDelete = () => {
    onDelete(recipe.id);
    setShowDeleteConfirm(false);
  };

  const renderImage = () => {
    if (recipe.imageUrl && !imageError) {
      return (
        <img
          src={recipe.imageUrl}
          alt={`${IMAGE_PREVIEW_ALT} - ${recipe.name}`}
          className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg border border-primary/20 mb-4"
          onError={handleImageError}
        />
      );
    }
    return (
      <div className="w-full h-48 sm:h-64 bg-gray-700 rounded-lg shadow-lg flex items-center justify-center border border-primary/20 mb-4">
        <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
    );
  };

  const buttonClass = "flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 shadow hover:shadow-md text-sm";


  return (
    <div className="w-full max-w-2xl space-y-6 bg-card/80 p-4 sm:p-6 rounded-lg shadow-xl ring-1 ring-primary/20">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">{RECIPE_DETAIL_TITLE}</h2>

      {renderImage()}

      <h3 className="text-xl sm:text-2xl font-semibold text-primary-light">{recipe.name}</h3>
      
      {recipe.description ? (
        <p className="text-textBase text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{recipe.description}</p>
      ) : (
        <p className="text-textMuted text-sm italic">{NO_DESCRIPTION_AVAILABLE}</p>
      )}

      <div className="space-y-3 p-3 sm:p-4 bg-card/70 rounded-lg shadow">
        <h4 className="text-md font-semibold text-primary">{INGREDIENTS_LABEL} (لإجمالي الوصفة):</h4>
        <ul className="list-disc ps-5 space-y-1 text-sm text-textBase">
          {recipe.ingredients.map((ing, index) => (
            <li key={index}>
              {ing.foodItemName}: {ing.quantityGram.toFixed(1)} جرام
              <span className="text-xs text-textMuted"> ({ing.calories.toFixed(0)} سعرة، {ing.protein.toFixed(1)}ب، {ing.carbs.toFixed(1)}ك، {ing.fat.toFixed(1)}د)</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-3 p-3 sm:p-4 bg-card/70 rounded-lg shadow">
        <div>
          <h4 className="text-md font-semibold text-primary">{TOTAL_RECIPE_MACROS_LABEL}</h4>
          <p className="text-sm text-textBase">
            {CALORIES_LABEL}: {recipe.totalMacros.calories.toFixed(0)} {CALORIES_UNIT} &bull; {PROTEIN_LABEL}: {recipe.totalMacros.protein.toFixed(1)} {PROTEIN_UNIT} &bull; {CARBS_LABEL}: {recipe.totalMacros.carbs.toFixed(1)} {CARBS_UNIT} &bull; {FAT_LABEL}: {recipe.totalMacros.fat.toFixed(1)} {FAT_UNIT}
          </p>
        </div>
        <div>
          <h4 className="text-md font-semibold text-primary">{PER_SERVING_MACROS_LABEL} (لـ {recipe.servings} حصص)</h4>
          <p className="text-sm text-textBase">
            {CALORIES_LABEL}: {recipe.perServingMacros.calories.toFixed(0)} {CALORIES_UNIT} &bull; {PROTEIN_LABEL}: {recipe.perServingMacros.protein.toFixed(1)} {PROTEIN_UNIT} &bull; {CARBS_LABEL}: {recipe.perServingMacros.carbs.toFixed(1)} {CARBS_UNIT} &bull; {FAT_LABEL}: {recipe.perServingMacros.fat.toFixed(1)} {FAT_UNIT}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 rtl:sm:space-x-reverse pt-4">
        <button onClick={onBack} className={`${buttonClass} bg-gray-600 hover:bg-gray-700`}>
          {BACK_TO_RECIPES_BUTTON}
        </button>
        <button onClick={() => onEdit(recipe.id)} className={`${buttonClass} bg-secondary hover:bg-secondary-dark`}>
          {EDIT_THIS_RECIPE_BUTTON}
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className={`${buttonClass} bg-accent hover:bg-accent-dark`}>
          {DELETE_THIS_RECIPE_BUTTON}
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-sm ring-1 ring-accent/50">
            <h4 className="text-lg font-semibold text-accent mb-3">تأكيد الحذف</h4>
            <p className="text-textBase text-sm mb-4">{CONFIRM_DELETE_RECIPE_MESSAGE}</p>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button onClick={handleDelete} className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-md">
                نعم، احذف
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-textBase font-semibold py-2 px-4 rounded-md">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailView;
