'use client';

import { useMemo } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { useNotifications } from '@/hooks/useQueries';
import { useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useMutations';

export default function EmployeeNotificationsPage() {
  const { user } = useAppStore();
  const { data: notifications, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const myNotifications = useMemo(() => {
    if (!user || !notifications) return [];
    return notifications.filter((n) => n.userId === user.id);
  }, [notifications, user]);

  const unreadCount = useMemo(() => {
    return myNotifications.filter((n) => !n.isRead).length;
  }, [myNotifications]);

  const handleMarkAllRead = () => {
    const unreadIds = myNotifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length > 0) {
      markAllReadMutation.mutate(unreadIds);
    }
  };

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Operational messages and approvals" />

      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Unread</p>
            <p className="text-sm text-muted-foreground">{unreadCount} notifications</p>
          </div>
        </div>
        <Button variant="outline" className="bg-transparent" onClick={handleMarkAllRead} disabled={unreadCount === 0 || markAllReadMutation.isPending}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all read
        </Button>
      </div>

      <div className="grid gap-3">
        {myNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">No notifications.</CardContent>
          </Card>
        ) : (
          myNotifications.map((n) => (
            <Card key={n.id} className={n.isRead ? 'opacity-80' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground/70">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && (
                    <Button size="sm" variant="ghost" onClick={() => markReadMutation.mutate(n.id)}>
                        Mark read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

