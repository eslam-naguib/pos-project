import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export default function Inventory() {
  const products = useLiveQuery(() => db.products.toArray(), []);
  
  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-card p-4 rounded-xl shadow border">
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="text-2xl font-bold text-primary">
            €{products?.reduce((sum, p) => sum + (p.stock * p.costPrice), 0).toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl shadow border">
          <div className="text-sm text-muted-foreground">Low Stock Items</div>
          <div className="text-2xl font-bold text-amber-500">
            {products?.filter(p => p.stock <= p.minStock && p.stock > 0).length || 0}
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl shadow border">
          <div className="text-sm text-muted-foreground">Out of Stock</div>
          <div className="text-2xl font-bold text-red-500">
            {products?.filter(p => p.stock <= 0).length || 0}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Cost Price</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name.en}</TableCell>
                  <TableCell className="text-right">€{p.costPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">€{p.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">{p.stock} {p.unit}</TableCell>
                  <TableCell className="text-right">€{(p.stock * p.costPrice).toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {p.stock <= 0 ? (
                      <span className="w-3 h-3 rounded-full bg-red-500 inline-block" title="Out of stock"></span>
                    ) : p.stock <= p.minStock ? (
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" title="Low stock"></span>
                    ) : (
                      <span className="w-3 h-3 rounded-full bg-green-500 inline-block" title="OK"></span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
