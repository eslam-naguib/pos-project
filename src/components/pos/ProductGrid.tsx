import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { useCartStore } from '../../store/cartStore';
import type { Product } from '../../db/models';
import WeightInputModal from './WeightInputModal';
import { Loader2 } from 'lucide-react';

export default function ProductGrid() {
  const products = useLiveQuery(() => db.products.toArray(), []);
  const addItem = useCartStore(state => state.addItem);

  const [selectedWeightProduct, setSelectedWeightProduct] = useState<Product | null>(null);

  if (!products) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading inventory...</p>
      </div>
    );
  }

  const handleAdd = (product: Product) => {
    if (product.isWeightBased) {
      // Trigger modern popup instead of prompt()
      setSelectedWeightProduct(product);
    } else {
      addItem({
        productId: product.id,
        barcode: product.barcode,
        name: product.name.en, // Or localize based on i18n
        quantity: 1,
        unitPrice: product.price,
        taxRate: product.taxRate,
        discount: 0,
        total: product.price
      });
    }
  };

  const handleWeightConfirm = (weight: number) => {
    if (selectedWeightProduct) {
      addItem({
        productId: selectedWeightProduct.id,
        barcode: selectedWeightProduct.barcode,
        name: selectedWeightProduct.name.en,
        quantity: weight,
        unitPrice: selectedWeightProduct.price,
        taxRate: selectedWeightProduct.taxRate,
        discount: 0,
        total: weight * selectedWeightProduct.price
      });
      setSelectedWeightProduct(null);
    }
  };

  return (
    <div className="p-5 flex-1 overflow-y-auto bg-muted/5 relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map(product => (
          <button 
            key={product.id}
            onClick={() => handleAdd(product)}
            className="flex flex-col items-start p-4 bg-white border border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all-smooth text-left group"
          >
            <div className="text-sm font-semibold mb-3 line-clamp-2 min-h-[40px] text-secondary-foreground group-hover:text-primary transition-colors">
              {product.name.en}
            </div>
            <div className="mt-auto flex justify-between w-full items-center pt-2 border-t border-border/30">
              <span className="text-primary font-black tracking-tight">€{product.price.toFixed(2)}</span>
              {product.isWeightBased && (
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded-md uppercase tracking-wider">
                  /{product.unit}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <WeightInputModal 
        product={selectedWeightProduct} 
        onConfirm={handleWeightConfirm} 
        onCancel={() => setSelectedWeightProduct(null)} 
      />
    </div>
  );
}
