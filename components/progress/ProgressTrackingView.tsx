import React, { useState, useEffect, useMemo } from 'react';
import { WeightEntry, MeasurementDetails, BodyFatInputs, BodyFatResult, Gender, UserData } from '../../types';
import { calculateBodyFatDetails } from '../../services/bodyFatService';
import {
    PROGRESS_TRACKING_TITLE, ADD_NEW_ENTRY_BUTTON, LOG_MEASUREMENTS_BUTTON, DATE_LABEL, WEIGHT_KG_LABEL,
    NECK_CM_LABEL, WAIST_CM_LABEL, HIPS_CM_LABEL, THIGH_CM_LABEL, BODY_FAT_PERCENTAGE_LABEL,
    BODY_FAT_MASS_LABEL, LEAN_BODY_MASS_LABEL, BODY_FAT_CATEGORY_LABEL, CALCULATE_BODY_FAT_BUTTON,
    HISTORICAL_ENTRIES_TITLE, NO_PROGRESS_ENTRIES_YET, REQUIRED_FIELD_ERROR, POSITIVE_NUMBER_ERROR,
    NAVY_BF_INSTRUCTIONS, BODY_FAT_INPUTS_REQUIRED, LOADING_MESSAGE,
    USED_HEIGHT_LABEL, USED_GENDER_LABEL, BF_CALCULATION_ERROR_MESSAGE, HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE,
    GENDER_OPTIONS
} from '../../constants';

interface ProgressTrackingViewProps {
  userId: string;
  userDataForCalc: UserData | null; // For height and gender for BF calc
  entries: WeightEntry[];
  onAddEntry: (entry: Omit<WeightEntry, 'id' | 'userId'>) => Promise<boolean>;
  onDeleteEntry: (entryId: string) => Promise<boolean>;
}

