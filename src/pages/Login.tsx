import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/pos');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: '1',
      name: 'Admin User',
      email: 'admin@store.com',
      pin: '1234',
      role: 'super-admin',
      permissions: [],
      isActive: true,
      createdAt: new Date()
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-sm border">
        <h1 className="text-2xl font-bold text-center mb-6">POS Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">PIN Code</label>
            <input 
              type="password" 
              className="w-full border rounded p-2 focus:ring-2 focus:ring-primary"
              placeholder="1234"
              defaultValue="1234"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:bg-primary/90">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
