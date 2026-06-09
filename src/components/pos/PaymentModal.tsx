import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Banknote, CreditCard, Split } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (method: 'cash' | 'card' | 'mixed', cashGiven?: number, changeAmount?: number) => void;
}

export default function PaymentModal({ isOpen, onClose, total, onConfirm }: PaymentModalProps) {
  const [method, setMethod] = useState<'cash' | 'card' | 'mixed'>('cash');
  const [cashGivenStr, setCashGivenStr] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMethod('cash');
      setCashGivenStr(total.toString());
    }
  }, [isOpen, total]);

  if (!isOpen) return null;

  const cashGiven = parseFloat(cashGivenStr) || 0;
  
  // Calculations
  const changeAmount = method === 'cash' ? Math.max(0, cashGiven - total) : 0;
  const remainingCardAmount = method === 'mixed' ? Math.max(0, total - cashGiven) : 0;
  const isCashSufficient = method === 'cash' ? cashGiven >= total : true;
  const isMixedValid = method === 'mixed' ? cashGiven > 0 && cashGiven < total : true;
  
  const canConfirm = (method === 'card') || 
                     (method === 'cash' && isCashSufficient) || 
                     (method === 'mixed' && isMixedValid);

  const quickDenominations = [5, 10, 20, 50, 100, 200];

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(method, method !== 'card' ? cashGiven : undefined, method === 'cash' ? changeAmount : undefined);
    onClose();
  };

  const handleNumpadClick = (val: string) => {
    if (val === 'C') {
      setCashGivenStr('');
      return;
    }
    if (val === '⌫') {
      setCashGivenStr(prev => prev.slice(0, -1));
      return;
    }
    if (val === '.' && cashGivenStr.includes('.')) {
      return;
    }
    if (cashGivenStr === '0' && val !== '.') {
      setCashGivenStr(val);
      return;
    }
    setCashGivenStr(prev => prev + val);
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 transition-all-smooth p-4">
      <div className="bg-card p-6 rounded-3xl w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transform animate-in zoom-in-95 duration-200 border border-border/50">
        <h2 className="text-2xl font-black mb-6 tracking-tight text-center text-secondary-foreground">Checkout Payment</h2>
        
        {/* Total Display */}
        <div className="bg-primary/5 rounded-2xl p-6 text-center mb-6 border border-primary/10">
          <div className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-1">Total Due</div>
          <div className="text-5xl font-black text-primary">€{total.toFixed(2)}</div>
        </div>

        {/* Method Selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button 
            variant={method === 'cash' ? 'default' : 'outline'}
            className={`h-14 rounded-xl font-bold flex flex-col gap-1 ${method === 'cash' ? 'bg-[#22c55e] hover:bg-[#16a34a]' : ''}`}
            onClick={() => { setMethod('cash'); setCashGivenStr(total.toString()); }}
          >
            <Banknote className="w-5 h-5" /> Cash
          </Button>
          <Button 
            variant={method === 'card' ? 'default' : 'outline'}
            className={`h-14 rounded-xl font-bold flex flex-col gap-1 ${method === 'card' ? 'bg-[#3b82f6] hover:bg-[#2563eb]' : ''}`}
            onClick={() => setMethod('card')}
          >
            <CreditCard className="w-5 h-5" /> Card
          </Button>
          <Button 
            variant={method === 'mixed' ? 'default' : 'outline'}
            className={`h-14 rounded-xl font-bold flex flex-col gap-1 ${method === 'mixed' ? 'bg-[#8b5cf6] hover:bg-[#7c3aed]' : ''}`}
            onClick={() => { setMethod('mixed'); setCashGivenStr(''); }}
          >
            <Split className="w-5 h-5" /> Mixed
          </Button>
        </div>

        {/* Cash / Mixed Inputs */}
        {method !== 'card' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-muted-foreground ml-1">
                {method === 'cash' ? 'Cash Received from Customer' : 'Cash Portion Received'}
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">€</span>
                <Input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={cashGivenStr}
                  onChange={(e) => setCashGivenStr(e.target.value)}
                  className="pl-10 h-16 text-3xl font-black rounded-2xl"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-xl font-bold"
                onClick={() => setCashGivenStr(total.toString())}
              >
                Exact
              </Button>
              {quickDenominations.filter(d => d >= (method === 'cash' ? total : 0)).slice(0, 4).map(d => (
                <Button 
                  key={d}
                  variant="outline"
                  className="flex-1 rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/10"
                  onClick={() => setCashGivenStr(d.toString())}
                >
                  €{d}
                </Button>
              ))}
            </div>

            {/* Numeric Keypad for Touch Screens */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {['7', '8', '9', '⌫', '4', '5', '6', 'C', '1', '2', '3', '.', '0', '00', '000'].map((btn, idx) => (
                <Button
                  key={idx}
                  variant={btn === 'C' || btn === '⌫' ? 'destructive' : 'outline'}
                  className={`h-14 rounded-xl font-bold text-xl shadow-sm active:scale-95 transition-transform ${btn === '0' ? 'col-span-2' : ''} ${btn === 'C' || btn === '⌫' ? 'bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20' : 'bg-white hover:bg-muted'}`}
                  onClick={() => btn ? handleNumpadClick(btn) : undefined}
                >
                  {btn}
                </Button>
              ))}
            </div>

            {/* Change / Remaining Details */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
              {method === 'cash' ? (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">Change Due:</span>
                  <span className={`text-2xl font-black ${changeAmount > 0 ? 'text-[#f59e0b]' : 'text-muted-foreground'}`}>
                    €{changeAmount.toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground">Remaining on Card:</span>
                  <span className={`text-2xl font-black text-[#3b82f6]`}>
                    €{remainingCardAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            
            {method === 'cash' && !isCashSufficient && cashGiven > 0 && (
              <p className="text-destructive text-sm font-semibold text-center">Cash received is less than total.</p>
            )}
            {method === 'mixed' && !isMixedValid && cashGiven > 0 && (
              <p className="text-destructive text-sm font-semibold text-center">Cash portion must be less than total.</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="h-14 flex-1 rounded-xl font-bold text-lg">Cancel</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!canConfirm}
            className="h-14 flex-[2] rounded-xl font-bold text-lg"
          >
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
