import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import { Offer } from './types';

interface PromoCodeInputProps {
  appliedOffer: Offer | null;
  onApply: (code: string) => boolean;
  onRemove: () => void;
}

export const PromoCodeInput = ({ appliedOffer, onApply, onRemove }: PromoCodeInputProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleApply = () => {
    if (!code.trim()) {
      setError('Enter a promo code');
      return;
    }
    
    const isValid = onApply(code.trim().toUpperCase());
    if (isValid) {
      setSuccess(true);
      setError('');
      setCode('');
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError('Invalid promo code');
      setSuccess(false);
    }
  };

  if (appliedOffer) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
          <Check className="w-5 h-5 text-success" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-success text-sm">{appliedOffer.code} applied!</p>
          <p className="text-xs text-success/80">
            {appliedOffer.discountType === 'percent' 
              ? `${appliedOffer.discount}% off` 
              : `₹${appliedOffer.discount} off`}
            {appliedOffer.maxDiscount && ` (up to ₹${appliedOffer.maxDiscount})`}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-success/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-success" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="Enter promo code"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={handleApply}
          className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            success
              ? 'bg-success text-success-foreground'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {success ? <Check className="w-5 h-5" /> : 'Apply'}
        </button>
      </div>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
};
