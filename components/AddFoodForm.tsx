
import React, { useState } from 'react';
import { FoodItem } from '../types';
import { 
  FOOD_NAME_LABEL, 
  CALORIES_LABEL, 
  PROTEIN_LABEL, 
  CARBS_LABEL, 
  FAT_LABEL, 
  SERVING_SIZE_LABEL,
  SERVING_SIZE_PLACEHOLDER,
  SUBMIT_NEW_FOOD_BUTTON,
  CANCEL_BUTTON,
  LABEL_PER_SERVING,
  REQUIRED_FIELD_ERROR,
  POSITIVE_NUMBER_ERROR
} from '../constants';

interface AddFoodFormProps {
  onSubmit: (foodData: Omit<FoodItem, 'id' | 'isCustom' | 'userId'>) => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  servingSize: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const AddFoodForm: React.FC<AddFoodFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = REQUIRED_FIELD_ERROR;
    if (!formData.servingSize.trim()) newErrors.servingSize = REQUIRED_FIELD_ERROR;

    const numericFields: (keyof FormData)[] = ['calories', 'protein', 'carbs', 'fat'];
    numericFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = REQUIRED_FIELD_ERROR;
      } else if (isNaN(parseFloat(formData[field])) || parseFloat(formData[field]) < 0) {
        newErrors[field] = POSITIVE_NUMBER_ERROR;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: formData.name.trim(),
        calories: parseFloat(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fat: parseFloat(formData.fat),
        servingSize: formData.servingSize.trim(),
      });
    }
  };

  const inputClass = "w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm";
  const labelClass = "block text-sm font-medium text-textBase mb-1";

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto ring-1 ring-primary/20">
        <h2 className="text-xl font-semibold text-primary mb-4">إضافة طعام جديد</h2>
        
        <div>
          <label htmlFor="name" className={labelClass}>{FOOD_NAME_LABEL}</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
          {errors.name && <p className="text-accent text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="servingSize" className={labelClass}>{SERVING_SIZE_LABEL}</label>
          <input type="text" id="servingSize" name="servingSize" value={formData.servingSize} onChange={handleChange} className={inputClass} placeholder={SERVING_SIZE_PLACEHOLDER} />
          {errors.servingSize && <p className="text-accent text-xs mt-1">{errors.servingSize}</p>}
        </div>

        <p className="text-xs text-textMuted">{LABEL_PER_SERVING}</p>

        <div>
          <label htmlFor="calories" className={labelClass}>{CALORIES_LABEL}</label>
          <input type="number" id="calories" name="calories" value={formData.calories} onChange={handleChange} className={inputClass} step="any" min="0"/>
          {errors.calories && <p className="text-accent text-xs mt-1">{errors.calories}</p>}
        </div>

        <div>
          <label htmlFor="protein" className={labelClass}>{PROTEIN_LABEL}</label>
          <input type="number" id="protein" name="protein" value={formData.protein} onChange={handleChange} className={inputClass} step="any" min="0"/>
          {errors.protein && <p className="text-accent text-xs mt-1">{errors.protein}</p>}
        </div>

        <div>
          <label htmlFor="carbs" className={labelClass}>{CARBS_LABEL}</label>
          <input type="number" id="carbs" name="carbs" value={formData.carbs} onChange={handleChange} className={inputClass} step="any" min="0"/>
          {errors.carbs && <p className="text-accent text-xs mt-1">{errors.carbs}</p>}
        </div>

        <div>
          <label htmlFor="fat" className={labelClass}>{FAT_LABEL}</label>
          <input type="number" id="fat" name="fat" value={formData.fat} onChange={handleChange} className={inputClass} step="any" min="0"/>
          {errors.fat && <p className="text-accent text-xs mt-1">{errors.fat}</p>}
        </div>

        <div className="flex space-x-3 rtl:space-x-reverse pt-4">
          <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 shadow hover:shadow-md">
            {SUBMIT_NEW_FOOD_BUTTON}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-600 hover:bg-gray-700 text-textBase font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 shadow hover:shadow-md">
            {CANCEL_BUTTON}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFoodForm;
