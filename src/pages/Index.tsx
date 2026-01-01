import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/quick-commerce/Header';
import { CategoryBar } from '@/components/quick-commerce/CategoryBar';
import { ProductCard } from '@/components/quick-commerce/ProductCard';
import { CartScreen } from '@/components/quick-commerce/CartScreen';
import { BottomNav } from '@/components/quick-commerce/BottomNav';
import { OrderSuccess } from '@/components/quick-commerce/OrderSuccess';
import { ProfileScreen } from '@/components/quick-commerce/ProfileScreen';
import { CheckoutScreen } from '@/components/quick-commerce/CheckoutScreen';
import { AddressScreen } from '@/components/quick-commerce/AddressScreen';
import { AuthScreen } from '@/components/quick-commerce/AuthScreen';
import { LoginPromptDialog } from '@/components/quick-commerce/LoginPromptDialog';
import { OrderConfirmDialog } from '@/components/quick-commerce/OrderConfirmDialog';
import { CATEGORIES, PRODUCTS } from '@/components/quick-commerce/data';
import { CartItem, Product, Address, User } from '@/components/quick-commerce/types';
import { toast } from 'sonner';

const Index = () => {
  const [screen, setScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  
  // Dialog states
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [pendingPaymentMethod, setPendingPaymentMethod] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('quickcart-cart');
    const savedFavorites = localStorage.getItem('quickcart-favorites');
    const savedAddresses = localStorage.getItem('quickcart-addresses');
    const savedUser = localStorage.getItem('quickcart-user');
    const savedProducts = localStorage.getItem('quickcart-admin-products');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses);
      setAddresses(parsedAddresses);
      if (parsedAddresses.length > 0) setSelectedAddress(parsedAddresses[0]);
    }
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('quickcart-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('quickcart-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('quickcart-addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('quickcart-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('quickcart-user');
    }
  }, [user]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.categoryId === Number(selectedCategory);
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory, products]);

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

  const goToCheckout = () => {
    // Check if user is logged in
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setScreen('checkout');
  };

  const handlePayment = (method: string) => {
    // Show confirmation popup before placing order
    setPendingPaymentMethod(method);
    setShowOrderConfirm(true);
  };

  const confirmOrder = () => {
    setShowOrderConfirm(false);
    setCart([]);
    setScreen('success');
    toast.success(`Order placed with ${pendingPaymentMethod.toUpperCase()}!`, {
      duration: 3000,
    });
  };

  const handleAddAddress = (address: Address) => {
    setAddresses(prev => [...prev, address]);
    setSelectedAddress(address);
    toast.success('Address saved!', { duration: 2000 });
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setScreen('profile');
    toast.success(`Welcome, ${userData.name}!`, { duration: 2000 });
  };

  const handleLogout = () => {
    setUser(null);
    toast('Logged out successfully', { duration: 2000 });
  };

  const handleLoginPromptLogin = () => {
    setShowLoginPrompt(false);
    setScreen('auth');
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = cartTotal > 200 ? 0 : 25;
  const taxes = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + taxes;

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
        <CartScreen cart={cart} setCart={setCart} onCheckout={goToCheckout} />
      )}

      {screen === 'checkout' && (
        <CheckoutScreen 
          cart={cart}
          selectedAddress={selectedAddress}
          onSelectAddress={() => setScreen('address')}
          onPayment={handlePayment}
          onBack={() => setScreen('cart')}
        />
      )}

      {screen === 'address' && (
        <AddressScreen
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={(addr) => {
            setSelectedAddress(addr);
            setScreen('checkout');
          }}
          onAddAddress={handleAddAddress}
          onBack={() => setScreen('checkout')}
        />
      )}

      {screen === 'auth' && (
        <AuthScreen onBack={() => setScreen('profile')} onLogin={handleLogin} />
      )}

      {screen === 'profile' && (
        <ProfileScreen 
          user={user} 
          onSignIn={() => setScreen('auth')} 
          onLogout={handleLogout}
          onAddresses={() => setScreen('address')}
        />
      )}

      {screen === 'success' && (
        <OrderSuccess onBack={() => setScreen('home')} />
      )}

      {!['success', 'checkout', 'address', 'auth'].includes(screen) && (
        <BottomNav active={screen} setActive={setScreen} cartCount={totalCartItems} />
      )}

      {/* Login Prompt Dialog */}
      <LoginPromptDialog 
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLoginPromptLogin}
      />

      {/* Order Confirmation Dialog */}
      <OrderConfirmDialog
        open={showOrderConfirm}
        onClose={() => setShowOrderConfirm(false)}
        onConfirm={confirmOrder}
        totalAmount={grandTotal}
        itemCount={cart.length}
        address={selectedAddress}
        paymentMethod={pendingPaymentMethod}
      />
    </div>
  );
};

export default Index;
