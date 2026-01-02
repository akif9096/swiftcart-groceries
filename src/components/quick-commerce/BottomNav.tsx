import { Home, ShoppingCart, User } from 'lucide-react';

interface BottomNavProps {
  active: string;
  setActive: (screen: string) => void;
  cartCount: number;
}

export const BottomNav = ({ active, setActive, cartCount }: BottomNavProps) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
      <div className="max-w-md mx-auto flex justify-around items-center py-3 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`relative flex flex-col items-center gap-1 py-3 px-4 rounded-2xl transition-all duration-200 ${
              active === item.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            } touch-manipulation btn-3d`}
          >
            <div className="relative">
              <item.icon className={`w-7 h-7 transition-transform ${active === item.id ? 'scale-110' : ''}`} />
              {item.id === 'cart' && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 gradient-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-button animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </div>
            <span className={`text-xs font-semibold ${active === item.id ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
            {active === item.id && (
              <span className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
