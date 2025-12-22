import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/quick-commerce/Header';
import { CategoryBar } from '@/components/quick-commerce/CategoryBar';
import { ProductCard } from '@/components/quick-commerce/ProductCard';
import { CartScreen } from '@/components/quick-commerce/CartScreen';
import { BottomNav } from '@/components/quick-commerce/BottomNav';
import { OrderSuccess } from '@/components/quick-commerce/OrderSuccess';
import { ProfileScreen } from '@/components/quick-commerce/ProfileScreen';
import { OffersBanner } from '@/components/quick-commerce/OffersBanner';
import { OrderTracking } from '@/components/quick-commerce/OrderTracking';
import { RatingModal } from '@/components/quick-commerce/RatingModal';
import { CATEGORIES, PRODUCTS } from '@/components/quick-commerce/data';
import { SAMPLE_OFFERS, SAMPLE_ADDRESSES, SAMPLE_REVIEWS, DELIVERY_PARTNERS } from '@/components/quick-commerce/sampleData';
import { CartItem, Product, Offer, Address, Order, Review } from '@/components/quick-commerce/types';
import { toast } from 'sonner';

const Index = () => {
  const [screen, setScreen] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // New state for features
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(SAMPLE_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    SAMPLE_ADDRESSES.find((a) => a.isDefault) || null
  );
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [ratingProduct, setRatingProduct] = useState<Product | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('quickcart-cart');
    const savedFavorites = localStorage.getItem('quickcart-favorites');
    const savedAddresses = localStorage.getItem('quickcart-addresses');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
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

  // Calculate discount
  const discount = useMemo(() => {
    if (!appliedOffer) return 0;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (subtotal < appliedOffer.minOrder) return 0;
    
    if (appliedOffer.discountType === 'percent') {
      const calculated = Math.round((subtotal * appliedOffer.discount) / 100);
      return appliedOffer.maxDiscount ? Math.min(calculated, appliedOffer.maxDiscount) : calculated;
    }
    return appliedOffer.discount;
  }, [appliedOffer, cart]);

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

  const handleApplyOffer = (code: string): boolean => {
    const offer = SAMPLE_OFFERS.find((o) => o.code === code);
    if (offer) {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      if (subtotal < offer.minOrder) {
        toast.error(`Minimum order ₹${offer.minOrder} required`);
        return false;
      }
      setAppliedOffer(offer);
      return true;
    }
    return false;
  };

  const handleApplyOfferFromBanner = (offer: Offer) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (subtotal < offer.minOrder) {
      toast.error(`Add items worth ₹${offer.minOrder} to use this offer`);
      return;
    }
    setAppliedOffer(offer);
    toast.success(`${offer.code} applied!`);
  };

  const handleAddAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };
    setAddresses((prev) => [...prev, newAddress]);
    if (address.isDefault || addresses.length === 0) {
      setSelectedAddress(newAddress);
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddresses((prev) => prev.map((a) => (a.id === address.id ? address : a)));
    if (selectedAddress?.id === address.id) {
      setSelectedAddress(address);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(addresses.find((a) => a.id !== id) || null);
    }
  };

  const placeOrder = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const deliveryFee = subtotal > 200 ? 0 : 25;
    const partner = DELIVERY_PARTNERS[Math.floor(Math.random() * DELIVERY_PARTNERS.length)];

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      items: [...cart],
      total: subtotal - discount + deliveryFee,
      discount,
      deliveryFee,
      status: 'preparing',
      address: selectedAddress,
      deliveryPartner: partner,
      estimatedTime: 10,
      placedAt: new Date().toISOString(),
    };

    setCurrentOrder(newOrder);
    setCart([]);
    setAppliedOffer(null);
    setScreen('tracking');
    toast.success('Order placed successfully!', { duration: 3000 });

    // Simulate order progress
    setTimeout(() => {
      setCurrentOrder((prev) => prev ? { ...prev, status: 'picked' } : null);
    }, 5000);
    setTimeout(() => {
      setCurrentOrder((prev) => prev ? { ...prev, status: 'on_the_way' } : null);
    }, 10000);
    setTimeout(() => {
      setCurrentOrder((prev) => prev ? { ...prev, status: 'delivered' } : null);
    }, 15000);
  };

  const handleAddReview = (rating: number, comment: string) => {
    if (!ratingProduct) return;
    const newReview: Review = {
      id: Date.now().toString(),
      productId: ratingProduct.id,
      userId: 'guest',
      userName: 'Guest User',
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const getProductReviews = (productId: number) => {
    return reviews.filter((r) => r.productId === productId);
  };

  const getAverageRating = (productId: number) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    return productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background pb-24">
      {screen === 'home' && (
        <>
          <Header 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            selectedAddress={selectedAddress}
            onAddressClick={() => setScreen('cart')}
          />
          
          <OffersBanner offers={SAMPLE_OFFERS} onApply={handleApplyOfferFromBanner} />
          
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
                onRate={() => setRatingProduct(product)}
                reviewCount={getProductReviews(product.id).length}
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
        <CartScreen
          cart={cart}
          setCart={setCart}
          onOrder={placeOrder}
          offers={SAMPLE_OFFERS}
          appliedOffer={appliedOffer}
          onApplyOffer={handleApplyOffer}
          onRemoveOffer={() => setAppliedOffer(null)}
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={setSelectedAddress}
          onAddAddress={handleAddAddress}
          onEditAddress={handleEditAddress}
          onDeleteAddress={handleDeleteAddress}
          discount={discount}
        />
      )}

      {screen === 'profile' && <ProfileScreen />}

      {screen === 'success' && (
        <OrderSuccess onBack={() => setScreen('home')} />
      )}

      {screen === 'tracking' && currentOrder && (
        <OrderTracking order={currentOrder} onBack={() => setScreen('home')} />
      )}

      {ratingProduct && (
        <RatingModal
          product={ratingProduct}
          onClose={() => setRatingProduct(null)}
          onSubmit={handleAddReview}
        />
      )}

      {screen !== 'success' && screen !== 'tracking' && (
        <BottomNav active={screen} setActive={setScreen} cartCount={totalCartItems} />
      )}
    </div>
  );
};

export default Index;
