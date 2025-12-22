import { useState } from 'react';
import { MapPin, Plus, Home, Briefcase, MoreHorizontal, Check, Edit2, Trash2, X } from 'lucide-react';
import { Address } from './types';
import { toast } from 'sonner';

interface AddressManagerProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelect: (address: Address) => void;
  onAdd: (address: Omit<Address, 'id'>) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

const AddressIcon = ({ type }: { type: Address['type'] }) => {
  switch (type) {
    case 'home':
      return <Home className="w-5 h-5" />;
    case 'work':
      return <Briefcase className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

export const AddressManager = ({
  addresses,
  selectedAddress,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: AddressManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: 'home' as Address['type'],
    label: '',
    address: '',
  });

  const handleSubmit = () => {
    if (!formData.label.trim() || !formData.address.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    if (editingAddress) {
      onEdit({
        ...editingAddress,
        ...formData,
      });
      toast.success('Address updated');
    } else {
      onAdd({
        ...formData,
        isDefault: addresses.length === 0,
      });
      toast.success('Address added');
    }

    setShowForm(false);
    setEditingAddress(null);
    setFormData({ type: 'home', label: '', address: '' });
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      label: address.label,
      address: address.address,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success('Address deleted');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">Delivery Address</h3>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingAddress(null);
            setFormData({ type: 'home', label: '', address: '' });
          }}
          className="flex items-center gap-1 text-primary text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-3 animate-scale-in">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">
              {editingAddress ? 'Edit Address' : 'Add Address'}
            </h4>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded-full">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex gap-2">
            {(['home', 'work', 'other'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFormData((prev) => ({ ...prev, type }))}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  formData.type === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <input
            value={formData.label}
            onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="Label (e.g., My Home)"
            className="w-full px-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          <textarea
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Full address with landmarks"
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-bold text-sm"
          >
            {editingAddress ? 'Update Address' : 'Save Address'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            onClick={() => onSelect(address)}
            className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
              selectedAddress?.id === address.id
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-card shadow-card hover:shadow-card-hover'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedAddress?.id === address.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <AddressIcon type={address.type} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-foreground text-sm">{address.label}</h4>
                {address.isDefault && (
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{address.address}</p>
            </div>

            {selectedAddress?.id === address.id && (
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
            )}

            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(address);
                }}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(address.id);
                }}
                className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-8 bg-muted/50 rounded-2xl">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No saved addresses</p>
          <p className="text-xs text-muted-foreground">Add an address for delivery</p>
        </div>
      )}
    </div>
  );
};
