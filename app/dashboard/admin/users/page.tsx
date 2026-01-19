'use client';

import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Mail, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/dashboard/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { mockUsers } from '@/store/useAppStore';
import { getRoleDisplayName } from '@/lib/navigation';
import type { User, UserRole } from '@/types';

const allUsers: User[] = [
  ...Object.values(mockUsers),
  {
    id: '7',
    email: 'john.smith@insa.gov',
    name: 'John Smith',
    role: 'employee',
    department: 'Finance',
    createdAt: '2024-07-15',
    lastLogin: '2025-01-18',
  },
  {
    id: '8',
    email: 'maria.garcia@insa.gov',
    name: 'Maria Garcia',
    role: 'store-manager',
    department: 'Procurement',
    createdAt: '2024-08-20',
    lastLogin: '2025-01-19',
  },
  {
    id: '9',
    email: 'james.wilson@insa.gov',
    name: 'James Wilson',
    role: 'technician',
    department: 'IT Support',
    createdAt: '2024-09-10',
    lastLogin: '2025-01-17',
  },
];

const roleColors: Record<UserRole, string> = {
  admin: 'bg-primary/12 text-primary border-primary/30',
  'store-manager': 'bg-violet-500/12 text-violet-600 dark:text-violet-300 border-violet-500/25',
  'asset-manager': 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  technician: 'bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/25',
  employee: 'bg-muted text-muted-foreground border-border/70',
  auditor: 'bg-blue-500/12 text-blue-600 dark:text-blue-300 border-blue-500/25',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage system users and their access permissions"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. Users will receive an email to set up their password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@insa.gov" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="Enter department" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="store-manager">Store Manager</SelectItem>
                    <SelectItem value="asset-manager">Asset Manager</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or department..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="store-manager">Store Manager</SelectItem>
                  <SelectItem value="asset-manager">Asset Manager</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const initials = user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card key={user.id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.department}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Deactivate User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <Badge variant="outline" className={roleColors[user.role]}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <EmptyState
            title="No users found"
            description="Try adjusting your filters or add a new user."
            action={
              <Button onClick={() => setIsDialogOpen(true)} className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Add user
              </Button>
            }
          />
        )}
    </div>
  );
}