const ProgressTrackingView: React.FC<ProgressTrackingViewProps> = ({
  userId,
  userDataForCalc,
  entries,
  onAddEntry,
  onDeleteEntry
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentWeight, setCurrentWeight] = useState('');
  const [measurements, setMeasurements] = useState<MeasurementDetails>({}); // For thigh primarily
  const [bodyFatResult, setBodyFatResult] = useState<BodyFatResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Separate state for calculator inputs to not overwrite main `measurements` for thigh
  const [calcNeck, setCalcNeck] = useState('');
  const [calcWaist, setCalcWaist] = useState('');
  const [calcHips, setCalcHips] = useState('');

  
  useEffect(() => {
    setBodyFatResult(null); 
  }, [userDataForCalc]);


  const handleMeasurementChange = (field: keyof MeasurementDetails, value: string) => {
    const numValue = parseFloat(value);
    if (field === 'thigh') {
        setMeasurements(prev => ({
          ...prev,
          thigh: isNaN(numValue) || numValue <= 0 ? undefined : numValue,
        }));
    }
  };
  
  const handleCalcInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setBodyFatResult(null); 
  };


  const validateForm = (): boolean => {
    setFormError(null);
    if (!currentDate) {
      setFormError("التاريخ مطلوب.");
      return false;
    }
    const weightNum = parseFloat(currentWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setFormError(WEIGHT_KG_LABEL + ": " + POSITIVE_NUMBER_ERROR);
      return false;
    }
    return true;
  };

  const handleLogEntry = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const newEntry: Omit<WeightEntry, 'id' | 'userId'> = {
      date: currentDate,
      weight: parseFloat(currentWeight),
      measurements: { 
        neck: parseFloat(calcNeck) > 0 ? parseFloat(calcNeck) : undefined,
        waist: parseFloat(calcWaist) > 0 ? parseFloat(calcWaist) : undefined,
        hips: parseFloat(calcHips) > 0 ? parseFloat(calcHips) : undefined,
        thigh: measurements.thigh, 
      },
      bodyFatPercentage: bodyFatResult?.percentage && bodyFatResult?.category !== BF_CALCULATION_ERROR_MESSAGE && bodyFatResult?.category !== HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE && bodyFatResult?.category !== BODY_FAT_INPUTS_REQUIRED ? bodyFatResult.percentage : undefined,
      bodyFatMass: bodyFatResult?.fatMassKg && bodyFatResult?.category !== BF_CALCULATION_ERROR_MESSAGE && bodyFatResult?.category !== HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE && bodyFatResult?.category !== BODY_FAT_INPUTS_REQUIRED ? bodyFatResult.fatMassKg : undefined,
      leanMass: bodyFatResult?.leanMassKg && bodyFatResult?.category !== BF_CALCULATION_ERROR_MESSAGE && bodyFatResult?.category !== HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE && bodyFatResult?.category !== BODY_FAT_INPUTS_REQUIRED ? bodyFatResult.leanMassKg : undefined,
    };
    const success = await onAddEntry(newEntry);
    if (success) {
      setShowAddForm(false);
      setCurrentDate(new Date().toISOString().split('T')[0]);
      setCurrentWeight('');
      setMeasurements({}); 
      setCalcNeck('');
      setCalcWaist('');
      setCalcHips('');
      setBodyFatResult(null);
    } else {
      setFormError("فشل حفظ القراءة. حاول مرة أخرى.");
    }
    setIsSubmitting(false);
  };

  const handleCalculateBodyFat = () => {
    setFormError(null);
    if (!userDataForCalc || !userDataForCalc.height || !userDataForCalc.gender) {
      setBodyFatResult({ percentage: 0, category: HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE });
      return;
    }
    const neckCm = parseFloat(calcNeck);
    const waistCm = parseFloat(calcWaist);
    const hipCmNum = userDataForCalc.gender === Gender.FEMALE ? parseFloat(calcHips) : undefined;
    const weightKgNum = parseFloat(currentWeight);

    if (isNaN(neckCm) || neckCm <= 0 || isNaN(waistCm) || waistCm <= 0 || (userDataForCalc.gender === Gender.FEMALE && (hipCmNum === undefined || isNaN(hipCmNum) || hipCmNum <= 0))) {
      setBodyFatResult({ percentage: 0, category: BODY_FAT_INPUTS_REQUIRED }); // Specific error for missing measurements
      return;
    }
    
    const validWeightForMassCalc = (!isNaN(weightKgNum) && weightKgNum > 0) ? weightKgNum : 0;

    const inputs: BodyFatInputs = {
      gender: userDataForCalc.gender,
      heightCm: userDataForCalc.height,
      neckCm,
      waistCm,
      hipCm: hipCmNum,
      weightKg: validWeightForMassCalc 
    };
    const result = calculateBodyFatDetails(inputs);
    setBodyFatResult(result);
  };

  const inputClass = "w-full bg-card border border-primary/30 text-textBase rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm text-sm";
  const labelClass = "block text-sm font-medium text-textBase mb-1";
  const buttonClass = "bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-md transition-colors duration-200 shadow-md text-sm disabled:opacity-70";
  const secondaryButtonClass = "bg-secondary hover:bg-secondary-dark text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 shadow-sm text-xs disabled:opacity-60 disabled:cursor-not-allowed";


  const memoizedEntries = useMemo(() => entries, [entries]);
  const userGenderDisplay = userDataForCalc?.gender ? GENDER_OPTIONS.find(g => g.value === userDataForCalc.gender)?.label : 'غير محدد';
  const canCalculateBfp = !!(userDataForCalc?.height && userDataForCalc.gender);


  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-primary">{PROGRESS_TRACKING_TITLE}</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className={`${buttonClass} whitespace-nowrap`}>
          {showAddForm ? "إخفاء النموذج" : ADD_NEW_ENTRY_BUTTON}
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 bg-card/80 rounded-lg shadow-xl space-y-4 border border-primary/20">
          <h3 className="text-lg font-semibold text-primary-light">تسجيل قراءة جديدة</h3>
          {formError && <p className="text-accent text-xs p-2 bg-accent/10 rounded-md">{formError}</p>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="entryDate" className={labelClass}>{DATE_LABEL}</label>
              <input type="date" id="entryDate" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="entryWeight" className={labelClass}>{WEIGHT_KG_LABEL}</label>
              <input type="number" id="entryWeight" value={currentWeight} onChange={(e) => { setCurrentWeight(e.target.value); setBodyFatResult(null); }} placeholder="مثال: 70.5" className={inputClass} step="0.1" />
            </div>
          </div>
          
          <div className="p-3 bg-card/50 rounded-md mt-3 text-sm space-y-1 border border-primary/20">
            <p className="text-xs text-textMuted">{NAVY_BF_INSTRUCTIONS}</p>
            {userDataForCalc?.height ? (
              <p><strong>{USED_HEIGHT_LABEL}:</strong> {userDataForCalc.height} سم</p>
            ) : (
              <p className="text-accent text-xs">لم يتم إدخال الطول في الحاسبة الرئيسية. لا يمكن حساب نسبة الدهون.</p>
            )}
            {userDataForCalc?.gender ? (
              <p><strong>{USED_GENDER_LABEL}:</strong> {userGenderDisplay}</p>
            ) : (
              <p className="text-accent text-xs">لم يتم تحديد الجنس في الحاسبة الرئيسية. لا يمكن حساب نسبة الدهون.</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="calcNeck" className={labelClass}>{NECK_CM_LABEL}</label>
              <input type="number" id="calcNeck" value={calcNeck} onChange={(e) => handleCalcInputChange(setCalcNeck, e.target.value)} placeholder="مثال: 38" className={inputClass} step="0.1" />
            </div>
            <div>
              <label htmlFor="calcWaist" className={labelClass}>{WAIST_CM_LABEL}</label>
              <input type="number" id="calcWaist" value={calcWaist} onChange={(e) => handleCalcInputChange(setCalcWaist, e.target.value)} placeholder="مثال: 85" className={inputClass} step="0.1" />
            </div>
            {userDataForCalc?.gender === Gender.FEMALE ? (
              <div>
                <label htmlFor="calcHips" className={labelClass}>{HIPS_CM_LABEL}</label>
                <input type="number" id="calcHips" value={calcHips} onChange={(e) => handleCalcInputChange(setCalcHips, e.target.value)} placeholder="مثال: 95" className={inputClass} step="0.1" />
              </div>
            ) : (
                 <div className="hidden sm:block"></div> // Placeholder for layout consistency if not female
            )}
          </div>
           <div> 
              <label htmlFor="entryThigh" className={labelClass}>{THIGH_CM_LABEL}</label>
              <input type="number" id="entryThigh" value={measurements.thigh || ''} onChange={(e) => handleMeasurementChange('thigh', e.target.value)} placeholder="مثال: 55 (اختياري)" className={inputClass} step="0.1" />
           </div>

          <button 
            onClick={handleCalculateBodyFat} 
            className={`${secondaryButtonClass} w-full`} 
            disabled={!canCalculateBfp}
            aria-disabled={!canCalculateBfp}
            title={!canCalculateBfp ? HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE : CALCULATE_BODY_FAT_BUTTON}
          >
            {CALCULATE_BODY_FAT_BUTTON}
          </button>

          {bodyFatResult && (
            <div className={`p-3 bg-card/50 rounded-md mt-3 text-sm space-y-1 border ${bodyFatResult.category === BF_CALCULATION_ERROR_MESSAGE || bodyFatResult.category === HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE || bodyFatResult.category === BODY_FAT_INPUTS_REQUIRED ? 'border-accent/50' : 'border-secondary/30'}`}>
              <p className={`${bodyFatResult.category === BF_CALCULATION_ERROR_MESSAGE || bodyFatResult.category === HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE || bodyFatResult.category === BODY_FAT_INPUTS_REQUIRED ? 'text-accent' : ''}`}>
                <strong>{BODY_FAT_CATEGORY_LABEL}:</strong> {bodyFatResult.category}
              </p>
              {bodyFatResult.percentage > 0 && bodyFatResult.category !== BF_CALCULATION_ERROR_MESSAGE && bodyFatResult.category !== HEIGHT_GENDER_REQUIRED_FOR_BF_MESSAGE && bodyFatResult.category !== BODY_FAT_INPUTS_REQUIRED && (
                <>
                  <p><strong>{BODY_FAT_PERCENTAGE_LABEL}:</strong> {bodyFatResult.percentage.toFixed(1)}%</p>
                  {bodyFatResult.fatMassKg !== undefined && <p><strong>{BODY_FAT_MASS_LABEL}:</strong> {bodyFatResult.fatMassKg.toFixed(1)} كجم</p>}
                  {bodyFatResult.leanMassKg !== undefined && <p><strong>{LEAN_BODY_MASS_LABEL}:</strong> {bodyFatResult.leanMassKg.toFixed(1)} كجم</p>}
                </>
              )}
            </div>
          )}
          
          <button onClick={handleLogEntry} className={`${buttonClass} w-full`} disabled={isSubmitting}>
            {isSubmitting ? LOADING_MESSAGE : LOG_MEASUREMENTS_BUTTON}
          </button>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-primary-light pt-4 border-t border-primary/10">{HISTORICAL_ENTRIES_TITLE}</h3>
        {memoizedEntries.length > 0 ? (
          <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-2">
          {memoizedEntries.map(entry => (
            <div key={entry.id} className="p-3 bg-card/90 rounded-md shadow-sm border-s-4 border-primary/70">
              <div className="flex justify-between items-start mb-1">
                <p className="text-md font-semibold text-primary-light">{new Date(entry.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <button 
                    onClick={async () => { 
                        if(confirm('هل أنت متأكد من حذف هذه القراءة؟')) {
                            setIsSubmitting(true);
                            await onDeleteEntry(entry.id);
                            setIsSubmitting(false);
                        }
                    }} 
                    className="text-accent hover:text-accent-dark text-xs font-bold disabled:opacity-50"
                    disabled={isSubmitting}
                    aria-label="حذف القراءة"
                >
                    &times;
                </button>
              </div>
              <p className="text-sm"><strong>{WEIGHT_KG_LABEL}:</strong> {entry.weight.toFixed(1)} كجم</p>
              {entry.bodyFatPercentage !== undefined && entry.bodyFatPercentage > 0 && ( 
                <>
                  <p className="text-sm"><strong>{BODY_FAT_PERCENTAGE_LABEL}:</strong> {entry.bodyFatPercentage.toFixed(1)}%</p>
                  {entry.bodyFatMass !== undefined && <p className="text-xs text-textMuted">({BODY_FAT_MASS_LABEL}: {entry.bodyFatMass.toFixed(1)} كجم)</p>}
                </>
              )}
              {(entry.measurements.neck || entry.measurements.waist || entry.measurements.hips || entry.measurements.thigh) && (
                <details className="text-xs mt-1">
                  <summary className="cursor-pointer text-textMuted hover:text-textBase">عرض المقاسات المسجلة</summary>
                  <ul className="ps-4 list-disc text-textMuted">
                    {entry.measurements.neck && <li>{NECK_CM_LABEL}: {entry.measurements.neck} سم</li>}
                    {entry.measurements.waist && <li>{WAIST_CM_LABEL}: {entry.measurements.waist} سم</li>}
                    {entry.measurements.hips && <li>{HIPS_CM_LABEL}: {entry.measurements.hips} سم</li>}
                    {entry.measurements.thigh && <li>{THIGH_CM_LABEL}: {entry.measurements.thigh} سم</li>}
                  </ul>
                </details>
              )}
            </div>
          ))}
          </div>
        ) : (
          <p className="text-center text-textMuted p-4 bg-card/50 rounded-md">{NO_PROGRESS_ENTRIES_YET}</p>
        )}
      </div>
    </div>
  );
};

export default ProgressTrackingView;
