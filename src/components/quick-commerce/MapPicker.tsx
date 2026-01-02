import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Check } from 'lucide-react';
import { Address } from './types';

interface MapPickerProps {
  open: boolean;
  initial?: { lat: number; lng: number } | null;
  onClose: () => void;
  onSelect: (address: Address) => void;
}

function ClickHandler({ setPos }: { setPos: (p: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      setPos(e.latlng as any);
    },
  });
  return null;
}

export const MapPicker = ({ open, initial, onClose, onSelect }: MapPickerProps) => {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(initial || null);
  const [addressLabel, setAddressLabel] = useState('Selected Location');
  const [addressText, setAddressText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pos) return;
    setLoading(true);
    // Use Nominatim reverse geocoding
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.lat}&lon=${pos.lng}`
    )
      .then((r) => r.json())
      .then((data) => {
        setAddressText(data.display_name || `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`);
      })
      .catch(() => {
        setAddressText(`${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`);
      })
      .finally(() => setLoading(false));
  }, [pos]);

  useEffect(() => {
    if (open) {
      setPos(initial || null);
      setAddressText('');
    }
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center">
      <div className="w-full md:w-3/4 lg:w-2/3 h-3/4 bg-card rounded-t-3xl md:rounded-3xl overflow-hidden p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">Select on Map</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 rounded-full bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="h-[70%] rounded-xl overflow-hidden mb-3">
          <MapContainer center={pos || { lat: 20.5937, lng: 78.9629 }} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickHandler setPos={setPos} />
            {pos && <CircleMarker center={pos} radius={10} pathOptions={{ color: '#10B981' }} />}
          </MapContainer>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Selected</p>
            <p className="font-semibold text-foreground">{loading ? 'Fetching address...' : addressText || 'Tap on map to select a location'}</p>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                onClose();
              }}
              className="flex-1 py-3 bg-muted rounded-2xl"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!pos) return;
                const addr: Address = { id: Date.now(), label: addressLabel || 'Home', address: addressText || `${pos.lat}, ${pos.lng}` };
                onSelect(addr);
              }}
              className="flex-1 py-3 gradient-primary text-primary-foreground rounded-2xl font-bold"
            >
              <Check className="w-4 h-4 inline-block mr-2" /> Save Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
