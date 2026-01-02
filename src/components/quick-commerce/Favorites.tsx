import { Product } from './types';
import { ProductCard } from './ProductCard';

interface FavoritesProps {
  products: Product[];
  favorites: number[];
  onAdd: (product: Product) => void;
  onFavToggle: (id: number) => void;
}

export const Favorites = ({ products, favorites, onAdd, onFavToggle }: FavoritesProps) => {
  const favProducts = products.filter((p) => favorites.includes(p.id));

  if (favProducts.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-semibold text-foreground">No favorites yet</p>
        <p className="text-sm text-muted-foreground mt-2">Tap the heart on a product to add it here.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-foreground mb-3">Your Favorites</h2>
      <div className="grid grid-cols-2 gap-3">
        {favProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={onAdd}
            onFav={onFavToggle}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
