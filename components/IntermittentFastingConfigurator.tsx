
import React, { useState } from 'react';
import { IntermittentFastingConfig } from '../types';

interface IntermittentFastingConfiguratorProps {
  onSubmit: (config: IntermittentFastingConfig) => void;
  initialConfig?: IntermittentFastingConfig;
}

const IntermittentFastingConfigurator: React.FC<IntermittentFastingConfiguratorProps> = ({ onSubmit, initialConfig }) => {
  const [config, setConfig] = useState<IntermittentFastingConfig>(initialConfig || {
    eatingWindowStart: '12:00',
    eatingWindowEnd: '20:00',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation could be added here (e.g., end time after start time)
    onSubmit(config);
  };

  const inputClass = "w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm";
  const labelClass = "block text-sm font-medium text-textBase mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg mt-4 p-6 bg-card/70 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-primary mb-4">إعدادات الصيام المتقطع (16/8)</h3>
      <p className="text-textMuted mb-4 text-sm">حدد نافذة الأكل الخاصة بك (عادة 8 ساعات).</p>
      
      <div>
        <label htmlFor="eatingWindowStart" className={labelClass}>بداية نافذة الأكل</label>
        <input type="time" id="eatingWindowStart" name="eatingWindowStart" value={config.eatingWindowStart} onChange={handleChange} className={inputClass} />
      </div>
      <div>
        <label htmlFor="eatingWindowEnd" className={labelClass}>نهاية نافذة الأكل</label>
        <input type="time" id="eatingWindowEnd" name="eatingWindowEnd" value={config.eatingWindowEnd} onChange={handleChange} className={inputClass} />
      </div>
      
      <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-lg hover:shadow-primary/50 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 focus:ring-offset-background">
        تأكيد إعدادات الصيام المتقطع
      </button>
    </form>
  );
};

export default IntermittentFastingConfigurator;