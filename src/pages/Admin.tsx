import { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  Package, 
  LayoutGrid, 
  ShoppingBag,
  Star,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { Product, Category } from '@/components/quick-commerce/types';
import { CATEGORIES } from '@/components/quick-commerce/data';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ProductFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  image: string;
  rating: number;
  eta: string;
  unit: string;
}

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  categoryId: 1,
  image: '📦',
  rating: 4.0,
  eta: '10 min',
  unit: ''
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');

  // Load products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('quickcart-admin-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with default products
      const { PRODUCTS } = require('@/components/quick-commerce/data');
      const productsWithDescription = PRODUCTS.map((p: Product) => ({
        ...p,
        description: `Fresh and high quality ${p.name.toLowerCase()}`
      }));
      setProducts(productsWithDescription);
      localStorage.setItem('quickcart-admin-products', JSON.stringify(productsWithDescription));
    }
  }, []);

  // Save products to localStorage
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('quickcart-admin-products', JSON.stringify(updatedProducts));
  };

  const handleAddNew = () => {
    setFormData(emptyForm);
    setIsEditing(true);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      ...product,
      unit: product.unit || '',
      description: (product as any).description || `Fresh ${product.name}`
    });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
    toast.success('Product deleted successfully');
  };

  const handleSave = () => {
    if (!formData.name || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.id) {
      // Update existing
      const updated = products.map(p => 
        p.id === formData.id ? { ...formData, id: p.id } as Product : p
      );
      saveProducts(updated);
      toast.success('Product updated successfully');
    } else {
      // Add new
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct = { ...formData, id: newId } as Product;
      saveProducts([...products, newProduct]);
      toast.success('Product added successfully');
    }
    setIsEditing(false);
    setFormData(emptyForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(emptyForm);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  // Common emoji options for products
  const emojiOptions = ['🍅', '🥛', '🍟', '🥤', '🥬', '🫙', '🥜', '🧃', '🍎', '🍌', '🥐', '🍞', '🧀', '🥚', '🍗', '🥩', '🐟', '🍕', '🍔', '🌮', '📦'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary text-primary-foreground p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
          </div>
          <p className="text-sm opacity-80">Manage your products, categories, and orders</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        <div className="bg-card rounded-2xl shadow-card p-1 flex gap-1">
          {[
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: LayoutGrid },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                activeTab === tab.id 
                  ? 'gradient-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search and Add */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddNew}
                className="gradient-primary text-primary-foreground px-4 py-3 rounded-xl font-bold flex items-center gap-2 shadow-button hover:opacity-90"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="bg-card rounded-2xl shadow-card p-6 border border-border animate-scale-in">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  {formData.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      <ImageIcon className="w-4 h-4 inline mr-1" />
                      Product Image
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {emojiOptions.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: emoji })}
                          className={`text-3xl p-2 rounded-xl transition ${
                            formData.image === emoji 
                              ? 'bg-primary/20 ring-2 ring-primary' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Fresh Tomatoes"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      <Star className="w-4 h-4 inline mr-1" />
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Math.min(5, Math.max(1, Number(e.target.value))) })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 500g, 1L, 6 pcs"
                    />
                  </div>

                  {/* ETA */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Delivery ETA
                    </label>
                    <input
                      type="text"
                      value={formData.eta}
                      onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 10 min"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={3}
                      placeholder="Product description..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 gradient-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Product
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-muted text-muted-foreground rounded-xl font-medium flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="bg-card rounded-2xl p-8 text-center">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4">
                    <div className="text-4xl">{product.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-success font-semibold">₹{product.price}</span>
                        <span>•</span>
                        <span>{getCategoryName(product.categoryId)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {product.rating}
                        </span>
                      </div>
                      {product.unit && (
                        <span className="text-xs text-muted-foreground">{product.unit}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Categories are predefined. Product counts are shown below.
            </p>
            {categories.map(cat => {
              const productCount = products.filter(p => p.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{cat.name}</h4>
                    <p className="text-sm text-muted-foreground">{productCount} product{productCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-foreground mb-2">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground">
              Orders will appear here once customers start placing them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
