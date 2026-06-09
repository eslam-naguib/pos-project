import { usePopupStore } from '../../store/popupStore';
import { Button } from './button';
import { CheckCircle2, AlertCircle, Info, HelpCircle } from 'lucide-react';

export default function GlobalPopup() {
  const { isOpen, type, title, message, onConfirm, onCancel, closePopup } = usePopupStore();

  if (!isOpen) return null;

  const Icon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />;
      case 'error': return <AlertCircle className="w-12 h-12 text-destructive mb-4" />;
      case 'confirm': return <HelpCircle className="w-12 h-12 text-primary mb-4" />;
      default: return <Info className="w-12 h-12 text-blue-500 mb-4" />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closePopup();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    closePopup();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all-smooth">
      <div className="bg-card text-card-foreground w-full max-w-sm rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 m-4 flex flex-col items-center text-center transform scale-100 animate-in zoom-in-95 duration-200">
        <Icon />
        <h2 className="text-2xl font-bold mb-2 tracking-tight">{title}</h2>
        <p className="text-muted-foreground mb-8 text-base">{message}</p>
        
        <div className="flex w-full gap-3">
          {type === 'confirm' && (
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-12 font-semibold"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button 
            variant={type === 'error' ? 'destructive' : 'default'}
            className="flex-1 rounded-xl h-12 font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={handleConfirm}
          >
            {type === 'confirm' ? 'Confirm' : 'Okay'}
          </Button>
        </div>
      </div>
    </div>
  );
}
