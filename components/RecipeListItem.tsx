
import React from 'react';
import { Recipe } from '../types';
import { 
  IMAGE_PREVIEW_ALT, 
  CALORIES_LABEL, 
  PROTEIN_LABEL, 
  CARBS_LABEL, 
  FAT_LABEL,
  PER_SERVING_MACROS_LABEL
} from '../constants';

interface RecipeListItemProps {
  recipe: Recipe;
  onSelectRecipe: (recipeId: string) => void; // This will now trigger detail view
}

const RecipeListItem: React.FC<RecipeListItemProps> = ({ recipe, onSelectRecipe }) => {
  const { name, description, imageUrl, perServingMacros, servings } = recipe;
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };
  
  // Reset image error state if imageUrl changes (e.g. recipe prop updates)
  React.useEffect(() => {
    setImageError(false);
  }, [imageUrl]);


  const renderImage = () => {
    if (imageUrl && !imageError) {
      return (
        <img 
          src={imageUrl} 
          alt={`${IMAGE_PREVIEW_ALT} - ${name}`} 
          className="w-full sm:w-28 md:w-32 h-32 sm:h-auto object-cover rounded-md flex-shrink-0 border border-primary/20 shadow-sm" 
          onError={handleImageError}
        />
      );
    }
    // Fallback placeholder if no imageUrl or if imageError is true
    return (
      <div className="w-full sm:w-28 md:w-32 h-32 bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-sm recipe-image-placeholder">
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
    );
  };

  return (
    <button 
      onClick={() => onSelectRecipe(recipe.id)}
      className="w-full text-right bg-card/90 p-3 sm:p-4 rounded-lg shadow-md hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-150 mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start"
      aria-label={`عرض تفاصيل وصفة ${name}`}
    >
      {renderImage()}
      <div className="flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold text-primary-light mb-1">{name}</h3>
        {description && <p className="text-xs sm:text-sm text-textMuted mb-2 line-clamp-2 sm:line-clamp-3">{description}</p>}
        
        <div className="mt-2 pt-2 border-t border-primary/20">
          <p className="text-xs sm:text-sm font-medium text-textBase mb-1">{PER_SERVING_MACROS_LABEL} ({servings} حصص)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 sm:gap-x-3 gap-y-1 text-xs">
            <div>
              <span className="font-medium text-textBase">{CALORIES_LABEL}: </span>
              <span className="text-secondary">{perServingMacros.calories.toFixed(0)}</span>
            </div>
            <div>
              <span className="font-medium text-textBase">{PROTEIN_LABEL}: </span>
              <span className="text-secondary">{perServingMacros.protein.toFixed(1)}ج</span>
            </div>
            <div>
              <span className="font-medium text-textBase">{CARBS_LABEL}: </span>
              <span className="text-secondary">{perServingMacros.carbs.toFixed(1)}ج</span>
            </div>
            <div>
              <span className="font-medium text-textBase">{FAT_LABEL}: </span>
              <span className="text-secondary">{perServingMacros.fat.toFixed(1)}ج</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default RecipeListItem;
