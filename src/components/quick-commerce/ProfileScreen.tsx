import { User as UserIcon, MapPin, CreditCard, HelpCircle, LogOut, ChevronRight, Bell, Heart, Package } from 'lucide-react';
import { User } from './types';

interface ProfileScreenProps {
  user: User | null;
  onSignIn: () => void;
  onLogout: () => void;
  onAddresses: () => void;
  onNavigate?: (screen: string) => void;
}

export const ProfileScreen = ({ user, onSignIn, onLogout, onAddresses, onNavigate }: ProfileScreenProps) => {
  const menuItems = [
    { icon: Package, label: 'My Orders', badge: '3', action: () => onNavigate && onNavigate('orders') },
    { icon: Heart, label: 'Favorites', action: () => onNavigate && onNavigate('favorites') },
    { icon: MapPin, label: 'Saved Addresses', action: onAddresses },
    { icon: CreditCard, label: 'Payment Methods', action: () => {} },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
  ];

  return (
    <div className="p-4 animate-slide-up">
      <div className="gradient-header rounded-2xl p-6 text-primary-foreground mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{user ? user.name : 'Guest User'}</h2>
            <p className="text-sm opacity-80">
              {user ? user.email : 'Sign in for a personalized experience'}
            </p>
            {user && <p className="text-xs opacity-70 mt-0.5">{user.phone}</p>}
          </div>
        </div>
        
        {!user && (
          <button 
            onClick={onSignIn}
            className="mt-4 w-full bg-primary-foreground/20 hover:bg-primary-foreground/30 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            Sign In / Sign Up
          </button>
        )}
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
              index !== menuItems.length - 1 ? 'border-b border-border/50' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="flex-1 text-left font-semibold text-foreground">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                {item.badge}
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {user && (
        <button 
          onClick={onLogout}
          className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-destructive/10 text-destructive rounded-2xl font-bold hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      )}

      <p className="text-center text-xs text-muted-foreground mt-6">
        QuickCart v1.0.0
      </p>
    </div>
  );
};
