import { useState } from 'react';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';
import { decodeWeightBarcode } from '../services/barcodeService';
import { db } from '../db/database';
import { useCartStore } from '../store/cartStore';
import { Search, Barcode } from 'lucide-react';

export default function POS() {
  const [searchTerm, setSearchTerm] = useState('');
  const addItem = useCartStore(state => state.addItem);

  const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm) {
      const code = searchTerm.trim();
      setSearchTerm(''); // clear input
      
      const weightData = decodeWeightBarcode(code);
      if (weightData) {
        // Find product by PLU (assuming barcode field stores PLU for weight items)
        const product = await db.products.where('barcode').equals(weightData.plu).first();
        if (product) {
          const weightKg = weightData.weightGrams / 1000;
          addItem({
            productId: product.id,
            barcode: product.barcode,
            name: product.name.en,
            quantity: weightKg,
            unitPrice: product.price,
            taxRate: product.taxRate,
            discount: 0,
            total: weightKg * product.price
          });
        }
      } else {
        const product = await db.products.where('barcode').equals(code).first();
        if (product) {
          addItem({
            productId: product.id,
            barcode: product.barcode,
            name: product.name.en,
            quantity: 1,
            unitPrice: product.price,
            taxRate: product.taxRate,
            discount: 0,
            total: product.price
          });
        }
      }
    }
  };

  return (
    <div className="flex h-full w-full bg-muted/5 animate-in fade-in duration-500">
      {/* Left side: Products */}
      <div className="w-[60%] flex flex-col h-full bg-transparent">
        <div className="p-5 border-b border-border/50 bg-white/50 backdrop-blur-md sticky top-0 z-10 flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
            <Barcode className="w-6 h-6" />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleScan}
              placeholder="Scan barcode or search products (press Enter)..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none shadow-sm transition-all-smooth text-base"
              autoFocus
            />
          </div>
        </div>
        
        <ProductGrid />
      </div>

      {/* Right side: Cart */}
      <div className="w-[40%] h-full">
        <CartPanel />
      </div>
    </div>
  );
}
