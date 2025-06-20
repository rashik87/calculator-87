
import React from 'react';
import { SimulatedUser, Macros, WeightEntry, AppView, FoodItem, Recipe } from '../types';
import {
  USER_DASHBOARD_TITLE, WELCOME_MESSAGE_PREFIX, DAILY_NEEDS_TITLE_DASHBOARD, RECALCULATE_NEEDS_BUTTON,
  CALCULATE_NEEDS_PROMPT_DASHBOARD, START_CALCULATION_BUTTON, PROGRESS_SUMMARY_TITLE, LATEST_ENTRY_LABEL,
  VIEW_ALL_PROGRESS_BUTTON, NO_PROGRESS_LOGGED_DASHBOARD, LOG_FIRST_PROGRESS_BUTTON,
  MY_DATA_TITLE, MY_FOODS_LINK_PREFIX, MY_RECIPES_LINK_PREFIX, ITEM_UNIT_SINGULAR, ITEM_UNIT_PLURAL,
  RECIPE_UNIT_SINGULAR, RECIPE_UNIT_PLURAL, NO_WEIGHT_LOGGED, CALORIES_LABEL, PROTEIN_LABEL,
  CARBS_LABEL, FAT_LABEL, CALORIES_UNIT, PROTEIN_UNIT, CARBS_UNIT, FAT_UNIT, QUICK_LINKS_TITLE,
  FOOD_DATABASE_NAVIGATION_LINK, RECIPES_NAVIGATION_LINK, RECIPE_DRIVEN_MEAL_PLAN_NAVIGATION_LINK, PROGRESS_TRACKING_NAV_LINK,
  WEIGHT_KG_LABEL, BODY_FAT_PERCENTAGE_LABEL // Added missing imports
} from '../constants';

interface UserDashboardViewProps {
  currentUser: SimulatedUser;
  userTargetMacros: Macros | null;
  latestProgressEntry: WeightEntry | null;
  customFoodItemCount: number;
  recipeCount: number;
  onNavigate: (view: AppView) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; unit?: string; icon?: JSX.Element; size?: 'normal' | 'large' }> = ({ title, value, unit, icon, size = 'normal'}) => (
  <div className={`bg-card/70 p-4 rounded-lg shadow-md flex items-center space-x-3 rtl:space-x-reverse ${size === 'large' ? 'col-span-2' : ''}`}>
    {icon && <div className="text-primary text-2xl">{icon}</div>}
    <div>
      <h4 className="text-sm text-textMuted">{title}</h4>
      <p className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-xl'} text-primary-light`}>
        {value} <span className="text-xs text-textMuted">{unit}</span>
      </p>
    </div>
  </div>
);

