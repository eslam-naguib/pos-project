import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/database';
import { useCartStore } from '../../store/cartStore';

export default function ProductGrid() {
  const products = useLiveQuery(() => db.products.toArray(), []);
  const addItem = useCartStore(state => state.addItem);

  if (!products) return <div className="p-8 text-center">Loading products...</div>;

  const handleAdd = (product: any) => {
    if (product.isWeightBased) {
      // Show weight modal logic here
      const weight = parseFloat(prompt('Enter weight in kg:', '1') || '0');
      if (weight > 0) {
        addItem({
          productId: product.id,
          barcode: product.barcode,
          name: product.name.en,
          quantity: weight,
          unitPrice: product.price,
          taxRate: product.taxRate,
          discount: 0,
          total: weight * product.price
        });
      }
    } else {
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
  };

  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map(product => (
          <button 
            key={product.id}
            onClick={() => handleAdd(product)}
            className="flex flex-col items-start p-4 bg-card border rounded-xl hover:border-primary hover:shadow-md transition-all text-left"
          >
            <div className="text-sm font-semibold mb-2 line-clamp-2 min-h-[40px]">
              {product.name.en}
            </div>
            <div className="mt-auto flex justify-between w-full items-center">
              <span className="text-primary font-bold">€{product.price.toFixed(2)}</span>
              {product.isWeightBased && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">/kg</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
