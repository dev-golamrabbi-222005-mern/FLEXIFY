"use client";

import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";
import React from "react";
import { NotificationItem } from "@/components/dashboard/notifications/NotificationDrawer";
import { cleanChannelIdentifier } from "@/lib/notifications/dispatch";

const STORAGE_KEY = "flexify_dashboard_notifications";

export function useDashboardNotifications(user: { role: string; email: string } | null) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load notifications from storage", e);
    }
  }, []);

  const saveNotifications = (items: NotificationItem[]) => {
    setNotifications(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
    } catch (e) {
      console.warn("Failed to save notifications to storage", e);
    }
  };

  useEffect(() => {
    if (!user?.role || !user?.email) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!pusherKey || !pusherCluster) return;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const roleChannelName = `role-${cleanChannelIdentifier(user.role)}`;
    const userChannelName = `user-${cleanChannelIdentifier(user.email)}`;

    const roleChannel = pusher.subscribe(roleChannelName);
    const userChannel = pusher.subscribe(userChannelName);

    const handleNewNotification = (data: {
      id?: string;
      title?: string;
      message: string;
      type?: string;
      link?: string;
    }) => {
      const newNotif: NotificationItem = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        title: data.title || "New Update",
        message: data.message,
        type: data.type || "system",
        link: data.link,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev.filter((item) => item.id !== newNotif.id)];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
        } catch {
          // Ignore storage quota errors
        }
        return updated;
      });

      toast.info(data.message, {
        icon: <Bell size={16} className="text-[var(--primary)]" />,
      });
    };

    roleChannel.bind("new-update", handleNewNotification);
    userChannel.bind("new-update", handleNewNotification);

    return () => {
      pusher.unsubscribe(roleChannelName);
      pusher.unsubscribe(userChannelName);
    };
  }, [user?.role, user?.email]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    saveNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const handleItemClick = (id: string) => {
    saveNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return {
    notifications,
    showDrawer,
    setShowDrawer,
    unreadCount,
    markAllAsRead,
    clearAll,
    handleItemClick,
  };
}
