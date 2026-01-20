'use client';

import { useRouter } from 'next/navigation';
import { Bell, Moon, Sun, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { getRoleDisplayName } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

import { useNotifications } from '@/hooks/useQueries';

export function Navbar() {
  const router = useRouter();
  const { user, logout, theme: storeTheme } = useAppStore();
  const { theme, setTheme } = useTheme();

  const { data: notificationsData } = useNotifications();
  const notifications = notificationsData || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/80 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-8">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">System Overview</h1>
      </div>

      {/* Right Side Actions */}
      <div className="ml-auto flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden w-64 items-center md:flex">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search resources..."
            className="h-9 w-full rounded-lg border-border/50 bg-secondary/50 pl-9 pr-12 text-sm transition-all focus:border-primary/50 focus:bg-background/80"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-foreground"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl border-border/80">
              <DropdownMenuLabel className="flex items-center justify-between font-medium">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => { }}
                  >
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="max-h-[320px] space-y-1 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        'flex cursor-pointer flex-col gap-1 rounded-xl p-3 transition-colors',
                        !notification.read && 'bg-accent/70'
                      )}
                    >
                      <div className="flex w-full items-center gap-2">
                        <span className="text-sm font-medium">{notification.title}</span>
                        {!notification.read && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px] shadow-primary/20" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </span>
                      <span className="text-[10px] text-muted-foreground/70">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 gap-2 rounded-xl pl-2 pr-3 text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start md:flex">
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                  <span className="text-[11px] text-muted-foreground">{getRoleDisplayName(user.role)}</span>
                </div>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl border-border/80">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1 w-fit text-[10px] uppercase tracking-wide">
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
