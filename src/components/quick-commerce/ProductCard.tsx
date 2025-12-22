import { Star, Clock, Heart, Plus, MessageSquare } from 'lucide-react';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onFav: (id: number) => void;
  isFavorite: boolean;
  onRate?: () => void;
  reviewCount?: number;
}

export const ProductCard = ({ product, onAdd, onFav, isFavorite, onRate, reviewCount = 0 }: ProductCardProps) => (
  <div className="bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in group">
    <div className="flex justify-between items-start mb-2">
      <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{product.image}</div>
      <button onClick={() => onFav(product.id)} className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
        <Heart className={`w-4 h-4 transition-all duration-200 ${isFavorite ? 'text-destructive fill-destructive animate-pulse-once' : 'text-muted-foreground hover:text-destructive'}`} />
      </button>
    </div>

    <h3 className="font-bold text-foreground text-sm leading-tight">{product.name}</h3>
    {product.unit && <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>}

    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
      <button onClick={onRate} className="flex items-center gap-1 hover:text-accent transition-colors">
        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
        <span className="font-semibold">{product.rating}</span>
        {reviewCount > 0 && <span>({reviewCount})</span>}
      </button>
      <span className="flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" />
        <span>{product.eta}</span>
      </span>
    </div>

    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
      <span className="font-extrabold text-success text-lg">₹{product.price}</span>
      <button onClick={() => onAdd(product)} className="flex items-center gap-1.5 gradient-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm shadow-button hover:opacity-90 active:scale-95 transition-all">
        <Plus className="w-4 h-4" />
        Add
      </button>
    </div>
  </div>
);
