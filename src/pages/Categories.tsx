import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import AddCategoryModal from '../components/categories/AddCategoryModal';
import { FolderPlus, Loader2, Tags } from 'lucide-react';

export default function Categories() {
  const categories = useLiveQuery(() => db.categories.orderBy('order').toArray(), []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (!categories) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 bg-muted/5">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col gap-6 relative animate-in fade-in duration-500 bg-muted/5">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-border/50">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-secondary-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your products into logical groups.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-xl px-6 gap-2 h-12 shadow-md hover:shadow-lg transition-all-smooth">
          <FolderPlus className="w-5 h-5" />
          Add Category
        </Button>
      </div>
      
      <div className="bg-white rounded-2xl border border-border/50 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
              <TableRow>
                <TableHead className="w-[80px] text-center font-bold">Icon</TableHead>
                <TableHead className="font-bold">Name (EN)</TableHead>
                <TableHead className="font-bold">Name (AR)</TableHead>
                <TableHead className="font-bold">Name (NL)</TableHead>
                <TableHead className="font-bold">Color Theme</TableHead>
                <TableHead className="text-right font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(c => (
                <TableRow key={c.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-2xl text-center">{c.icon || '📁'}</TableCell>
                  <TableCell className="font-bold text-secondary-foreground">{c.name.en}</TableCell>
                  <TableCell className="text-muted-foreground">{c.name.ar}</TableCell>
                  <TableCell className="text-muted-foreground">{c.name.nl}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full shadow-sm border border-black/10" style={{ backgroundColor: c.color }} />
                      <span className="font-mono text-sm text-muted-foreground">{c.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Tags className="w-12 h-12 text-muted-foreground/30 mb-4" />
                      <p className="text-lg font-medium">No categories found</p>
                      <p className="text-sm opacity-70 mt-1">Click "Add Category" to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
