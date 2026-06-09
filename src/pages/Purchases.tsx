import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

export default function Purchases() {
  const purchases = useLiveQuery(() => db.purchases.orderBy('createdAt').reverse().toArray(), []);
  
  return (
    <div className="p-6 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchases</h1>
        <Button>New Purchase Order</Button>
      </div>

      <div className="bg-card rounded-xl border shadow flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases?.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.purchaseNumber}</TableCell>
                  <TableCell>{p.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>{p.supplierId}</TableCell>
                  <TableCell className="text-right font-bold text-primary">€{p.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right capitalize">
                    <span className={`px-2 py-1 rounded text-xs ${p.status === 'received' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right capitalize">{p.paymentStatus}</TableCell>
                </TableRow>
              ))}
              {!purchases?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No purchase orders found
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
