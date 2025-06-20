
import React, { useState } from 'react';
import { Goal, GoalSettings } from '../types';
import { GOAL_OPTIONS, DEFICIT_SURPLUS_OPTIONS } from '../constants';

interface GoalSelectorProps {
  onSubmit: (settings: GoalSettings) => void;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({ onSubmit }) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedModifier, setSelectedModifier] = useState<number>(0); 

  const handleGoalChange = (goal: Goal) => {
    setSelectedGoal(goal);
    if (goal === Goal.MAINTAIN_WEIGHT) {
      setSelectedModifier(0); 
    } else {
      if(selectedModifier === 0 && DEFICIT_SURPLUS_OPTIONS.length > 0) {
        setSelectedModifier(DEFICIT_SURPLUS_OPTIONS[1]?.value || DEFICIT_SURPLUS_OPTIONS[0]?.value || 0.15); 
      }
    }
  };

  const handleModifierChange = (modifier: number) => {
    setSelectedModifier(modifier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoal) {
      onSubmit({ goal: selectedGoal, modifier: selectedModifier });
    }
  };

  const buttonBaseClass = "w-full text-center p-3 my-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light text-textBase text-sm sm:text-base";
  const buttonSelectedClass = "bg-primary text-white shadow-lg scale-105";
  const buttonUnselectedClass = "bg-card hover:bg-primary/20 border border-primary/30";

  const modifierButtonBaseClass = "flex-1 p-2 sm:p-3 rounded-md transition-all duration-150 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary";
  const modifierButtonSelectedClass = "bg-primary-dark text-white shadow-md scale-105";
  const modifierButtonUnselectedClass = "bg-card/60 hover:bg-primary/20 border border-primary/40 text-textBase";


  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg">
      <h2 className="text-xl md:text-2xl font-semibold text-primary text-center mb-6">حدد هدفك الأساسي</h2>
      
      <div role="radiogroup" aria-labelledby="goal-heading" className="space-y-2">
        <p id="goal-heading" className="sr-only">اختر هدفك</p>
        {GOAL_OPTIONS.map(opt => (
          <button
            type="button"
            key={opt.value}
            onClick={() => handleGoalChange(opt.value)}
            className={`${buttonBaseClass} ${selectedGoal === opt.value ? buttonSelectedClass : buttonUnselectedClass}`}
            aria-pressed={selectedGoal === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {(selectedGoal === Goal.LOSE_WEIGHT || selectedGoal === Goal.GAIN_WEIGHT) && (
        <div className="mt-6 p-4 bg-card/50 rounded-lg shadow" role="radiogroup" aria-labelledby="modifier-heading">
          <h3 id="modifier-heading" className="text-md sm:text-lg font-medium text-textBase mb-3 text-center">
            {selectedGoal === Goal.LOSE_WEIGHT ? 'اختر نسبة العجز اليومي في السعرات:' : 'اختر نسبة الفائض اليومي في السعرات:'}
          </h3>
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            {DEFICIT_SURPLUS_OPTIONS.map(opt => (
              <button
                type="button"
                key={opt.value}
                onClick={() => handleModifierChange(opt.value)}
                className={`${modifierButtonBaseClass} ${selectedModifier === opt.value ? modifierButtonSelectedClass : modifierButtonUnselectedClass}`}
                aria-pressed={selectedModifier === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button 
        type="submit" 
        disabled={!selectedGoal}
        className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-lg hover:shadow-secondary/50 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary-light focus:ring-offset-2 focus:ring-offset-background"
      >
        التالي: اختيار النظام الغذائي
      </button>
    </form>
  );
};

export default GoalSelector;