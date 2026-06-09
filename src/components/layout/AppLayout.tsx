import { Outlet, Link, Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import GlobalPopup from '../ui/GlobalPopup';
import { LayoutDashboard, ShoppingCart, Package, Tags, ClipboardList, Settings as SettingsIcon, Users, BarChart3 } from 'lucide-react';

export default function AppLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    // Enforce light mode
    document.documentElement.classList.remove('dark');
  }, [i18n.language]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isCashier = user?.role === 'cashier';

  const NavLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 p-3 rounded-xl transition-all-smooth font-medium ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
            : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
        }`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <GlobalPopup />
      
      {/* Sidebar - Glassmorphism feel */}
      <aside className="w-72 bg-card border-r shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 relative">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
            P
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            SmartPOS
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4 px-2">Main</div>
          <NavLink to="/pos" icon={ShoppingCart} label="Point of Sale" />
          <NavLink to="/sales" icon={ClipboardList} label="Sales History" />
          <NavLink to="/products" icon={Package} label="Products" />
          <NavLink to="/categories" icon={Tags} label="Categories" />
          <NavLink to="/inventory" icon={LayoutDashboard} label="Inventory" />
          
          {!isCashier && (
            <>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6 px-2">Management</div>
              <NavLink to="/purchases" icon={ShoppingCart} label="Purchases" />
              <NavLink to="/reports" icon={BarChart3} label="Reports" />
              <NavLink to="/settings" icon={SettingsIcon} label="Settings" />
              <NavLink to="/admin" icon={Users} label="Admin & Roles" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="bg-accent/50 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-bold text-sm">{user?.name || 'Guest'}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <header className="h-20 bg-card/80 backdrop-blur-md border-b flex items-center justify-between px-8 z-10">
          <div className="font-semibold text-xl tracking-tight text-secondary-foreground">Dashboard</div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-muted-foreground border">
              {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
