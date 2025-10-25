"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  Shield,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "security" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  user?: {
    name: string;
    avatar: string;
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      title: "New Like",
      message:
        "0x742d...35f1 liked your post about decentralized social networking",
      timestamp: "2 minutes ago",
      isRead: false,
      user: {
        name: "0x742d...35f1",
        avatar: "0x",
      },
    },
    {
      id: "2",
      type: "comment",
      title: "New Comment",
      message: "0x8a9f...2c3d commented on your encrypted message",
      timestamp: "15 minutes ago",
      isRead: false,
      user: {
        name: "0x8a9f...2c3d",
        avatar: "0x",
      },
    },
    {
      id: "3",
      type: "follow",
      title: "New Follower",
      message: "0x5b2e...7f8a started following you",
      timestamp: "1 hour ago",
      isRead: true,
      user: {
        name: "0x5b2e...7f8a",
        avatar: "0x",
      },
    },
    {
      id: "4",
      type: "security",
      title: "Security Alert",
      message: "New device accessed your account from a different location",
      timestamp: "2 hours ago",
      isRead: true,
    },
    {
      id: "5",
      type: "system",
      title: "System Update",
      message: "SafeSocial has been updated with new encryption features",
      timestamp: "1 day ago",
      isRead: true,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "security">("all");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-400" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-green-400" />;
      case "security":
        return <Shield className="w-5 h-5 text-yellow-400" />;
      case "system":
        return <Bell className="w-5 h-5 text-[var(--secondary-color)]" />;
      default:
        return <Bell className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "like":
        return "border-red-400/20 bg-red-400/5";
      case "comment":
        return "border-blue-400/20 bg-blue-400/5";
      case "follow":
        return "border-green-400/20 bg-green-400/5";
      case "security":
        return "border-yellow-400/20 bg-yellow-400/5";
      case "system":
        return "border-[var(--secondary-color)]/20 bg-[var(--secondary-color)]/5";
      default:
        return "border-neutral-700 bg-neutral-800/50";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "security") return notification.type === "security";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  return (
    <DashboardLayout activeTab="notifications">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Notifications
            </h1>
            <p className="text-neutral-400">
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-neutral-700 text-neutral-400 hover:text-white"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-neutral-800/50 p-1 rounded-xl">
          {[
            { id: "all", label: "All", count: notifications.length },
            { id: "unread", label: "Unread", count: unreadCount },
            {
              id: "security",
              label: "Security",
              count: notifications.filter((n) => n.type === "security").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.id
                  ? "bg-[var(--secondary-color)] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </h3>
              <p className="text-neutral-400">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "You'll see notifications here when you receive them."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                  notification.isRead
                    ? "border-neutral-700 bg-neutral-800/30"
                    : `border-[var(--secondary-color)]/30 bg-[var(--secondary-color)]/10 ${getNotificationColor(
                        notification.type
                      )}`
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {notification.user ? (
                      <div className="w-10 h-10 bg-[var(--secondary-color)] rounded-full flex items-center justify-center">
                        <span className="text-neutral-950 font-bold text-sm">
                          {notification.user.avatar}
                        </span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-semibold">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-[var(--secondary-color)] rounded-full"></div>
                      )}
                    </div>
                    <p className="text-neutral-300 text-sm mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500">
                        {notification.timestamp}
                      </span>
                      {!notification.isRead && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-[var(--secondary-color)] hover:text-[var(--secondary-color)]/80"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="w-4 h-4 text-[var(--secondary-color)]" />
            <span className="text-sm font-medium text-[var(--secondary-color)]">
              Privacy Protected
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            All notifications are encrypted and stored locally. No third parties
            can access your notification data.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
