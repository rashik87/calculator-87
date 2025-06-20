
import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import RecipeListItem from './RecipeListItem';
import { 
  RECIPE_LIST_TITLE, 
  CREATE_NEW_RECIPE_BUTTON, 
  NO_RECIPES_YET, 
  NO_RECIPES_FOUND,
  SEARCH_RECIPES_PLACEHOLDER
} from '../constants';

interface RecipeListViewProps {
  recipes: Recipe[];
  onNavigateToCreateRecipe: () => void;
  onSelectRecipe: (recipeId: string) => void;
}

const RecipeListView: React.FC<RecipeListViewProps> = ({ recipes, onNavigateToCreateRecipe, onSelectRecipe }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = useMemo(() => {
    if (!searchTerm.trim()) return recipes;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(lowerSearchTerm) ||
      (recipe.description && recipe.description.toLowerCase().includes(lowerSearchTerm))
    );
  }, [recipes, searchTerm]);

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary">{RECIPE_LIST_TITLE}</h2>
        <button 
          onClick={onNavigateToCreateRecipe}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-md transition-colors duration-200 shadow-lg hover:shadow-primary/50 whitespace-nowrap text-sm sm:text-base"
        >
          {CREATE_NEW_RECIPE_BUTTON}
        </button>
      </div>

      <input 
        type="text"
        placeholder={SEARCH_RECIPES_PLACEHOLDER}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm"
        aria-label={SEARCH_RECIPES_PLACEHOLDER}
      />

      <div className="max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 space-y-4">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <RecipeListItem 
              key={recipe.id} 
              recipe={recipe} 
              onSelectRecipe={onSelectRecipe} 
            />
          ))
        ) : recipes.length === 0 ? (
           <p className="text-center text-textMuted p-4 bg-card/50 rounded-md shadow">{NO_RECIPES_YET}</p>
        ) : (
          <p className="text-center text-textMuted p-4 bg-card/50 rounded-md shadow">{NO_RECIPES_FOUND}</p>
        )}
      </div>
    </div>
  );
};

export default RecipeListView;