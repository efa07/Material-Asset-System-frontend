'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import { getRoleDashboardPath } from '@/lib/navigation';

const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    email: 'admin@insa.gov',
    name: 'Administrator',
    role: 'admin',
    department: 'IT Administration',
    createdAt: '2024-01-01',
    lastLogin: '2025-01-19',
  },
  'store-manager': {
    id: '2',
    email: 'store.manager@insa.gov',
    name: 'Sarah Johnson',
    role: 'store-manager',
    department: 'Logistics',
    createdAt: '2024-02-15',
    lastLogin: '2025-01-19',
  },
  'asset-manager': {
    id: '3',
    email: 'asset.manager@insa.gov',
    name: 'Michael Chen',
    role: 'asset-manager',
    department: 'Asset Management',
    createdAt: '2024-03-10',
    lastLogin: '2025-01-19',
  },
  technician: {
    id: '4',
    email: 'technician@insa.gov',
    name: 'David Williams',
    role: 'technician',
    department: 'Maintenance',
    createdAt: '2024-04-20',
    lastLogin: '2025-01-19',
  },
  employee: {
    id: '5',
    email: 'employee@insa.gov',
    name: 'Emily Brown',
    role: 'employee',
    department: 'Operations',
    createdAt: '2024-05-05',
    lastLogin: '2025-01-19',
  },
  auditor: {
    id: '6',
    email: 'auditor@insa.gov',
    name: 'Robert Taylor',
    role: 'auditor',
    department: 'Internal Audit',
    createdAt: '2024-06-12',
    lastLogin: '2025-01-19',
  },
};
import type { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock login with selected role
    const user = mockUsers[selectedRole];
    login(user);

    // Redirect to role-specific dashboard
    router.push(getRoleDashboardPath(selectedRole));
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const user = mockUsers[role];
    login(user);
    router.push(getRoleDashboardPath(role));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            INSA Asset Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Enterprise Material & Asset Management System
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-medium">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@insa.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="h-11 pr-10 bg-background/50"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Demo Role (for testing)
                </Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                  <SelectTrigger className="h-11 bg-background/50">
                    <SelectValue placeholder="Select a role" />
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

              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Quick Demo Access
                </span>
              </div>
            </div>

            {/* Quick Demo Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {(['admin', 'store-manager', 'asset-manager', 'technician', 'employee', 'auditor'] as UserRole[]).map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs font-medium hover:bg-accent/50 transition-colors bg-transparent"
                  onClick={() => handleDemoLogin(role)}
                  disabled={isLoading}
                >
                  {role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Protected by enterprise-grade security. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
