import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/quick-commerce/Header';
import { CategoryBar } from '@/components/quick-commerce/CategoryBar';
import { ProductCard } from '@/components/quick-commerce/ProductCard';
import { CartScreen } from '@/components/quick-commerce/CartScreen';
import { BottomNav } from '@/components/quick-commerce/BottomNav';
import { OrderSuccess } from '@/components/quick-commerce/OrderSuccess';
import { ProfileScreen } from '@/components/quick-commerce/ProfileScreen';
import { CATEGORIES, PRODUCTS } from '@/components/quick-commerce/data';
import { CartItem, Product } from '@/components/quick-commerce/types';
import { toast } from 'sonner';

const Index = () => {
  const [screen, setScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('quickcart-cart');
    const savedFavorites = localStorage.getItem('quickcart-favorites');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('quickcart-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('quickcart-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.categoryId === Number(selectedCategory);
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: 'top-center',
    });
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      if (isFav) {
        toast('Removed from favorites', { duration: 1500 });
        return prev.filter((x) => x !== id);
      }
      toast.success('Added to favorites!', { duration: 1500 });
      return [...prev, id];
    });
  };

  const placeOrder = () => {
    setCart([]);
    setScreen('success');
    toast.success('Order placed successfully!', {
      duration: 3000,
    });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background pb-24">
      {screen === 'home' && (
        <>
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <CategoryBar
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          <div className="px-4 mb-3">
            <h2 className="text-lg font-bold text-foreground">
              {selectedCategory === 'all' 
                ? 'All Products' 
                : CATEGORIES.find(c => String(c.id) === selectedCategory)?.name || 'Products'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 px-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
                onFav={toggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-6xl mb-4">🔍</span>
              <p className="text-muted-foreground font-medium">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
            </div>
          )}
        </>
      )}

      {screen === 'cart' && (
        <CartScreen cart={cart} setCart={setCart} onOrder={placeOrder} />
      )}

      {screen === 'profile' && <ProfileScreen />}

      {screen === 'success' && (
        <OrderSuccess onBack={() => setScreen('home')} />
      )}

      {screen !== 'success' && (
        <BottomNav active={screen} setActive={setScreen} cartCount={totalCartItems} />
      )}
    </div>
  );
};

export default Index;
