import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Reports() {
  const sales = useLiveQuery(() => db.sales.toArray(), []);
  const products = useLiveQuery(() => db.products.toArray(), []);

  const totalSales = sales?.reduce((sum, s) => sum + s.total, 0) || 0;
  const totalTax = sales?.reduce((sum, s) => sum + s.taxAmount, 0) || 0;
  const totalStockValue = products?.reduce((sum, p) => sum + (p.stock * p.costPrice), 0) || 0;

  // Mock chart data
  const chartData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 550 },
    { name: 'Thu', sales: 480 },
    { name: 'Fri', sales: 800 },
    { name: 'Sat', sales: 1200 },
    { name: 'Sun', sales: 950 },
  ];

  const handleExportPDF = async () => {
    const element = document.getElementById('reports-dashboard');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('report.pdf');
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto" id="reports-dashboard">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <Button onClick={handleExportPDF}>Export PDF</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Sales (All Time)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">€{totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Tax Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">€{totalTax.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">Current Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">€{totalStockValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 h-96">
          <CardHeader>
            <CardTitle>Sales Trend (Weekly)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `€${value}`} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 h-96 overflow-auto">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sales?.slice(0, 5).map(s => (
                <div key={s.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">{s.invoiceNumber}</div>
                    <div className="text-xs text-muted-foreground">{s.createdAt.toLocaleString()}</div>
                  </div>
                  <div className="font-bold">€{s.total.toFixed(2)}</div>
                </div>
              ))}
              {!sales?.length && <div className="text-muted-foreground">No transactions yet.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
