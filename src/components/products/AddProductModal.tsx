import { useState } from 'react';
import { db } from '../../db/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { v4 as uuidv4 } from 'uuid';
import { generateEAN13 } from '../../services/barcodeService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  if (!isOpen) return null;

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
    
    let barcode = formData.get('barcode') as string;
    if (!barcode) {
      if (isWeightBased && plu) {
         barcode = generateEAN13(plu, 0); 
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
      unit: formData.get('unit') as 'piece' | 'kg' | 'gram' | 'liter',
      isWeightBased,
      taxRate: parseFloat(formData.get('taxRate') as string),
      image: imageBase64 || undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    setImageBase64(null);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 transition-all-smooth">
      <div className="bg-card p-8 rounded-3xl w-full max-w-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Input name="nameEn" placeholder="Name (English)" required />
            <Input name="nameAr" placeholder="Name (Arabic)" required dir="rtl" />
            <Input name="nameNl" placeholder="Name (Dutch)" required className="col-span-2" />
            
            <Input name="barcode" placeholder="Barcode (Leave empty to auto-generate)" className="col-span-2" />
            
            <div className="col-span-2 flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border/50">
               <input type="checkbox" name="isWeightBased" id="isWeightBased" className="w-5 h-5 rounded border-primary text-primary focus:ring-primary" />
               <label htmlFor="isWeightBased" className="font-medium text-sm">Weight-based product (Requires PLU)</label>
            </div>
            
            <Input name="plu" placeholder="5-digit PLU (if weight-based)" className="col-span-2" />
            
            <Input name="price" type="number" step="0.01" placeholder="Selling Price (€)" required />
            <Input name="costPrice" type="number" step="0.01" placeholder="Cost Price (€)" required />
            
            <Input name="stock" type="number" placeholder="Initial Stock" required />
            <Input name="minStock" type="number" placeholder="Min Stock Alert" required />
            
            <Input name="taxRate" type="number" step="0.01" placeholder="Tax Rate (%)" defaultValue="21" required />
            <select name="unit" className="border border-input rounded-xl px-4 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="piece">Piece</option>
              <option value="kg">Kg</option>
              <option value="gram">Gram</option>
              <option value="liter">Liter</option>
            </select>
            
            <div className="col-span-2 mt-2">
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Product Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all-smooth cursor-pointer border border-dashed p-4 rounded-xl text-muted-foreground" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose} className="rounded-xl px-6">Cancel</Button>
            <Button type="submit" className="rounded-xl px-8">Save Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
