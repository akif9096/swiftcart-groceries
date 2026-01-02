import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const hashPassword = async (pwd: string) => {
  if (!pwd) return '';
  const enc = new TextEncoder();
  const data = enc.encode(pwd);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const AdminLogin = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [hasCredentials, setHasCredentials] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const creds = localStorage.getItem('quickcart-admin-creds');
    setHasCredentials(!!creds);
  }, []);

  const saveCredentials = async (idVal: string, pwd: string) => {
    const hash = await hashPassword(pwd);
    localStorage.setItem('quickcart-admin-creds', JSON.stringify({ id: idVal, hash }));
    setHasCredentials(true);
  };

  const verifyCredentials = async (idVal: string, pwd: string) => {
    const raw = localStorage.getItem('quickcart-admin-creds');
    if (!raw) return false;
    try {
      const { id: storedId, hash: storedHash } = JSON.parse(raw);
      const hash = await hashPassword(pwd);
      return idVal === storedId && hash === storedHash;
    } catch (e) {
      return false;
    }
  };

  const handleCreate = async () => {
    if (!id || !password) {
      toast.error('Provide ID and password');
      return;
    }
    await saveCredentials(id, password);
    setPassword('');
    toast.success('Admin created — please login');
  };

  const handleLogin = async () => {
    if (!id || !password) {
      toast.error('Provide ID and password');
      return;
    }
    const ok = await verifyCredentials(id, password);
    if (ok) {
      localStorage.setItem('quickcart-admin-session', '1');
      toast.success('Logged in');
      navigate('/admin');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-xl font-bold">Admin Login</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{hasCredentials ? 'Sign in with your admin ID and password.' : 'No admin credentials found — create one below.'}</p>
          <div className="grid gap-3">
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Admin ID" className="px-4 py-3 rounded-xl bg-muted border border-border" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="px-4 py-3 rounded-xl bg-muted border border-border" />
            <div className="flex gap-2">
              {hasCredentials ? (
                <button onClick={handleLogin} className="flex-1 gradient-primary text-primary-foreground px-4 py-3 rounded-xl font-bold">Login</button>
              ) : (
                <button onClick={handleCreate} className="flex-1 gradient-primary text-primary-foreground px-4 py-3 rounded-xl font-bold">Create Admin</button>
              )}
              <button onClick={() => { setId(''); setPassword(''); }} className="px-4 py-3 bg-muted rounded-xl">Clear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
