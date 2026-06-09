import { useCartStore } from '../../store/cartStore';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { SaleItem } from '../../db/models';

interface CartItemProps {
  item: SaleItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex flex-col p-4 border border-border/50 rounded-xl bg-white shadow-sm hover:shadow-md transition-all-smooth group">
      <div className="flex justify-between font-semibold text-secondary-foreground mb-2">
        <span className="truncate pr-2 text-base">{item.name}</span>
        <span className="text-primary">€{item.total.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <button 
            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
            className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-secondary-foreground hover:bg-muted transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-10 text-center font-bold text-secondary-foreground">{item.quantity}</span>
          
          <button 
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-secondary-foreground hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <span className="font-medium bg-muted/50 px-2 py-1 rounded-md">
          €{item.unitPrice.toFixed(2)} <span className="text-xs opacity-70">/ unit</span>
        </span>
        
        <button 
          onClick={() => removeItem(item.productId)}
          className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Remove Item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
