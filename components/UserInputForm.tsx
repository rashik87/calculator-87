
import React, { useState } from 'react';
import { UserData, Gender, ActivityLevel } from '../types';
import { GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from '../constants';

interface UserInputFormProps {
  onSubmit: (data: UserData) => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<UserData>>({
    gender: Gender.MALE,
    activityLevel: ActivityLevel.MODERATE,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' ? parseFloat(value) || '' : value }));
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.age || formData.age <= 0) newErrors.age = "العمر مطلوب ويجب أن يكون أكبر من صفر.";
    if (!formData.height || formData.height <= 0) newErrors.height = "الطول مطلوب ويجب أن يكون أكبر من صفر.";
    if (!formData.weight || formData.weight <= 0) newErrors.weight = "الوزن مطلوب ويجب أن يكون أكبر من صفر.";
    if (!formData.gender) newErrors.gender = "الجنس مطلوب.";
    if (!formData.activityLevel) newErrors.activityLevel = "مستوى النشاط مطلوب.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as UserData);
    }
  };

  const inputClass = "w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm";
  const labelClass = "block text-sm font-medium text-textBase mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg">
      <div>
        <label htmlFor="gender" className={labelClass}>الجنس</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
          {GENDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {errors.gender && <p className="text-accent text-xs mt-1">{errors.gender}</p>}
      </div>

      <div>
        <label htmlFor="age" className={labelClass}>العمر (سنوات)</label>
        <input type="number" id="age" name="age" value={formData.age || ''} onChange={handleChange} className={inputClass} placeholder="مثال: 30" />
        {errors.age && <p className="text-accent text-xs mt-1">{errors.age}</p>}
      </div>

      <div>
        <label htmlFor="height" className={labelClass}>الطول (سم)</label>
        <input type="number" id="height" name="height" value={formData.height || ''} onChange={handleChange} className={inputClass} placeholder="مثال: 175" />
        {errors.height && <p className="text-accent text-xs mt-1">{errors.height}</p>}
      </div>

      <div>
        <label htmlFor="weight" className={labelClass}>الوزن (كجم)</label>
        <input type="number" id="weight" name="weight" value={formData.weight || ''} onChange={handleChange} className={inputClass} placeholder="مثال: 70" />
        {errors.weight && <p className="text-accent text-xs mt-1">{errors.weight}</p>}
      </div>

      <div>
        <label htmlFor="activityLevel" className={labelClass}>مستوى النشاط الأسبوعي</label>
        <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={inputClass}>
          {ACTIVITY_LEVEL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {errors.activityLevel && <p className="text-accent text-xs mt-1">{errors.activityLevel}</p>}
      </div>

      <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-lg hover:shadow-primary/50 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 focus:ring-offset-background">
        احسب السعرات الحرارية
      </button>
    </form>
  );
};

export default UserInputForm;