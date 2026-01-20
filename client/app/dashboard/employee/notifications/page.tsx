'use client';

import { useMemo } from 'react';
import { Bell, CheckCheck } from 'lucide-react';

import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

export default function EmployeeNotificationsPage() {
  const { notifications, unreadCount, markAllNotificationsRead, user } = useAppStore();

  const myNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter((n) => n.userId === user.id);
  }, [notifications, user]);

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
        <Button variant="outline" className="bg-transparent" onClick={markAllNotificationsRead} disabled={unreadCount === 0}>
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
            <Card key={n.id} className={n.read ? 'opacity-80' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground/70">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

