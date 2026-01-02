import { Star, Clock, Heart, Plus } from 'lucide-react';
import { Product } from './types';

const isDataUrl = (s: string) => s && s.startsWith && s.startsWith('data:');

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onFav: (id: number) => void;
  isFavorite: boolean;
}

export const ProductCard = ({ product, onAdd, onFav, isFavorite }: ProductCardProps) => (
  <div className="card-elevated card-3d p-3 animate-scale-in">
    <div className="relative rounded-2xl overflow-hidden bg-muted inset-soft">
      <div className="w-full h-44 sm:h-40 md:h-44 lg:h-44 bg-muted flex items-center justify-center image-3d">
        {isDataUrl(product.image) ? (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-6xl">{product.image}</div>
        )}
      </div>

      {/* Price chip */}
      <div className="price-chip absolute left-3 top-3">₹{product.price}</div>

      {/* Favorite */}
      <button
        onClick={() => onFav(product.id)}
        className="absolute right-3 top-3 p-2 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm"
      >
        <Heart
          className={`w-4 h-4 transition-all duration-200 ${
            isFavorite ? 'text-destructive fill-destructive animate-pulse-once' : 'text-muted-foreground hover:text-destructive'
          }`}
        />
      </button>

      {/* Add pill */}
      <button
        onClick={() => onAdd(product)}
        className="add-pill absolute right-3 bottom-3 flex items-center justify-center btn-3d"
        aria-label={`Add ${product.name}`}
      >
        <Plus className="w-4 h-4 text-white drop-shadow-md" />
      </button>
    </div>

    <div className="mt-3">
      <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{product.name}</h3>
      {product.unit && <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>}

      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="font-semibold">{product.rating}</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{product.eta}</span>
        </span>
      </div>
    </div>
  </div>
);
