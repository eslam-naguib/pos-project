import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { Product } from '../../db/models';

interface WeightInputModalProps {
  product: Product | null;
  onConfirm: (weight: number) => void;
  onCancel: () => void;
}

export default function WeightInputModal({ product, onConfirm, onCancel }: WeightInputModalProps) {
  const [weightStr, setWeightStr] = useState('1');

  if (!product) return null;

  const handleConfirm = () => {
    const weight = parseFloat(weightStr);
    if (!isNaN(weight) && weight > 0) {
      onConfirm(weight);
      setWeightStr('1'); // Reset
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 transition-all-smooth">
      <div className="bg-card p-6 rounded-2xl w-full max-w-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transform animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold tracking-tight mb-2">Enter Weight</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Please weigh <span className="font-semibold text-foreground">{product.name.en}</span> and enter the weight in {product.unit}.
        </p>
        
        <div className="flex items-center gap-3 mb-6">
          <Input 
            type="number" 
            step="0.01"
            min="0.01"
            value={weightStr}
            onChange={(e) => setWeightStr(e.target.value)}
            className="text-lg font-bold"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          />
          <span className="font-semibold text-muted-foreground">{product.unit}</span>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Add</Button>
        </div>
      </div>
    </div>
  );
}
