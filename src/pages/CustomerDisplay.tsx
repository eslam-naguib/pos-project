import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';

export default function CustomerDisplay() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('idle');

  // In a real app with separate devices, we'd use WebSocket or BroadcastChannel.
  // Here we use localStorage events as a simple cross-tab sync mechanism.
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cart-sync') {
        const data = JSON.parse(e.newValue || '{}');
        setCartItems(data.items || []);
        setTotal(data.total || 0);
      }
      if (e.key === 'cart-status') {
        const data = JSON.parse(e.newValue || '{}');
        setStatus(data.status || 'idle');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Section */}
      <div className="h-24 bg-primary text-primary-foreground flex items-center justify-between px-8 shadow-md">
        <h1 className="text-4xl font-bold">POS System</h1>
        <h2 className="text-2xl">Welcome / Welkom / أهلاً بكم</h2>
      </div>

      {/* Middle Section: Items */}
      <div className="flex-1 overflow-y-auto p-8 bg-muted/10">
        <div className="max-w-4xl mx-auto w-full bg-card rounded-xl shadow-sm border p-6">
          <table className="w-full text-xl">
            <thead>
              <tr className="border-b-2">
                <th className="text-left pb-4">Item</th>
                <th className="text-center pb-4 w-24">Qty</th>
                <th className="text-right pb-4 w-32">Price</th>
                <th className="text-right pb-4 w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item: any, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">€{item.unitPrice.toFixed(2)}</td>
                  <td className="py-4 text-right font-bold">€{item.total.toFixed(2)}</td>
                </tr>
              ))}
              {cartItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground text-3xl font-bold text-primary">
                    {status === 'paid' ? 'Bedankt!' : 'Next customer please...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Total */}
      <div className="h-40 bg-card border-t shadow-lg flex items-center justify-end px-12">
        <div className="flex items-center gap-8">
          <span className="text-4xl font-semibold text-muted-foreground">Total:</span>
          <span className="text-7xl font-bold text-primary">€{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
