import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ShieldCheck, UserPlus, Loader2 } from 'lucide-react';
import type { User } from '../db/models';

export default function AdminRoles() {
  const users = useLiveQuery(() => db.users.toArray(), []);

  if (!users) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 bg-muted/5">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col gap-6 animate-in fade-in duration-500 bg-muted/5">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-border/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-secondary-foreground">Admin & Roles</h1>
            <p className="text-muted-foreground mt-1">Manage system users, PINs, and access levels.</p>
          </div>
        </div>
        <Button className="rounded-xl px-6 gap-2 h-12 shadow-md hover:shadow-lg transition-all-smooth">
          <UserPlus className="w-5 h-5" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
              <TableRow>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Role</TableHead>
                <TableHead className="text-right font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u: User) => (
                <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-bold text-secondary-foreground">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="capitalize">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                      {u.role.replace('-', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
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
