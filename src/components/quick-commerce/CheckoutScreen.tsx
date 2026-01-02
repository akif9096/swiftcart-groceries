import { CreditCard, Wallet, Banknote, MapPin, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { CartItem, Address } from './types';
import { useState } from 'react';

const isDataUrl = (s: string) => s && s.startsWith && s.startsWith('data:');

interface CheckoutScreenProps {
  cart: CartItem[];
  selectedAddress: Address | null;
  onSelectAddress: () => void;
  onPayment: (method: string) => void;
  onBack: () => void;
}

export const CheckoutScreen = ({ 
  cart, 
  selectedAddress, 
  onSelectAddress, 
  onPayment,
  onBack 
}: CheckoutScreenProps) => {
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal > 200 ? 0 : 25;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + taxes;

  const paymentMethods = [
    { id: 'upi', name: 'UPI', description: 'GPay, PhonePe, Paytm', icon: Wallet, popular: true },
    { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay', icon: CreditCard, popular: false },
    { id: 'cod', name: 'Cash on Delivery', description: 'Pay when delivered', icon: Banknote, popular: false },
  ];

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      return;
    }
    if (!selectedPayment) {
      return;
    }
    onPayment(selectedPayment);
  };

  return (
    <div className="p-4 animate-slide-up pb-32">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-foreground font-bold text-lg">←</button>
        <h2 className="text-2xl font-extrabold text-foreground">Checkout</h2>
      </div>

      {/* Delivery Address */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Delivery Address</h3>
        <button 
          onClick={onSelectAddress}
          className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 hover:shadow-card-hover transition-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          {selectedAddress ? (
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground">{selectedAddress.label}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{selectedAddress.address}</p>
            </div>
          ) : (
            <div className="flex-1 text-left">
              <p className="font-bold text-foreground">Add Delivery Address</p>
              <p className="text-sm text-muted-foreground">Select where to deliver</p>
            </div>
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Delivery Time */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Delivery Time</h3>
        <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-success" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">Express Delivery</p>
            <p className="text-sm text-success font-semibold">10-15 minutes</p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Order Summary</h3>
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  {isDataUrl(item.image) ? (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{item.image}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{item.name} × {item.qty}</span>
              </div>
              <span className="font-semibold text-foreground">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className={`font-semibold ${deliveryFee === 0 ? 'text-success' : 'text-foreground'}`}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxes & Charges</span>
              <span className="font-semibold text-foreground">₹{taxes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Payment Method</h3>
        <div className="space-y-2">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 transition-all ${
                selectedPayment === method.id 
                  ? 'ring-2 ring-primary shadow-card-hover' 
                  : 'hover:shadow-card-hover'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedPayment === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <method.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground">{method.name}</p>
                  {method.popular && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === method.id 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground'
              }`}>
                {selectedPayment === method.id && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Secure Badge */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-xs font-medium">100% Secure Payments</span>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-foreground">Total Amount</span>
            <span className="text-xl font-extrabold text-foreground">₹{grandTotal}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={!selectedAddress || !selectedPayment}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              selectedAddress && selectedPayment
                ? 'gradient-primary text-primary-foreground shadow-button hover:opacity-90 active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {!selectedAddress ? 'Select Address' : !selectedPayment ? 'Select Payment Method' : `Pay ₹${grandTotal}`}
          </button>
        </div>
      </div>
    </div>
  );
};
