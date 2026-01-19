'use client';

import React from "react"

import { Bell, Check, Trash2, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/dashboard/page-header';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';

const notificationIcons: Record<Notification['type'], React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const notificationColors: Record<Notification['type'], string> = {
  info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  error: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useAppStore();

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with important alerts and messages"
      >
        <div className="flex gap-2">
          {unreadNotifications.length > 0 && (
            <Button variant="outline" onClick={markAllNotificationsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={clearNotifications}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </PageHeader>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up! Check back later for updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  Unread
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {unreadNotifications.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unreadNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-accent/50',
                        notificationColors[notification.type]
                      )}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="mt-0.5">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-foreground">{notification.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Earlier</CardTitle>
                <CardDescription>Previously read notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {readNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-muted/30"
                    >
                      <div className="mt-0.5">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-muted-foreground">{notification.title}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground/70">{notification.message}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
