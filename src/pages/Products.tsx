import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { usePopupStore } from '../store/popupStore';
import AddProductModal from '../components/products/AddProductModal';
import { PackagePlus, Loader2 } from 'lucide-react';
import type { Product } from '../db/models';

export default function Products() {
  const products = useLiveQuery(() => db.products.toArray(), []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showPopup } = usePopupStore();

  const handlePrintBarcode = (product: Product) => {
    // In a real app, this would send an ESC/POS command to a label printer
    showPopup({
      type: 'info',
      title: 'Printing Barcode',
      message: `Sent print job for ${product.name.en} (${product.barcode}) to label printer.`
    });
  };
  
  return (
    <div className="p-6 h-full flex flex-col gap-6 relative animate-in fade-in duration-500 bg-muted/5">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-border/50">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-secondary-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Manage your products, barcodes, and stock levels.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-xl px-6 gap-2 h-12 shadow-md hover:shadow-lg transition-all-smooth">
          <PackagePlus className="w-5 h-5" />
          Add Product
        </Button>
      </div>
      
      <div className="bg-white rounded-2xl border border-border/50 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          {!products ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading products...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="font-bold">Image</TableHead>
                  <TableHead className="font-bold">Name (EN)</TableHead>
                  <TableHead className="font-bold">Barcode</TableHead>
                  <TableHead className="text-right font-bold">Price</TableHead>
                  <TableHead className="text-right font-bold">Stock</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      {p.image ? (
                        <img src={p.image} alt="Product" className="w-12 h-12 rounded-xl object-cover border shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-[10px] text-muted-foreground border">No img</div>
                      )}
                    </TableCell>
                    <TableCell className="font-bold text-secondary-foreground">{p.name.en}</TableCell>
                    <TableCell className="font-mono text-sm">{p.barcode}</TableCell>
                    <TableCell className="text-right font-semibold">€{p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock <= p.minStock ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                        {p.stock} {p.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handlePrintBarcode(p)} className="rounded-lg font-semibold">
                        Print Label
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <PackagePlus className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm opacity-70 mt-1">Click "Add Product" to populate your inventory.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
