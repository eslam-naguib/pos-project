import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { generateEAN13 } from '../services/barcodeService';
import { printReceipt } from '../services/printerService'; // reusing for barcode printing for now
import { usePopupStore } from '../store/popupStore';

export default function Products() {
  const products = useLiveQuery(() => db.products.toArray(), []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const { showPopup } = usePopupStore();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const isWeightBased = formData.get('isWeightBased') === 'on';
    const plu = formData.get('plu') as string;
    
    // Auto generate barcode if not provided
    let barcode = formData.get('barcode') as string;
    if (!barcode) {
      if (isWeightBased && plu) {
         barcode = generateEAN13(plu, 0); // 0 weight baseline
      } else {
         barcode = generateEAN13(Math.floor(Math.random() * 1000000000000).toString());
      }
    }

    await db.products.add({
      id: uuidv4(),
      barcode: barcode,
      barcodeType: isWeightBased ? 'weight-based' : 'standard',
      name: { 
        en: formData.get('nameEn') as string,
        ar: formData.get('nameAr') as string,
        nl: formData.get('nameNl') as string
      },
      categoryId: 'default',
      price: parseFloat(formData.get('price') as string),
      costPrice: parseFloat(formData.get('costPrice') as string),
      stock: parseInt(formData.get('stock') as string, 10),
      minStock: parseInt(formData.get('minStock') as string, 10),
      unit: formData.get('unit') as any,
      isWeightBased,
      taxRate: parseFloat(formData.get('taxRate') as string),
      image: imageBase64 || undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    setIsModalOpen(false);
    setImageBase64(null);
  };

  const handlePrintBarcode = (product: any) => {
    // In a real app, this would send an ESC/POS command to a label printer
    // e.g., using brother-ql or raw zpl commands.
    showPopup({
      type: 'info',
      title: 'Printing Barcode',
      message: `Sent print job for ${product.name.en} (${product.barcode}) to label printer.`
    });
  };
  
  return (
    <div className="p-6 h-full flex flex-col gap-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
      </div>
      
      <div className="bg-card rounded-xl border shadow flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name (EN)</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.image ? (
                      <img src={p.image} alt="Product" className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name.en}</TableCell>
                  <TableCell>{p.barcode}</TableCell>
                  <TableCell className="text-right">€{p.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className={p.stock <= p.minStock ? "text-destructive font-bold" : ""}>
                      {p.stock} {p.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handlePrintBarcode(p)}>Print Barcode</Button>
                  </TableCell>
                </TableRow>
              ))}
              {!products?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input name="nameEn" placeholder="Name (English)" required />
                <Input name="nameAr" placeholder="Name (Arabic)" required />
                <Input name="nameNl" placeholder="Name (Dutch)" required />
                <Input name="barcode" placeholder="Barcode (Leave empty to auto-generate)" />
                <div className="col-span-2 flex items-center gap-2">
                   <input type="checkbox" name="isWeightBased" id="isWeightBased" />
                   <label htmlFor="isWeightBased">Weight-based product (Requires PLU)</label>
                </div>
                <Input name="plu" placeholder="5-digit PLU (if weight-based)" />
                <Input name="price" type="number" step="0.01" placeholder="Selling Price (€)" required />
                <Input name="costPrice" type="number" step="0.01" placeholder="Cost Price (€)" required />
                <Input name="stock" type="number" placeholder="Initial Stock" required />
                <Input name="minStock" type="number" placeholder="Min Stock Alert" required />
                <Input name="taxRate" type="number" step="0.01" placeholder="Tax Rate (%)" defaultValue="21" required />
                <select name="unit" className="border rounded px-3 py-2 bg-background">
                  <option value="piece">Piece</option>
                  <option value="kg">Kg</option>
                  <option value="gram">Gram</option>
                  <option value="liter">Liter</option>
                </select>
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Product Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
