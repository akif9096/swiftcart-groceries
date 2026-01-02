import { Search, MapPin, Zap } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLocationClick?: () => void;
}

export const Header = ({ searchQuery, setSearchQuery, onLocationClick }: HeaderProps) => (
  <header className="gradient-header text-primary-foreground p-4 pb-5 rounded-b-3xl shadow-lg three-d-header">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Zap className="w-5.5 h-5.5" />
        </div>
        <div>
          <p className="text-xs opacity-90 font-medium">Delivery in</p>
          <h1 className="text-lg font-extrabold tracking-tight">10 mins</h1>
        </div>
      </div>
      <button onClick={onLocationClick} className="flex items-center gap-1 bg-primary-foreground/15 px-3 py-1 rounded-full">
        <MapPin className="w-4 h-4" />
        <span className="text-xs font-semibold">Home</span>
      </button>
    </div>

    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search groceries, snacks, drinks"
        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card text-foreground placeholder:text-muted-foreground text-base font-medium shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
      />
    </div>
  </header>
);
