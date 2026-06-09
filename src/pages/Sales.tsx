import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { useSales } from '../hooks/useSales';
import { ReceiptRefund, Loader2, History } from 'lucide-react';
import type { Sale } from '../db/models';

export default function Sales() {
  const sales = useLiveQuery(() => db.sales.orderBy('createdAt').reverse().toArray(), []);
  const { handleRefund } = useSales();
  
  if (!sales) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 bg-muted/5">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading sales history...</p>
      </div>
    );
  }

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-in fade-in duration-500 bg-muted/5">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-border/50">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-secondary-foreground">Sales History</h1>
          <p className="text-muted-foreground mt-1">Review past transactions and process refunds.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 flex flex-col justify-center">
          <div className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Sales Volume</div>
          <div className="text-4xl font-black text-primary">
            €{totalSales.toFixed(2)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 flex flex-col justify-center">
          <div className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Transactions</div>
          <div className="text-4xl font-black text-secondary-foreground">
            {sales.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
              <TableRow>
                <TableHead className="font-bold">Invoice #</TableHead>
                <TableHead className="font-bold">Date & Time</TableHead>
                <TableHead className="font-bold">Payment</TableHead>
                <TableHead className="text-right font-bold">Total</TableHead>
                <TableHead className="text-right font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Cloud Sync</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((s: Sale) => (
                <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-medium">{s.invoiceNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{s.createdAt.toLocaleString()}</TableCell>
                  <TableCell className="capitalize font-medium">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      s.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' : 
                      s.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {s.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-black text-primary">€{s.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right capitalize">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      s.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      s.syncStatus === 'synced' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {s.syncStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {s.status !== 'refunded' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRefund(s)} 
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors font-semibold"
                      >
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <History className="w-12 h-12 text-muted-foreground/30 mb-4" />
                      <p className="text-lg font-medium">No sales found</p>
                      <p className="text-sm opacity-70 mt-1">Completed transactions will appear here.</p>
                    </div>
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
