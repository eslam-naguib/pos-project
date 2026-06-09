import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { usePopupStore } from '../store/popupStore';

export default function Sales() {
  const sales = useLiveQuery(() => db.sales.orderBy('createdAt').reverse().toArray(), []);
  const { showPopup } = usePopupStore();

  const handleRefund = async (sale: any) => {
    if (sale.status === 'refunded') return;
    
    showPopup({
      type: 'confirm',
      title: 'Confirm Refund',
      message: `Are you sure you want to refund invoice ${sale.invoiceNumber} for €${sale.total.toFixed(2)}?`,
      onConfirm: async () => {
        // Update sale status
        await db.sales.update(sale.id, { status: 'refunded' });
        
        // Restore stock
        for (const item of sale.items) {
          const product = await db.products.get(item.productId);
          if (product) {
            await db.products.update(product.id, {
              stock: product.stock + item.quantity
            });
          }
        }
      }
    });
  };
  
  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sales History</h1>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-card p-4 rounded-xl shadow border">
          <div className="text-sm text-muted-foreground">Total Sales</div>
          <div className="text-2xl font-bold text-primary">
            €{sales?.reduce((sum, s) => sum + s.total, 0).toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl shadow border">
          <div className="text-sm text-muted-foreground">Transactions</div>
          <div className="text-2xl font-bold">{sales?.length || 0}</div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales?.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.invoiceNumber}</TableCell>
                  <TableCell>{s.createdAt.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{s.paymentMethod}</TableCell>
                  <TableCell className="text-right font-bold text-primary">€{s.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right capitalize">{s.status}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${s.syncStatus === 'synced' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {s.syncStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {s.status !== 'refunded' && (
                      <Button variant="outline" size="sm" onClick={() => handleRefund(s)} className="text-destructive">
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!sales?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No sales found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
