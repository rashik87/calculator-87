
import React, { useState } from 'react';
import { 
    REGISTER_TITLE, EMAIL_LABEL, PASSWORD_LABEL, CONFIRM_PASSWORD_LABEL, REGISTER_BUTTON, 
    ALREADY_HAVE_ACCOUNT_PROMPT, LOGIN_LINK, AUTH_ERROR_HEADER, LOADING_MESSAGE,
    REGISTER_WITH_GOOGLE_BUTTON, GOOGLE_REGISTRATION_EMAIL_PROMPT,
    ACCOUNT_IS_EMAIL_PASSWORD_ERROR, GOOGLE_REGISTER_EMAIL_ALREADY_STD_ACCOUNT_ERROR
} from '../../constants';

interface RegisterViewProps {
  onRegister: (email: string, password?: string) => Promise<{success: boolean; message?: string}>;
  onRegisterWithGoogle: (email: string) => Promise<{success: boolean; message?: string}>; // New prop
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onRegisterWithGoogle, onSwitchToLogin, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('PASSWORD_MISMATCH_ERROR'); 
      return;
    }
    if (!email || !password) {
      setError("الرجاء ملء جميع الحقول."); 
      return;
    }
    const result = await onRegister(email, password);
    if (!result.success && result.message) {
      setError(result.message); 
    }
  };

  const handleGoogleRegister = async () => {
    setError(null);
    const googleEmail = prompt(GOOGLE_REGISTRATION_EMAIL_PROMPT);
    if (googleEmail && googleEmail.trim() !== '') {
        setIsGoogleLoading(true);
        const result = await onRegisterWithGoogle(googleEmail.trim());
        setIsGoogleLoading(false);
        if (!result.success && result.message) {
            setError(result.message);
        }
    } else if (googleEmail !== null) { 
        setError("الرجاء إدخال بريد إلكتروني صالح للتسجيل عبر جوجل.");
    }
  };

  const getDisplayError = (errorCode: string | null): string | null => {
    if (!errorCode) return null;
    if (errorCode === 'PASSWORD_MISMATCH_ERROR') return "كلمتا المرور غير متطابقتين.";
    if (errorCode === 'USER_ALREADY_EXISTS_ERROR') return "هذا البريد الإلكتروني مسجل بالفعل. حاول تسجيل الدخول.";
    if (errorCode === ACCOUNT_IS_EMAIL_PASSWORD_ERROR) return GOOGLE_REGISTER_EMAIL_ALREADY_STD_ACCOUNT_ERROR;
    return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
  };

  const inputClass = "w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm";
  const labelClass = "block text-sm font-medium text-textBase mb-1";
  const buttonClass = "w-full text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70";

  return (
    <div className="w-full max-w-md space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">{REGISTER_TITLE}</h2>
      
      {error && (
        <div className="p-3 bg-accent/20 border border-accent/30 rounded-md text-accent text-sm text-center">
          <p className="font-semibold">{AUTH_ERROR_HEADER}</p>
          <p>{getDisplayError(error)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-email" className={labelClass}>{EMAIL_LABEL}</label>
          <input 
            type="email" 
            id="register-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={inputClass} 
            required
            placeholder="example@example.com"
          />
        </div>
        <div>
          <label htmlFor="register-password" className={labelClass}>{PASSWORD_LABEL}</label>
          <input 
            type="password" 
            id="register-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={inputClass} 
            required 
            minLength={6}
            placeholder="******** (6+ حروف)"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className={labelClass}>{CONFIRM_PASSWORD_LABEL}</label>
          <input 
            type="password" 
            id="confirm-password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className={inputClass} 
            required 
            placeholder="********"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading || isGoogleLoading}
          className={`${buttonClass} bg-primary hover:bg-primary-dark focus:ring-primary-light`}
        >
          {isLoading ? LOADING_MESSAGE : REGISTER_BUTTON}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-textMuted">أو</span>
        </div>
      </div>

      <button 
        type="button" 
        onClick={handleGoogleRegister} 
        disabled={isLoading || isGoogleLoading}
        className={`${buttonClass} bg-red-600 hover:bg-red-700 focus:ring-red-500`}
      >
        {isGoogleLoading ? LOADING_MESSAGE : REGISTER_WITH_GOOGLE_BUTTON}
      </button>

      <p className="text-center text-sm text-textMuted">
        {ALREADY_HAVE_ACCOUNT_PROMPT}{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-primary-light hover:text-primary transition-colors hover:underline">
          {LOGIN_LINK}
        </button>
      </p>
    </div>
  );
};

export default RegisterView;
