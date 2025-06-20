import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import { 
  SELECT_RECIPE_MODAL_TITLE, 
  CANCEL_BUTTON, 
  NO_RECIPES_AVAILABLE_TO_ASSIGN, 
  SEARCH_RECIPES_PLACEHOLDER, 
  NO_RECIPES_FOUND,
  CALORIES_LABEL, PROTEIN_LABEL, CARBS_LABEL, FAT_LABEL
} from '../constants';

interface SelectRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const SelectRecipeModal: React.FC<SelectRecipeModalProps> = ({ isOpen, onClose, recipes, onSelectRecipe }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return recipes;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(lowerSearchTerm) ||
      (recipe.description && recipe.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [recipes, searchTerm]);

  if (!isOpen) return null;

  const handleRecipeClick = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    onClose(); 
  };
  
  const recipeItemClass = "w-full text-right p-3 my-1 rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-card/80 hover:bg-card shadow-sm cursor-pointer";

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="select-recipe-title"
    >
      <div className="bg-card p-5 sm:p-6 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col ring-1 ring-primary/20">
        <h2 id="select-recipe-title" className="text-xl font-semibold text-primary mb-4">{SELECT_RECIPE_MODAL_TITLE}</h2>
        
        <input 
          type="text"
          placeholder={SEARCH_RECIPES_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-card border border-primary/30 text-textBase rounded-md p-3 mb-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm"
          aria-label={SEARCH_RECIPES_PLACEHOLDER}
        />

        <div className="flex-grow overflow-y-auto space-y-2 pr-1">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => handleRecipeClick(recipe)}
                className={recipeItemClass}
                aria-label={`اختيار وصفة ${recipe.name}`}
              >
                <h3 className="text-md font-semibold text-primary-light">{recipe.name}</h3>
                {recipe.description && <p className="text-xs text-textMuted mt-0.5 line-clamp-2">{recipe.description}</p>}
                <div className="text-xs text-textMuted mt-1 pt-1 border-t border-primary/10">
                  <span>{CALORIES_LABEL}: {recipe.perServingMacros.calories.toFixed(0)}</span> | 
                  <span> {PROTEIN_LABEL}: {recipe.perServingMacros.protein.toFixed(1)}ج</span> | 
                  <span> {CARBS_LABEL}: {recipe.perServingMacros.carbs.toFixed(1)}ج</span> | 
                  <span> {FAT_LABEL}: {recipe.perServingMacros.fat.toFixed(1)}ج (لكل حصة)</span>
                </div>
              </button>
            ))
          ) : recipes.length === 0 ? (
            <p className="text-center text-textMuted p-3 bg-card/50 rounded-md">{NO_RECIPES_AVAILABLE_TO_ASSIGN}</p>
          ) : (
            <p className="text-center text-textMuted p-3 bg-card/50 rounded-md">{NO_RECIPES_FOUND}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-gray-600 hover:bg-gray-700 text-textBase font-semibold py-2 px-5 rounded-md transition-colors duration-200 shadow"
          >
            {CANCEL_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRecipeModal;
