'use client';

import { Shield, Users, Eye, Edit, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/dashboard/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: string;
}

const permissions: Permission[] = [
  { id: 'assets.view', name: 'View Assets', description: 'View asset inventory and details' },
  { id: 'assets.create', name: 'Create Assets', description: 'Register new assets in the system' },
  { id: 'assets.edit', name: 'Edit Assets', description: 'Modify asset information' },
  { id: 'assets.delete', name: 'Delete Assets', description: 'Remove assets from the system' },
  { id: 'assets.assign', name: 'Assign Assets', description: 'Assign assets to users' },
  { id: 'users.view', name: 'View Users', description: 'View user profiles and list' },
  { id: 'users.create', name: 'Create Users', description: 'Create new user accounts' },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user information' },
  { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts' },
  { id: 'stores.view', name: 'View Stores', description: 'View store information' },
  { id: 'stores.manage', name: 'Manage Stores', description: 'Create and edit stores' },
  { id: 'requests.approve', name: 'Approve Requests', description: 'Approve asset requests' },
  { id: 'maintenance.view', name: 'View Maintenance', description: 'View maintenance tasks' },
  { id: 'maintenance.manage', name: 'Manage Maintenance', description: 'Create and update maintenance' },
  { id: 'reports.view', name: 'View Reports', description: 'Access system reports' },
  { id: 'reports.export', name: 'Export Reports', description: 'Export data to CSV/PDF' },
  { id: 'audit.view', name: 'View Audit Logs', description: 'Access system audit logs' },
  { id: 'settings.manage', name: 'System Settings', description: 'Manage system configuration' },
];

const roles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    userCount: 3,
    permissions: permissions.map((p) => p.id),
    color: 'bg-red-500',
  },
  {
    id: '2',
    name: 'Store Manager',
    description: 'Manage store inventory and approvals',
    userCount: 8,
    permissions: [
      'assets.view',
      'assets.edit',
      'assets.assign',
      'stores.view',
      'stores.manage',
      'requests.approve',
      'reports.view',
    ],
    color: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Asset Manager',
    description: 'Register and track assets',
    userCount: 12,
    permissions: [
      'assets.view',
      'assets.create',
      'assets.edit',
      'stores.view',
      'reports.view',
      'reports.export',
    ],
    color: 'bg-emerald-500',
  },
  {
    id: '4',
    name: 'Technician',
    description: 'Handle maintenance tasks',
    userCount: 25,
    permissions: ['assets.view', 'maintenance.view', 'maintenance.manage'],
    color: 'bg-amber-500',
  },
  {
    id: '5',
    name: 'Employee',
    description: 'Request and use assigned assets',
    userCount: 98,
    permissions: ['assets.view'],
    color: 'bg-gray-500',
  },
  {
    id: '6',
    name: 'Auditor',
    description: 'Read-only access for compliance',
    userCount: 10,
    permissions: ['assets.view', 'users.view', 'stores.view', 'audit.view', 'reports.view', 'reports.export'],
    color: 'bg-purple-500',
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Configure role-based access control for the system"
      />

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${role.color}/20 flex items-center justify-center`}>
                        <Shield className={`h-5 w-5 ${role.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base font-medium">{role.name}</CardTitle>
                        <CardDescription className="text-xs">{role.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{role.userCount} users</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {role.permissions.length} permissions
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 4).map((permId) => {
                      const perm = permissions.find((p) => p.id === permId);
                      return (
                        <Badge key={permId} variant="outline" className="text-[10px] px-1.5 py-0">
                          {perm?.name}
                        </Badge>
                      );
                    })}
                    {role.permissions.length > 4 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        +{role.permissions.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="flex-1 h-8">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-8">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Permission Matrix</CardTitle>
              <CardDescription>View and edit permissions for each role</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[200px]">
                        Permission
                      </th>
                      {roles.map((role) => (
                        <th
                          key={role.id}
                          className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[120px]"
                        >
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission, idx) => (
                      <tr key={permission.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <td className="p-4">
                          <div>
                            <p className="text-sm font-medium text-foreground">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td key={role.id} className="text-center p-4">
                            {role.permissions.includes(permission.id) ? (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                                <Check className="h-3 w-3 text-emerald-500" />
                              </div>
                            ) : (
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                                <X className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
