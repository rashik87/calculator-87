
import React from 'react';
import { DietProtocol } from '../types';
import { DIET_PROTOCOL_OPTIONS } from '../constants';

interface DietSelectorProps {
  onSelect: (diet: DietProtocol) => void;
  currentDiet: DietProtocol;
}

const DietSelector: React.FC<DietSelectorProps> = ({ onSelect, currentDiet }) => {
  return (
    <div className="space-y-4 w-full max-w-lg">
      <label htmlFor="dietProtocol" className="block text-lg font-medium text-primary mb-2">اختر نظامك الغذائي</label>
      <select 
        id="dietProtocol" 
        value={currentDiet} 
        onChange={(e) => onSelect(e.target.value as DietProtocol)}
        className="w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm"
      >
        {DIET_PROTOCOL_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

export default DietSelector;