import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { openCashDrawer } from '../../services/cashDrawerService';
import { printReceipt } from '../../services/printerService';
import { db } from '../../db/database';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../store/settingsStore';
import { usePopupStore } from '../../store/popupStore';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function CartPanel() {
  const { 
    items, total, subtotal, taxAmount, updateQuantity, removeItem, clearCart, 
    customerName, setCustomerName, holdOrder, heldOrders, recallOrder 
  } = useCartStore();

  const { settings } = useSettingsStore();
  const { i18n } = useTranslation();
  const { showPopup } = usePopupStore();

  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);

  const handlePay = async (method: 'cash' | 'card' | 'mixed') => {
    if (items.length === 0) return;
    
    if (method === 'cash') {
      await openCashDrawer();
    }

    const saleId = uuidv4();
    const invoiceNumber = `INV-${Date.now()}`;
    await db.sales.add({
      id: saleId,
      invoiceNumber,
      items,
      subtotal,
      taxAmount,
      discount: 0,
      total,
      paymentMethod: method,
      cashierId: '1',
      invoiceLanguage: i18n.language,
      status: 'completed',
      createdAt: new Date(),
      syncStatus: 'pending'
    });
    
    // Get proper localized footer or fallback
    const lang = i18n.language as 'en' | 'ar' | 'nl';
    const footerText = settings.receiptFooter?.[lang] || settings.receiptFooter?.nl || 'Bedankt!';

    const receiptLines = [
      'STORE NAME',
      'Address line 1',
      '--------------------------------',
      `Date: ${new Date().toLocaleString()}`,
      `Invoice: ${invoiceNumber}`,
      `Cashier: Admin`,
      customerName ? `Customer: ${customerName}` : '',
      '--------------------------------',
      ...items.map(i => `${i.name.padEnd(20)} €${i.total.toFixed(2).padStart(11)}`),
      '--------------------------------',
      `Subtotal:           €${subtotal.toFixed(2).padStart(11)}`,
      `Tax:                €${taxAmount.toFixed(2).padStart(11)}`,
      `TOTAL:              €${total.toFixed(2).padStart(11)}`,
      '--------------------------------',
      footerText,
      `[BARCODE]${invoiceNumber}`
    ].filter(Boolean); // remove empty lines

    await printReceipt(receiptLines);
    localStorage.setItem('cart-status', JSON.stringify({ status: 'paid', timestamp: Date.now() }));
    
    showPopup({
      type: 'success',
      title: 'Payment Complete',
      message: `Transaction for €${total.toFixed(2)} completed successfully via ${method}.`,
    });
    
    clearCart();
    
    // reset status after 5 seconds
    setTimeout(() => {
      localStorage.setItem('cart-status', JSON.stringify({ status: 'idle', timestamp: Date.now() }));
    }, 5000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-card border-l relative">
      {/* Header Info */}
      <div className="p-4 border-b space-y-2">
        <div className="flex gap-2">
          <Input 
            placeholder="Customer Name (Optional)" 
            value={customerName} 
            onChange={e => setCustomerName(e.target.value)} 
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={holdOrder} 
            disabled={items.length === 0}
          >
            Hold Order
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 relative" 
            onClick={() => setIsHeldModalOpen(true)}
          >
            Recall Order
            {heldOrders.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {heldOrders.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Cart is empty
          </div>
        ) : (
          items.map(item => (
            <div key={item.productId} className="flex flex-col p-3 border rounded bg-background">
              <div className="flex justify-between font-medium">
                <span className="truncate pr-2">{item.name}</span>
                <span>€{item.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center bg-muted rounded"
                  >-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-muted rounded"
                  >+</button>
                </div>
                <span>€{item.unitPrice.toFixed(2)} / unit</span>
                <button 
                  onClick={() => removeItem(item.productId)}
                  className="text-destructive hover:underline"
                >Remove</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals & Actions */}
      <div className="p-4 border-t bg-muted/20 space-y-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>€{taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
            <span>Total</span>
            <span className="text-primary">€{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handlePay('cash')}
            disabled={items.length === 0}
            className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50"
          >
            CASH 💵
          </button>
          <button 
            onClick={() => handlePay('card')}
            disabled={items.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold disabled:opacity-50"
          >
            CARD 💳
          </button>
          <button 
            onClick={() => openCashDrawer()}
            className="bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold"
          >
            OPEN DRAWER
          </button>
        </div>
      </div>

      {/* Held Orders Modal */}
      {isHeldModalOpen && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl w-full max-w-sm shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Held Orders</h2>
              <Button variant="ghost" onClick={() => setIsHeldModalOpen(false)}>Close</Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {heldOrders.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No held orders</div>
              ) : (
                heldOrders.map(order => (
                  <div key={order.id} className="p-3 border rounded flex justify-between items-center bg-background">
                    <div>
                      <div className="font-bold">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{new Date(order.timestamp).toLocaleTimeString()} • {order.items.length} items</div>
                    </div>
                    <Button onClick={() => { recallOrder(order.id); setIsHeldModalOpen(false); }}>Recall</Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
