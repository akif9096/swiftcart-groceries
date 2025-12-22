import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Product } from './types';
import { toast } from 'sonner';

interface RatingModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const RatingModal = ({ product, onClose, onSubmit }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    onSubmit(rating, comment);
    toast.success('Thanks for your review!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-t-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Rate Product</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{product.image}</span>
          <div>
            <h4 className="font-bold text-foreground">{product.name}</h4>
            <p className="text-sm text-muted-foreground">{product.unit}</p>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-10 h-10 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mb-4">
          {rating === 0
            ? 'Tap to rate'
            : rating <= 2
            ? 'We\'ll do better!'
            : rating <= 3
            ? 'Thanks for your feedback'
            : rating <= 4
            ? 'Glad you liked it!'
            : 'Awesome! 🎉'}
        </p>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold shadow-button hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};
