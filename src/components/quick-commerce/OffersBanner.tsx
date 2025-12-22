import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { Offer } from './types';

interface OffersBannerProps {
  offers: Offer[];
  onApply: (offer: Offer) => void;
}

export const OffersBanner = ({ offers, onApply }: OffersBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [offers.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  if (offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  return (
    <div className="px-4 py-3">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/90 to-accent shadow-card">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E\")" }} />
        
        <div className="relative p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Tag className="w-6 h-6 text-accent-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-accent-foreground text-sm truncate">
              {currentOffer.title}
            </h3>
            <p className="text-xs text-accent-foreground/80 truncate">
              {currentOffer.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-white/20 rounded-md text-xs font-bold text-accent-foreground">
                {currentOffer.code}
              </span>
              <span className="text-xs text-accent-foreground/70">
                Min ₹{currentOffer.minOrder}
              </span>
            </div>
          </div>

          <button
            onClick={() => onApply(currentOffer)}
            className="px-3 py-2 bg-white text-accent font-bold text-xs rounded-xl hover:bg-white/90 transition-colors flex-shrink-0"
          >
            Apply
          </button>
        </div>

        {offers.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-accent-foreground" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-accent-foreground" />
            </button>
          </>
        )}

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {offers.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
