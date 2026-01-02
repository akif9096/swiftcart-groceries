import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Phone } from 'lucide-react';
import { useState } from 'react';

interface AuthScreenProps {
  onBack: () => void;
  onLogin: (user: { name: string; email: string; phone: string }) => void;
}

export const AuthScreen = ({ onBack, onLogin }: AuthScreenProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (mode === 'signup') {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Enter 10-digit phone number';
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate successful auth
      onLogin({
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        phone: formData.phone || '+91 9876543210',
      });
    }
  };

  const inputClass = (field: string) => `
    w-full pl-12 pr-4 py-3.5 bg-muted rounded-2xl text-foreground 
    placeholder:text-muted-foreground text-sm font-medium 
    focus:outline-none focus:ring-2 transition-all
    ${errors[field] ? 'ring-2 ring-destructive focus:ring-destructive' : 'focus:ring-primary/30'}
  `;

  return (
    <div className="min-h-screen p-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-2xl font-extrabold text-foreground">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
      </div>

      {/* Logo/Branding */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center shadow-button mb-4">
          <span className="text-4xl">🛒</span>
        </div>
        <h1 className="text-xl font-extrabold text-foreground">QuickCart</h1>
        <p className="text-sm text-muted-foreground">Groceries in 10 minutes</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 bg-muted rounded-2xl mb-6">
        <button
          onClick={() => { setMode('login'); setErrors({}); }}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            mode === 'login'
              ? 'bg-card text-foreground shadow-card'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => { setMode('signup'); setErrors({}); }}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            mode === 'signup'
              ? 'bg-card text-foreground shadow-card'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Name (Signup only) */}
        {mode === 'signup' && (
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={inputClass('name')}
              />
            </div>
            {errors.name && <p className="text-xs text-destructive mt-1 ml-1">{errors.name}</p>}
          </div>
        )}

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={inputClass('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive mt-1 ml-1">{errors.email}</p>}
        </div>

        {/* Phone (Signup only) */}
        {mode === 'signup' && (
          <div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                className={inputClass('phone')}
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive mt-1 ml-1">{errors.phone}</p>}
          </div>
        )}

        {/* Password */}
        <div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className={`${inputClass('password')} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive mt-1 ml-1">{errors.password}</p>}
        </div>

        {/* Forgot Password (Login only) */}
        {mode === 'login' && (
          <div className="text-right">
            <button className="text-sm text-primary font-semibold hover:underline">
              Forgot Password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-button hover:opacity-90 active:scale-[0.98] transition-all mt-6"
        >
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social Login */}
        <div className="flex gap-3">
          <button
            onClick={() => { window.location.href = '/api/auth/google'; }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-shadow"
          >
            <span className="text-xl">📱</span>
            <span className="font-semibold text-foreground text-sm">Google</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
            <span className="text-xl">🍎</span>
            <span className="font-semibold text-foreground text-sm">Apple</span>
          </button>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-muted-foreground text-center mt-8">
        By continuing, you agree to our{' '}
        <button className="text-primary font-semibold">Terms of Service</button>
        {' '}and{' '}
        <button className="text-primary font-semibold">Privacy Policy</button>
      </p>
    </div>
  );
};
