import { db } from '../../db/database';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const categories = useLiveQuery(() => db.categories.toArray(), []);

  if (!isOpen) return null;

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
    
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 transition-all-smooth">
      <div className="bg-card p-8 rounded-3xl w-full max-w-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transform animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Add Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input name="nameEn" placeholder="Name (English)" required className="rounded-xl" />
          <Input name="nameAr" placeholder="Name (Arabic)" required dir="rtl" className="rounded-xl" />
          <Input name="nameNl" placeholder="Name (Dutch)" required className="rounded-xl" />
          <Input name="icon" placeholder="Icon (Emoji)" className="rounded-xl" />
          <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-xl border border-border/50">
            <label className="font-medium text-sm">Theme Color</label>
            <input type="color" name="color" defaultValue="#6366f1" className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose} className="rounded-xl px-6">Cancel</Button>
            <Button type="submit" className="rounded-xl px-8">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
