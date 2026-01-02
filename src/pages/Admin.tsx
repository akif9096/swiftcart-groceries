import { PRODUCTS } from '@/components/quick-commerce/data';
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
  Eye,
  EyeOff,
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
  // Authentication state (driven by session stored in localStorage)
  const [adminLoggedIn, setAdminLoggedIn] = useState(() =>
    localStorage.getItem('quickcart-admin-session') === '1'
  );
  const [authId, setAuthId] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedCount, setFailedCount] = useState(() => {
    try {
      const raw = localStorage.getItem('quickcart-admin-failed');
      return raw ? JSON.parse(raw).count || 0 : 0;
    } catch { return 0; }
  });
  const [lockUntil, setLockUntil] = useState<number | null>(() => {
    try {
      const raw = localStorage.getItem('quickcart-admin-failed');
      return raw ? JSON.parse(raw).until || null : null;
    } catch { return null; }
  });
  // removed client-side create flow; admin credentials are managed on the server
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [searchQuery, setSearchQuery] = useState('');

  // Load products from localStorage
  useEffect(() => {
    // nothing auth-specific here; session is read from localStorage at init

    const savedProducts = localStorage.getItem('quickcart-admin-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with default products
      
      const productsWithDescription = PRODUCTS.map((p: Product) => ({
        ...p,
        description: `Fresh and high quality ${p.name.toLowerCase()}`
      }));
      setProducts(productsWithDescription);
      localStorage.setItem('quickcart-admin-products', JSON.stringify(productsWithDescription));
    }
  }, []);

  // NOTE: authentication is handled by the backend now.

  const handleLogin = async () => {
    // check lock
    if (lockUntil && Date.now() < lockUntil) {
      toast.error('Too many failed attempts. Try again later.');
      return;
    }
    try{
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: authId, password: authPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        // increment failed attempts (same as before)
        const next = failedCount + 1;
        let until = null;
        if (next >= 5) {
          until = Date.now() + 5 * 60 * 1000;
          toast.error('Too many failed attempts — locked for 5 minutes');
        } else {
          toast.error(data?.error || 'Invalid admin ID or password');
        }
        setFailedCount(next);
        setLockUntil(until);
        localStorage.setItem('quickcart-admin-failed', JSON.stringify({ count: next, until }));
        return;
      }
      // success — backend returns a token
      const token = data.token;
      if (token) localStorage.setItem('quickcart-admin-token', token);
      localStorage.setItem('quickcart-admin-session', '1');
      setAdminLoggedIn(true);
      setAuthPassword('');
      localStorage.removeItem('quickcart-admin-failed');
      setFailedCount(0);
      setLockUntil(null);
      toast.success('Logged in as admin');
    }catch(e){
      toast.error('Login failed — server error');
    }
  };

  // Clear local admin session/flags
  const handleResetCreds = () => {
    localStorage.removeItem('quickcart-admin-token');
    localStorage.removeItem('quickcart-admin-session');
    localStorage.removeItem('quickcart-admin-failed');
    localStorage.removeItem('quickcart-admin-creds');
    setAdminLoggedIn(false);
    toast.success('Admin session cleared');
  };

  // Removing client-side credential creation: use server endpoint `/api/admin/create`
  // (not exposed in the UI). The server requires an admin-create secret.

  const handleLogout = () => {
    setAdminLoggedIn(false);
    localStorage.removeItem('quickcart-admin-session');
    toast('Logged out');
  };

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

  const isDataUrl = (s: string) => s.startsWith('data:');

  const handleImageFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData({ ...formData, image: result });
    };
    reader.readAsDataURL(file);
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
            {adminLoggedIn && (
              <button onClick={handleLogout} className="ml-auto px-3 py-2 bg-muted rounded-xl text-sm">
                Logout
              </button>
            )}
          </div>
          <p className="text-sm opacity-80">Manage your products, categories, and orders</p>
        </div>
      </div>

      {/* Auth (show login/setup if not logged in) */}
      {!adminLoggedIn && (
        <div className="max-w-md mx-auto p-4">
          <div className="bg-card rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-bold mb-3">Admin Login</h3>
            <p className="text-sm text-muted-foreground mb-4">Sign in with your admin ID and password.</p>
            <div className="grid gap-3">
              <input value={authId} onChange={(e) => setAuthId(e.target.value)} placeholder="Admin ID" className="px-4 py-3 rounded-xl bg-muted border border-border" />
              <div className="relative">
                <input
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border pr-10"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-xs text-muted-foreground">Password must be 8+ chars and include a number.</div>
              {lockUntil && Date.now() < lockUntil && (
                <div className="text-sm text-destructive">Too many failed attempts. Try again later.</div>
              )}
              <div className="flex gap-2">
                <button onClick={handleLogin} className="flex-1 btn-cta">Login</button>
                <button onClick={() => { setAuthId(''); setAuthPassword(''); }} className="px-4 py-3 bg-muted rounded-xl">Clear</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Content (visible when logged in) */}
      {adminLoggedIn ? (
        <>
          <div className="max-w-4xl mx-auto px-4 -mt-4">
            <div className="bg-card rounded-2xl shadow-card p-1 flex gap-1">
              {[
                { id: 'products', label: 'Products', icon: Package },
                { id: 'categories', label: 'Categories', icon: LayoutGrid },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
                      activeTab === tab.id ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

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
                    className="btn-cta shadow-button hover:opacity-95 flex items-center gap-2"
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
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                            {isDataUrl(formData.image) ? (
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              <img src={formData.image} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-4xl">{formData.image}</div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <label className="px-3 py-2 bg-primary/10 text-primary rounded-xl cursor-pointer hover:bg-primary/20">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    handleImageFile(file);
                                  }}
                                />
                                Upload Image
                              </label>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: '📦' })}
                                className="px-3 py-2 bg-muted rounded-xl hover:bg-muted/80"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground">Or pick an emoji below</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {emojiOptions.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setFormData({ ...formData, image: emoji })}
                              className={`text-3xl p-2 rounded-xl transition ${
                                formData.image === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted hover:bg-muted/80'
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
                        className="flex-1 btn-cta flex items-center justify-center gap-2"
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
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden bg-muted border border-border">
                          {isDataUrl(product.image) ? (
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-4xl">{product.image}</div>
                          )}
                        </div>
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
        </>
      ) : null}
    </div>
  );
};

export default Admin;
