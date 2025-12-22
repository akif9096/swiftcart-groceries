import { CheckCircle, Truck, Clock } from 'lucide-react';

interface OrderSuccessProps {
  onBack: () => void;
}

export const OrderSuccess = ({ onBack }: OrderSuccessProps) => (
  <div className="p-6 flex flex-col items-center text-center animate-bounce-in">
    <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mb-6 shadow-button">
      <CheckCircle className="w-12 h-12 text-primary-foreground" />
    </div>
    
    <h2 className="text-2xl font-extrabold text-foreground">Order Placed!</h2>
    <p className="text-muted-foreground mt-2 max-w-xs">
      Your order has been confirmed and is on its way
    </p>

    <div className="flex gap-6 mt-8">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xs font-semibold text-foreground">10 mins</span>
        <span className="text-xs text-muted-foreground">Delivery</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
          <Truck className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xs font-semibold text-foreground">On the way</span>
        <span className="text-xs text-muted-foreground">Status</span>
      </div>
    </div>

    <div className="w-full mt-8 p-4 bg-muted/50 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-lg">🛵</span>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-foreground">Delivery Partner Assigned</p>
          <p className="text-xs text-muted-foreground">Ravi is picking up your order</p>
        </div>
      </div>
    </div>

    <button
      onClick={onBack}
      className="mt-8 w-full gradient-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-button hover:opacity-90 active:scale-[0.98] transition-all"
    >
      Back to Home
    </button>
  </div>
);
