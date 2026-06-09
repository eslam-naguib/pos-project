import { Button } from '../ui/button';
import { useCartStore, type HeldOrder } from '../../store/cartStore';

interface HeldOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HeldOrdersModal({ isOpen, onClose }: HeldOrdersModalProps) {
  const { heldOrders, recallOrder } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 transition-all-smooth">
      <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] max-h-[80vh] flex flex-col transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold tracking-tight">Held Orders</h2>
          <Button variant="ghost" onClick={onClose} className="rounded-full w-8 h-8 p-0">×</Button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3">
          {heldOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No held orders found</div>
          ) : (
            heldOrders.map((order: HeldOrder) => (
              <div key={order.id} className="p-4 border rounded-xl flex justify-between items-center bg-background shadow-sm hover:shadow-md transition-all-smooth">
                <div>
                  <div className="font-bold">{order.customerName}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(order.timestamp).toLocaleTimeString()} • {order.items.length} items
                  </div>
                </div>
                <Button 
                  onClick={() => { recallOrder(order.id); onClose(); }}
                  size="sm"
                  className="rounded-lg font-semibold"
                >
                  Recall
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
