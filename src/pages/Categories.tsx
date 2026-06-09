import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { v4 as uuidv4 } from 'uuid';

export default function Categories() {
  const categories = useLiveQuery(() => db.categories.orderBy('order').toArray(), []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await db.categories.add({
      id: uuidv4(),
      name: { 
        en: formData.get('nameEn') as string,
        ar: formData.get('nameAr') as string,
        nl: formData.get('nameNl') as string
      },
      color: formData.get('color') as string,
      icon: formData.get('icon') as string,
      order: categories?.length ? categories.length : 0,
      isActive: true
    });
    
    setIsModalOpen(false);
  };
  
  return (
    <div className="p-6 h-full flex flex-col gap-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
      </div>
      
      <div className="bg-card rounded-xl border shadow flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name (EN)</TableHead>
                <TableHead>Name (AR)</TableHead>
                <TableHead>Name (NL)</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="text-2xl">{c.icon}</TableCell>
                  <TableCell className="font-medium">{c.name.en}</TableCell>
                  <TableCell>{c.name.ar}</TableCell>
                  <TableCell>{c.name.nl}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.color}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl w-full max-w-sm shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Add Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <Input name="nameEn" placeholder="Name (English)" required />
              <Input name="nameAr" placeholder="Name (Arabic)" required />
              <Input name="nameNl" placeholder="Name (Dutch)" required />
              <Input name="icon" placeholder="Icon (Emoji)" />
              <div className="flex items-center gap-4">
                <label>Color</label>
                <input type="color" name="color" defaultValue="#3b82f6" className="w-10 h-10 p-0 border-0" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
