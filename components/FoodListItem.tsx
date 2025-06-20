
import React from 'react';
import { FoodItem } from '../types';
import { CUSTOM_FOOD_BADGE, CALORIES_LABEL, PROTEIN_LABEL, CARBS_LABEL, FAT_LABEL, SERVING_SIZE_LABEL } from '../constants';

interface FoodListItemProps {
  item: FoodItem;
}

const FoodListItem: React.FC<FoodListItemProps> = ({ item }) => {
  return (
    <div className="bg-card/90 p-3 sm:p-4 rounded-lg shadow-md border-s-4 border-primary mb-3 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-md sm:text-lg font-semibold text-primary-light">{item.name}</h3>
        {item.isCustom && (
          <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full shadow-sm">{CUSTOM_FOOD_BADGE}</span>
        )}
      </div>
      <p className="text-xs sm:text-sm text-textMuted mb-2">{SERVING_SIZE_LABEL}: {item.servingSize}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1 text-xs sm:text-sm">
        <div>
          <span className="font-medium text-textBase">{CALORIES_LABEL}: </span>
          <span className="text-secondary">{item.calories.toFixed(0)}</span>
        </div>
        <div>
          <span className="font-medium text-textBase">{PROTEIN_LABEL}: </span>
          <span className="text-secondary">{item.protein.toFixed(1)}ج</span>
        </div>
        <div>
          <span className="font-medium text-textBase">{CARBS_LABEL}: </span>
          <span className="text-secondary">{item.carbs.toFixed(1)}ج</span>
        </div>
        <div>
          <span className="font-medium text-textBase">{FAT_LABEL}: </span>
          <span className="text-secondary">{item.fat.toFixed(1)}ج</span>
        </div>
      </div>
    </div>
  );
};

export default FoodListItem;