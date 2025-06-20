import React, { useState } from 'react';
import { 
    LOGIN_TITLE, EMAIL_LABEL, PASSWORD_LABEL, LOGIN_BUTTON, 
    NO_ACCOUNT_PROMPT, SIGN_UP_LINK, AUTH_ERROR_HEADER, LOADING_MESSAGE,
    INVALID_CREDENTIALS_ERROR, ACCOUNT_IS_GOOGLE_LOGIN_ERROR, ACCOUNT_IS_EMAIL_PASSWORD_ERROR,
    GOOGLE_USER_NOT_FOUND_ERROR, GOOGLE_USER_NOT_FOUND_DISPLAY_MESSAGE
} from '../../constants';

interface LoginViewProps {
  onLogin: (email: string, password?: string) => Promise<{success: boolean; message?: string}>; 
  onSwitchToRegister: () => void;
  isLoading: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSwitchToRegister, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }
    const result = await onLogin(email, password);
    if (!result.success && result.message) {
      setError(result.message); 
    }
  };
  
  const getDisplayError = (errorCode: string | null): string | null => {
    if (!errorCode) return null;
    if (errorCode === INVALID_CREDENTIALS_ERROR) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    if (errorCode === ACCOUNT_IS_GOOGLE_LOGIN_ERROR) return "هذا الحساب مسجل عبر جوجل. الرجاء استخدام زر 'تسجيل الدخول بحساب جوجل'."; // This message might become less relevant if Google login is fully removed elsewhere
    if (errorCode === ACCOUNT_IS_EMAIL_PASSWORD_ERROR) return "هذا البريد الإلكتروني مسجل بحساب عادي (بريد وكلمة مرور). الرجاء إدخال كلمة المرور أو استخدام بريد جوجل آخر.";
    if (errorCode === GOOGLE_USER_NOT_FOUND_ERROR) return GOOGLE_USER_NOT_FOUND_DISPLAY_MESSAGE; // Also potentially less relevant now
    return "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
  };


  const inputClass = "w-full bg-card border border-primary/30 text-textBase rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder-textMuted/70 shadow-sm";
  const labelClass = "block text-sm font-medium text-textBase mb-1";
  const buttonClass = "w-full text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70";

  return (
    <div className="w-full max-w-md space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">{LOGIN_TITLE}</h2>
      
      {error && (
        <div className="p-3 bg-accent/20 border border-accent/30 rounded-md text-accent text-sm text-center">
          <p className="font-semibold">{AUTH_ERROR_HEADER}</p>
          <p>{getDisplayError(error)}</p>
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className={labelClass}>{EMAIL_LABEL}</label>
          <input 
            type="email" 
            id="login-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={inputClass} 
            required 
            placeholder="example@example.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className={labelClass}>{PASSWORD_LABEL}</label>
          <input 
            type="password" 
            id="login-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={inputClass} 
            required 
            placeholder="********"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className={`${buttonClass} bg-primary hover:bg-primary-dark focus:ring-primary-light`}
        >
          {isLoading ? LOADING_MESSAGE : LOGIN_BUTTON}
        </button>
      </form>

      <p className="text-center text-sm text-textMuted pt-4">
        {NO_ACCOUNT_PROMPT}{' '}
        <button onClick={onSwitchToRegister} className="font-medium text-primary-light hover:text-primary transition-colors hover:underline">
          {SIGN_UP_LINK}
        </button>
      </p>
    </div>
  );
};

export default LoginView;