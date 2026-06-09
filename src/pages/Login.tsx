import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { Store, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
      
      <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] w-full max-w-md border border-border/50 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-4 rounded-2xl text-primary mb-4">
            <Store className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-secondary-foreground tracking-tight">SmartPOS</h1>
          <p className="text-muted-foreground mt-1 text-sm">Enter your PIN to access the terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-secondary-foreground ml-1">Secure PIN Code</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                type="password" 
                className="pl-12 h-14 text-2xl tracking-[0.5em] text-center font-bold rounded-2xl"
                placeholder="****"
                defaultValue="1234"
                maxLength={4}
                autoFocus
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-md hover:shadow-lg transition-all-smooth active:scale-[0.98]">
            Unlock Terminal
          </Button>
        </form>
      </div>
    </div>
  );
}
