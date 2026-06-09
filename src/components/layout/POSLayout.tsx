import { Outlet, Link, Navigate } from 'react-router';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import GlobalPopup from '../ui/GlobalPopup';
import { ArrowLeft, Wifi } from 'lucide-react';

export default function POSLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    document.documentElement.classList.remove('dark');
  }, [i18n.language]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <GlobalPopup />
      
      {/* Top Header for POS */}
      <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-6">
          <Link 
            to="/sales" 
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all-smooth rounded-xl font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                P
             </div>
             <span className="font-extrabold text-xl tracking-tight text-secondary-foreground">POS Terminal</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-accent/50 px-4 py-1.5 rounded-full flex items-center gap-2 border">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
            <span className="text-sm font-semibold text-secondary-foreground">Online</span>
            <Wifi className="w-4 h-4 text-green-600 ml-1" />
          </div>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
               {user?.name?.charAt(0) || 'C'}
             </div>
             <span className="text-sm font-semibold">{user?.name || 'Cashier'}</span>
          </div>
        </div>
      </header>

      {/* Main POS Workspace */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        <Outlet />
      </main>
    </div>
  );
}
