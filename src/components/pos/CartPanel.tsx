import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CartItem from './CartItem';
import HeldOrdersModal from './HeldOrdersModal';
import { useCheckout } from '../../hooks/useCheckout';
import { openCashDrawer } from '../../services/cashDrawerService';
import { Banknote, CreditCard, KeyRound } from 'lucide-react';

import PaymentModal from './PaymentModal';

export default function CartPanel() {
  const { 
    items, total, subtotal, taxAmount, 
    customerName, setCustomerName, holdOrder, heldOrders 
  } = useCartStore();
  
  const { handlePay } = useCheckout();
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-card border-l border-border/50 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] relative z-10">
      {/* Header Info */}
      <div className="p-4 border-b space-y-3 bg-white/50 backdrop-blur-sm">
        <Input 
          placeholder="Customer Name (Optional)" 
          value={customerName} 
          onChange={e => setCustomerName(e.target.value)}
          className="bg-white"
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl bg-white hover:bg-muted" 
            onClick={holdOrder} 
            disabled={items.length === 0}
          >
            Hold Order
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 relative rounded-xl bg-white hover:bg-muted" 
            onClick={() => setIsHeldModalOpen(true)}
          >
            Recall Order
            {heldOrders.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-in zoom-in">
                {heldOrders.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <div className="w-16 h-16 mb-4 rounded-2xl border-2 border-dashed border-current flex items-center justify-center">
              <span className="text-2xl">+</span>
            </div>
            <p>Scan or select items to start</p>
          </div>
        ) : (
          items.map(item => (
            <CartItem key={item.productId} item={item} />
          ))
        )}
      </div>

      {/* Totals & Actions */}
      <div className="p-5 border-t bg-white shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] space-y-4">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span className="font-medium text-foreground">€{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-black pt-3 border-t mt-3">
            <span>Total</span>
            <span className="text-primary tracking-tight">€{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={items.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-xl disabled:opacity-50 transition-all-smooth flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <Banknote className="w-6 h-6" /> PAY €{total.toFixed(2)}
          </button>
          <button 
            onClick={() => openCashDrawer()}
            className="w-16 bg-[#f59e0b] hover:bg-[#d97706] text-white py-4 rounded-xl font-bold transition-all-smooth flex items-center justify-center shadow-sm hover:shadow-md active:scale-[0.98]"
            title="Open Cash Drawer"
          >
            <KeyRound className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Held Orders Modal */}
      <HeldOrdersModal 
        isOpen={isHeldModalOpen} 
        onClose={() => setIsHeldModalOpen(false)} 
      />

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
        onConfirm={handlePay}
      />
    </div>
  );
}
