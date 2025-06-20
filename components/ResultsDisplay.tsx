
import React from 'react';
import { Macros, DietProtocol, CarbCycleConfig, IntermittentFastingConfig, Goal, GoalSettings } from '../types';
import { ADVICE_TEXTS, KETO_CARB_LIMIT_GRAMS, GOAL_OPTIONS, DEFICIT_SURPLUS_OPTIONS } from '../constants';
import { calculateMacros } from '../services/calorieService'; 

interface ResultsDisplayProps {
  finalTdee: number; 
  macros: Macros;
  diet: DietProtocol;
  goalSettings: GoalSettings | null;
  userDataWeight: number; 
  carbCycleConfig?: CarbCycleConfig | null;
  intermittentFastingConfig?: IntermittentFastingConfig | null;
  onReset: () => void;
}

const MacroCard: React.FC<{ title: string; value: number; unit: string; colorClass: string }> = ({ title, value, unit, colorClass }) => (
  <div className={`p-4 rounded-lg shadow-md text-center bg-card/80 border-t-4 ${colorClass}`}>
    <h4 className="text-md sm:text-lg font-semibold text-textBase">{title}</h4>
    <p className="text-2xl sm:text-3xl font-bold text-primary-light">{value.toFixed(0)}</p>
    <p className="text-xs sm:text-sm text-textMuted">{unit}</p>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ finalTdee, macros, diet, goalSettings, userDataWeight, carbCycleConfig, intermittentFastingConfig, onReset }) => {
  const advice = diet !== DietProtocol.NONE ? ADVICE_TEXTS[diet] : ADVICE_TEXTS[DietProtocol.NONE];
  
  let ketoWarning = null;
  if (diet === DietProtocol.KETO && macros.carbs > KETO_CARB_LIMIT_GRAMS) {
    ketoWarning = ADVICE_TEXTS[DietProtocol.KETO].carbWarning(macros.carbs);
  }

  const getGoalDescription = () => {
    if (!goalSettings) return "";
    const goalOption = GOAL_OPTIONS.find(g => g.value === goalSettings.goal);
    let description = goalOption ? goalOption.label : "";
    if (goalSettings.goal === Goal.LOSE_WEIGHT || goalSettings.goal === Goal.GAIN_WEIGHT) {
      const percentageOption = DEFICIT_SURPLUS_OPTIONS.find(p => p.value === goalSettings.modifier);
      if (percentageOption) {
        const type = goalSettings.goal === Goal.LOSE_WEIGHT ? "عجز" : "فائض";
        description += ` (${type} ${percentageOption.label})`;
      }
    }
    return description;
  };

  const renderCarbCycleMacros = () => {
    if (!carbCycleConfig || diet !== DietProtocol.CARB_CYCLING || !goalSettings) return null;

    const highCarbMacros = calculateMacros(finalTdee, DietProtocol.CARB_CYCLING, goalSettings.goal, userDataWeight, 'high');
    const mediumCarbMacros = calculateMacros(finalTdee, DietProtocol.CARB_CYCLING, goalSettings.goal, userDataWeight, 'medium');
    const lowCarbMacros = calculateMacros(finalTdee, DietProtocol.CARB_CYCLING, goalSettings.goal, userDataWeight, 'low');
    
    return (
      <div className="mt-6">
        <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">تفاصيل الماكروز لأيام تدوير الكربوهيدرات:</h3>
        {[
          { title: `أيام الكربوهيدرات المرتفعة (${carbCycleConfig.highCarbDays} أيام)`, data: highCarbMacros, color: "border-secondary" },
          { title: `أيام الكربوهيدرات المتوسطة (${carbCycleConfig.mediumCarbDays} أيام)`, data: mediumCarbMacros, color: "border-yellow-500" }, // Using a default yellow for medium
          { title: `أيام الكربوهيدرات المنخفضة (${carbCycleConfig.lowCarbDays} أيام)`, data: lowCarbMacros, color: "border-accent" },
        ].map(cycleDay => (
          <div key={cycleDay.title} className={`mb-4 p-3 sm:p-4 rounded-lg bg-card/50 shadow ${cycleDay.color}`}>
            <h4 className="text-md sm:text-lg font-medium text-textBase mb-2">{cycleDay.title}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
              <p><strong className="text-primary-light">سعرات:</strong> {cycleDay.data.calories.toFixed(0)}</p>
              <p><strong className="text-primary-light">بروتين:</strong> {cycleDay.data.protein.toFixed(0)} جم</p>
              <p><strong className="text-primary-light">كربوهيدرات:</strong> {cycleDay.data.carbs.toFixed(0)} جم</p>
              <p><strong className="text-primary-light">دهون:</strong> {cycleDay.data.fat.toFixed(0)} جم</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-2xl space-y-6 md:space-y-8 mt-6">
      <div className="text-center p-6 bg-card/70 rounded-xl shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1">السعرات الحرارية اليومية المقترحة</h2>
        {goalSettings && <p className="text-xs sm:text-sm text-textMuted mb-2">{getGoalDescription()}</p>}
        <p className="text-4xl sm:text-5xl font-extrabold text-secondary">{finalTdee.toFixed(0)}</p>
        <p className="text-textMuted text-sm">سعر حراري/يوم</p>
      </div>

      {diet !== DietProtocol.CARB_CYCLING && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">تقسيم الماكروز اليومي المقترح:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <MacroCard title="السعرات" value={macros.calories} unit="سعر حراري" colorClass="border-sky-400" /> 
            <MacroCard title="البروتين" value={macros.protein} unit="جرام" colorClass="border-red-400" />
            <MacroCard title="الكربوهيدرات" value={macros.carbs} unit="جرام" colorClass="border-emerald-400" />
            <MacroCard title="الدهون" value={macros.fat} unit="جرام" colorClass="border-yellow-400" />
          </div>
          {ketoWarning && <p className="text-accent text-sm mt-4 text-center bg-accent/20 p-3 rounded-md">{ketoWarning}</p>}
        </div>
      )}

      {renderCarbCycleMacros()}

      {advice && (
        <div className="p-4 sm:p-6 bg-card/70 rounded-xl shadow-xl">
          <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3">{advice.title}</h3>
          <ul className="list-disc ps-5 space-y-2 text-textBase text-sm sm:text-base">
            {typeof advice.general === 'function' && intermittentFastingConfig 
              ? (advice.general as (start: string, end: string) => string[])(intermittentFastingConfig.eatingWindowStart, intermittentFastingConfig.eatingWindowEnd).map((item, index) => <li key={index}>{item}</li>)
              : (advice.general as string[]).map((item, index) => <li key={index}>{item}</li>)
            }
          </ul>
        </div>
      )}
       <button 
          onClick={onReset}
          className="w-full mt-6 sm:mt-8 bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-lg hover:shadow-accent/50 focus:outline-none focus:ring-2 focus:ring-accent-light focus:ring-offset-2 focus:ring-offset-background"
        >
          البدء من جديد
        </button>
    </div>
  );
};

export default ResultsDisplay;