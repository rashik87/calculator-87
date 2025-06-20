
import React, { useState, useMemo } from 'react';
import { FoodItem } from '../types';
import FoodListItem from './FoodListItem';
import AddFoodForm from './AddFoodForm';
import { 
  FOOD_DATABASE_TITLE, 
  ADD_NEW_FOOD_BUTTON, 
  SEARCH_FOOD_PLACEHOLDER,
  NO_FOOD_ITEMS_FOUND,
  NO_FOOD_ITEMS_YET,
  ERROR_SAVING_FOOD 
} from '../constants';

interface FoodDatabaseViewProps {
  foodItems: FoodItem[];
  onAddFood: (foodData: Omit<FoodItem, 'id' | 'isCustom' | 'userId'>) => boolean; // Returns true on success
}

const FoodDatabaseView: React.FC<FoodDatabaseViewProps> = ({ foodItems, onAddFood }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const filteredFoodItems = useMemo(() => {
    if (!searchTerm) return foodItems;
    return foodItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foodItems, searchTerm]);

  const handleAddFoodSubmit = (foodData: Omit<FoodItem, 'id' | 'isCustom' | 'userId'>) => {
    const success = onAddFood(foodData);
    if (success) {
      setShowAddFoodForm(false);
      setSearchTerm(''); 
      setNotification({type: 'success', message: `${foodData.name} تم إضافته بنجاح!`});
    } else {
      setNotification({type: 'error', message: ERROR_SAVING_FOOD});
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-primary text-center">{FOOD_DATABASE_TITLE}</h2>

      {notification && (
        <div className={`p-3 rounded-md text-center text-sm shadow ${notification.type === 'success' ? 'bg-secondary/90 text-background' : 'bg-accent/90 text-white'}`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <input 
          type="text"
          placeholder={SEARCH_FOOD_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm"
          aria-label={SEARCH_FOOD_PLACEHOLDER}
        />
        <button 
          onClick={() => setShowAddFoodForm(true)}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 sm:px-6 rounded-md transition-colors duration-200 shadow-lg hover:shadow-primary/50 whitespace-nowrap"
        >
          {ADD_NEW_FOOD_BUTTON}
        </button>
      </div>

      {showAddFoodForm && (
        <AddFoodForm 
          onSubmit={handleAddFoodSubmit} 
          onCancel={() => setShowAddFoodForm(false)} 
        />
      )}

      <div className="max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 space-y-3">
        {filteredFoodItems.length > 0 ? (
          filteredFoodItems.map(item => <FoodListItem key={item.id} item={item} />)
        ) : foodItems.length === 0 ? (
           <p className="text-center text-textMuted p-4 bg-card/50 rounded-md shadow">{NO_FOOD_ITEMS_YET}</p>
        ) : (
          <p className="text-center text-textMuted p-4 bg-card/50 rounded-md shadow">{NO_FOOD_ITEMS_FOUND}</p>
        )}
      </div>
    </div>
  );
};

export default FoodDatabaseView;
