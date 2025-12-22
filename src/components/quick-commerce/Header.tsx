import { Search, MapPin, Zap, ChevronDown } from 'lucide-react';
import { Address } from './types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAddress: Address | null;
  onAddressClick: () => void;
}

export const Header = ({ searchQuery, setSearchQuery, selectedAddress, onAddressClick }: HeaderProps) => (
  <header className="gradient-header text-primary-foreground p-5 pb-6 rounded-b-3xl shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs opacity-80 font-medium">Delivery in</p>
          <h1 className="text-xl font-extrabold tracking-tight">10 minutes</h1>
        </div>
      </div>
      <button 
        onClick={onAddressClick}
        className="flex items-center gap-1.5 bg-primary-foreground/15 px-3 py-1.5 rounded-full hover:bg-primary-foreground/25 transition-colors"
      >
        <MapPin className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold max-w-[80px] truncate">
          {selectedAddress?.label || 'Add Address'}
        </span>
        <ChevronDown className="w-3 h-3" />
      </button>
    </div>

    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for groceries, snacks, drinks..."
        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card text-foreground placeholder:text-muted-foreground text-sm font-medium shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
      />
    </div>
  </header>
);