const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  currentUser,
  userTargetMacros,
  latestProgressEntry,
  customFoodItemCount,
  recipeCount,
  onNavigate,
}) => {
  
  const getItemsUnit = (count: number) => count === 1 ? ITEM_UNIT_SINGULAR : (count >=2 && count <=10 ? ITEM_UNIT_PLURAL : ITEM_UNIT_PLURAL);
  const getRecipeUnit = (count: number) => count === 1 ? RECIPE_UNIT_SINGULAR : (count >=2 && count <=10 ? RECIPE_UNIT_PLURAL : RECIPE_UNIT_PLURAL);

  const primaryButtonClass = "bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-md transition-colors duration-200 shadow-lg hover:shadow-primary/50 text-sm";
  const secondaryButtonClass = "bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 shadow hover:shadow-secondary/50 text-xs";
  const linkButtonClass = "text-primary-light hover:text-primary hover:underline transition-colors text-sm font-medium";

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{USER_DASHBOARD_TITLE}</h2>
        <p className="text-textMuted mt-1">{WELCOME_MESSAGE_PREFIX}{currentUser.email}</p>
      </div>

      {/* Daily Needs Section */}
      <section className="p-4 sm:p-5 bg-card/80 rounded-xl shadow-xl border-t-4 border-primary">
        <h3 className="text-lg sm:text-xl font-semibold text-primary-light mb-3">{DAILY_NEEDS_TITLE_DASHBOARD}</h3>
        {userTargetMacros ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-card/50 p-3 rounded-md shadow-sm text-center">
                    <p className="text-xs text-textMuted">{CALORIES_LABEL}</p>
                    <p className="font-bold text-xl text-secondary">{userTargetMacros.calories.toFixed(0)} <span className="text-xs">{CALORIES_UNIT}</span></p>
                </div>
                <div className="bg-card/50 p-3 rounded-md shadow-sm text-center">
                    <p className="text-xs text-textMuted">{PROTEIN_LABEL}</p>
                    <p className="font-bold text-xl text-secondary">{userTargetMacros.protein.toFixed(0)} <span className="text-xs">{PROTEIN_UNIT}</span></p>
                </div>
                <div className="bg-card/50 p-3 rounded-md shadow-sm text-center">
                    <p className="text-xs text-textMuted">{CARBS_LABEL}</p>
                    <p className="font-bold text-xl text-secondary">{userTargetMacros.carbs.toFixed(0)} <span className="text-xs">{CARBS_UNIT}</span></p>
                </div>
                <div className="bg-card/50 p-3 rounded-md shadow-sm text-center">
                    <p className="text-xs text-textMuted">{FAT_LABEL}</p>
                    <p className="font-bold text-xl text-secondary">{userTargetMacros.fat.toFixed(0)} <span className="text-xs">{FAT_UNIT}</span></p>
                </div>
            </div>
            <button onClick={() => onNavigate('userInput')} className={`${secondaryButtonClass} w-full sm:w-auto`}>
              {RECALCULATE_NEEDS_BUTTON}
            </button>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-textMuted mb-3">{CALCULATE_NEEDS_PROMPT_DASHBOARD}</p>
            <button onClick={() => onNavigate('userInput')} className={primaryButtonClass}>
              {START_CALCULATION_BUTTON}
            </button>
          </div>
        )}
      </section>

      {/* Progress Summary Section */}
      <section className="p-4 sm:p-5 bg-card/80 rounded-xl shadow-xl border-t-4 border-secondary">
        <h3 className="text-lg sm:text-xl font-semibold text-secondary-light mb-3">{PROGRESS_SUMMARY_TITLE}</h3>
        {latestProgressEntry ? (
          <div className="space-y-3">
            <p className="text-sm text-textBase">
              <strong>{LATEST_ENTRY_LABEL}</strong> {new Date(latestProgressEntry.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatCard title={WEIGHT_KG_LABEL} value={latestProgressEntry.weight.toFixed(1)} unit="كجم" />
                {latestProgressEntry.bodyFatPercentage && latestProgressEntry.bodyFatPercentage > 0 && (
                    <StatCard title={BODY_FAT_PERCENTAGE_LABEL} value={latestProgressEntry.bodyFatPercentage.toFixed(1)} unit="%" />
                )}
            </div>
            <button onClick={() => onNavigate('progressTracking')} className={`${secondaryButtonClass} w-full sm:w-auto`}>
              {VIEW_ALL_PROGRESS_BUTTON}
            </button>
          </div>
        ) : (
          <div className="text-center py-3">
            <p className="text-textMuted mb-3">{NO_PROGRESS_LOGGED_DASHBOARD}</p>
            <button onClick={() => onNavigate('progressTracking')} className={primaryButtonClass}>
              {LOG_FIRST_PROGRESS_BUTTON}
            </button>
          </div>
        )}
      </section>

      {/* Quick Links / My Data Section */}
      <section className="p-4 sm:p-5 bg-card/80 rounded-xl shadow-xl border-t-4 border-accent">
        <h3 className="text-lg sm:text-xl font-semibold text-accent-light mb-4">{QUICK_LINKS_TITLE}</h3>
        <div className="space-y-3">
            <div className="bg-card/50 p-3 rounded-md shadow-sm">
                <p className="text-sm text-textBase mb-1">
                    <strong>{MY_FOODS_LINK_PREFIX}</strong> {customFoodItemCount} {getItemsUnit(customFoodItemCount)}
                </p>
                <button onClick={() => onNavigate('foodDatabase')} className={linkButtonClass}>
                    {FOOD_DATABASE_NAVIGATION_LINK} &rarr;
                </button>
            </div>
             <div className="bg-card/50 p-3 rounded-md shadow-sm">
                <p className="text-sm text-textBase mb-1">
                    <strong>{MY_RECIPES_LINK_PREFIX}</strong> {recipeCount} {getRecipeUnit(recipeCount)}
                </p>
                <button onClick={() => onNavigate('recipeList')} className={linkButtonClass}>
                     {RECIPES_NAVIGATION_LINK} &rarr;
                </button>
            </div>
             <div className="bg-card/50 p-3 rounded-md shadow-sm">
                <button onClick={() => onNavigate('recipeDrivenMealPlan')} className={linkButtonClass}>
                     {RECIPE_DRIVEN_MEAL_PLAN_NAVIGATION_LINK} &rarr;
                </button>
            </div>
             <div className="bg-card/50 p-3 rounded-md shadow-sm">
                 <button onClick={() => onNavigate('progressTracking')} className={linkButtonClass}>
                    {PROGRESS_TRACKING_NAV_LINK} (مفصل) &rarr;
                 </button>
            </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboardView;