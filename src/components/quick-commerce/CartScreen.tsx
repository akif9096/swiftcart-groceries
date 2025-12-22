import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem, Offer, Address } from './types';
import { PromoCodeInput } from './PromoCodeInput';
import { AddressManager } from './AddressManager';

interface CartScreenProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrder: () => void;
  offers: Offer[];
  appliedOffer: Offer | null;
  onApplyOffer: (code: string) => boolean;
  onRemoveOffer: () => void;
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddAddress: (address: Omit<Address, 'id'>) => void;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (id: string) => void;
  discount: number;
}

export const CartScreen = ({
  cart,
  setCart,
  onOrder,
  appliedOffer,
  onApplyOffer,
  onRemoveOffer,
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  discount,
}: CartScreenProps) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal > 200 ? 0 : 25;
  const grandTotal = subtotal - discount + deliveryFee;

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const canOrder = cart.length > 0 && selectedAddress !== null;

  return (
    <div className="p-4 animate-slide-up pb-32">
      <h2 className="text-2xl font-extrabold text-foreground mb-1">Your Cart</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {cart.length === 0 ? 'Your cart is empty' : `${cart.length} item${cart.length > 1 ? 's' : ''}`}
      </p>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No items in cart</p>
          <p className="text-sm text-muted-foreground mt-1">Start adding some items!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-card p-4 rounded-2xl shadow-card">
              <span className="text-3xl">{item.image}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{item.unit}</p>
                <p className="font-bold text-success mt-1">₹{item.price * item.qty}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-muted rounded-xl">
                  <button onClick={() => updateQty(item.id, -1)} className="p-2 hover:bg-primary/10 rounded-l-xl transition-colors">
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <span className="w-8 text-center font-bold text-foreground">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-2 hover:bg-primary/10 rounded-r-xl transition-colors">
                    <Plus className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <p className="text-xs text-muted-foreground mb-3 font-semibold">APPLY COUPON</p>
            <PromoCodeInput appliedOffer={appliedOffer} onApply={onApplyOffer} onRemove={onRemoveOffer} />
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-card">
            <AddressManager addresses={addresses} selectedAddress={selectedAddress} onSelect={onSelectAddress} onAdd={onAddAddress} onEdit={onEditAddress} onDelete={onDeleteAddress} />
          </div>

          <div className="bg-card rounded-2xl p-4 shadow-card space-y-2">
            <p className="text-xs text-muted-foreground font-semibold mb-2">BILL DETAILS</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-success">Discount</span>
                <span className="font-semibold text-success">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className={`font-semibold ${deliveryFee === 0 ? 'text-success' : 'text-foreground'}`}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            {deliveryFee > 0 && <p className="text-xs text-muted-foreground">Add ₹{200 - subtotal} more for free delivery</p>}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-extrabold text-lg text-foreground">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={onOrder}
            disabled={!canOrder}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-button transition-all ${canOrder ? 'gradient-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
          >
            {!selectedAddress ? 'Select Address to Continue' : `Place Order • ₹${grandTotal}`}
          </button>
        </div>
      )}
    </div>
  );
};
