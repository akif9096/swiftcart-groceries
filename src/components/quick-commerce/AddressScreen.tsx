import { MapPin, Plus, Home, Briefcase, Heart, ChevronRight, Navigation } from 'lucide-react';
import MapPicker from './MapPicker';
import { Address } from './types';
import { useState } from 'react';

interface AddressScreenProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddAddress: (address: Address) => void;
  onBack: () => void;
}

export const AddressScreen = ({ 
  addresses, 
  selectedAddress,
  onSelectAddress, 
  onAddAddress,
  onBack 
}: AddressScreenProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    address: '',
    landmark: '',
  });

  const labelIcons: Record<string, React.ElementType> = {
    Home: Home,
    Work: Briefcase,
    Other: Heart,
  };

  const handleSaveAddress = () => {
    if (!newAddress.address.trim()) return;
    
    const address: Address = {
      id: Date.now(),
      label: newAddress.label,
      address: newAddress.address,
      landmark: newAddress.landmark,
    };
    onAddAddress(address);
    setShowAddForm(false);
    setNewAddress({ label: 'Home', address: '', landmark: '' });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setNewAddress(prev => ({
            ...prev,
            address: 'Current Location - Fetching address...',
          }));
          // Simulating address fetch
          setTimeout(() => {
            setNewAddress(prev => ({
              ...prev,
              address: '123 Main Street, Near Central Park, City Center',
            }));
          }, 1000);
        },
        () => {
          // Handle error silently
        }
      );
    }
  };

  // Map picker modal state
  const [showMapPicker, setShowMapPicker] = useState(false);

  const handleSelectOnMap = () => {
    setShowMapPicker(true);
  };

  const handleMapSelect = (addr: Address) => {
    onAddAddress(addr);
    setShowMapPicker(false);
  };

  return (
    <div className="p-4 animate-slide-up pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-foreground font-bold text-lg">←</button>
        <h2 className="text-2xl font-extrabold text-foreground">Delivery Address</h2>
      </div>

      {/* Current Location Button */}
      <button 
        onClick={handleUseCurrentLocation}
        className="w-full bg-primary/10 rounded-2xl p-4 flex items-center gap-3 mb-4 hover:bg-primary/20 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Navigation className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-primary">Use Current Location</p>
          <p className="text-sm text-primary/70">Get your location automatically</p>
        </div>
        <ChevronRight className="w-5 h-5 text-primary" />
      </button>

      {/* Select on Map */}
      <button
        onClick={handleSelectOnMap}
        className="w-full bg-card rounded-2xl p-4 flex items-center gap-3 mb-4 hover:shadow-card-hover transition-shadow"
      >
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <MapPin className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-foreground">Select on Map</p>
          <p className="text-sm text-muted-foreground">Tap the map to choose delivery location</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>

      <MapPicker open={showMapPicker} onClose={() => setShowMapPicker(false)} onSelect={handleMapSelect} />

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Saved Addresses</h3>
          <div className="space-y-2">
            {addresses.map(addr => {
              const IconComponent = labelIcons[addr.label] || MapPin;
              return (
                <button
                  key={addr.id}
                  onClick={() => onSelectAddress(addr)}
                  className={`w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 transition-all ${
                    selectedAddress?.id === addr.id 
                      ? 'ring-2 ring-primary shadow-card-hover' 
                      : 'hover:shadow-card-hover'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedAddress?.id === addr.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-foreground">{addr.label}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{addr.address}</p>
                    {addr.landmark && (
                      <p className="text-xs text-muted-foreground">Near {addr.landmark}</p>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAddress?.id === addr.id 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground'
                  }`}>
                    {selectedAddress?.id === addr.id && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Address */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-card rounded-2xl p-4 shadow-card flex items-center gap-3 hover:shadow-card-hover transition-shadow border-2 border-dashed border-border"
        >
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-foreground">Add New Address</p>
            <p className="text-sm text-muted-foreground">Save a new delivery location</p>
          </div>
        </button>
      ) : (
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
          <h3 className="font-bold text-foreground">Add New Address</h3>
          
          {/* Label Selection */}
          <div className="flex gap-2">
            {['Home', 'Work', 'Other'].map(label => (
              <button
                key={label}
                onClick={() => setNewAddress(prev => ({ ...prev, label }))}
                className={`flex-1 py-2 px-3 rounded-xl font-semibold text-sm transition-all ${
                  newAddress.label === label
                    ? 'gradient-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Address Input */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground">Full Address *</label>
            <textarea
              value={newAddress.address}
              onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
              placeholder="House/Flat No., Building, Street, Area..."
              rows={3}
              className="w-full mt-1 p-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Landmark Input */}
          <div>
            <label className="text-sm font-semibold text-muted-foreground">Landmark (Optional)</label>
            <input
              type="text"
              value={newAddress.landmark}
              onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
              placeholder="Near school, mall, etc."
              className="w-full mt-1 p-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-3 bg-muted text-muted-foreground rounded-xl font-bold text-sm hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAddress}
              disabled={!newAddress.address.trim()}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                newAddress.address.trim()
                  ? 'gradient-primary text-primary-foreground shadow-button'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Save Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
