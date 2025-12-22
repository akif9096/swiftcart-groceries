import { useState, useEffect } from 'react';
import { 
  Package, 
  ChefHat, 
  Bike, 
  Home, 
  Check, 
  Phone, 
  MessageCircle,
  MapPin,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Order } from './types';

interface OrderTrackingProps {
  order: Order;
  onBack: () => void;
}

const steps = [
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'picked', label: 'Picked Up', icon: Package },
  { key: 'on_the_way', label: 'On the Way', icon: Bike },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

export const OrderTracking = ({ order, onBack }: OrderTrackingProps) => {
  const [currentTime, setCurrentTime] = useState(order.estimatedTime);

  useEffect(() => {
    if (order.status === 'delivered') return;

    const timer = setInterval(() => {
      setCurrentTime((prev) => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [order.status]);

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="gradient-header text-primary-foreground p-5 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 bg-primary-foreground/20 rounded-full hover:bg-primary-foreground/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold">Order #{order.id.slice(-6)}</h1>
            <p className="text-sm opacity-80">Placed at {new Date(order.placedAt).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-primary-foreground/15 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">Estimated Arrival</p>
              <p className="text-2xl font-extrabold">{currentTime} mins</p>
            </div>
          </div>
          {order.status !== 'delivered' && (
            <div className="w-16 h-16 rounded-full border-4 border-primary-foreground/30 flex items-center justify-center">
              <div className="animate-spin w-12 h-12 rounded-full border-4 border-transparent border-t-primary-foreground" />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Progress Steps */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="relative">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground shadow-button'
                          : 'bg-muted text-muted-foreground'
                      } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                    >
                      {isCompleted && index < currentStepIndex ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 my-1 transition-colors ${
                          index < currentStepIndex ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-2">
                    <p
                      className={`font-semibold text-sm ${
                        isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary font-medium mt-0.5">In progress...</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner */}
        {order.status !== 'preparing' && order.status !== 'delivered' && (
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <p className="text-xs text-muted-foreground mb-3 font-semibold">DELIVERY PARTNER</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                {order.deliveryPartner.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground">{order.deliveryPartner.name}</h4>
                <p className="text-xs text-muted-foreground">{order.deliveryPartner.phone}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">DELIVERING TO</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm">{order.address.label}</h4>
              <p className="text-xs text-muted-foreground">{order.address.address}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-3 font-semibold">ORDER SUMMARY</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-sm text-foreground">
                  {item.image} {item.name} × {item.qty}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2 mt-2 space-y-1">
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success">Discount</span>
                  <span className="text-success font-semibold">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-semibold text-foreground">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-1">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
