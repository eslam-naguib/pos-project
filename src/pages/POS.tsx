import { useState } from 'react';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';
import { decodeWeightBarcode } from '../services/barcodeService';
import { db } from '../db/database';
import { useCartStore } from '../store/cartStore';

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
    <div className="flex h-full w-full">
      {/* Left side: Products */}
      <div className="w-[60%] flex flex-col h-full bg-muted/10">
        <div className="p-4 border-b bg-card">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleScan}
            placeholder="Search products or scan barcode (press Enter)..." 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            autoFocus
          />
        </div>
        {/* Category Filter will go here */}
        <ProductGrid />
      </div>

      {/* Right side: Cart */}
      <div className="w-[40%] h-full">
        <CartPanel />
      </div>
    </div>
  );
}
