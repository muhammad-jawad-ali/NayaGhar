"use client";

import { useState, useEffect, useRef } from "react";
import type { Notification } from "@/lib/types";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchNotifications() {
      if (document.visibilityState !== "visible" || !navigator.onLine) return;
      
      setIsRefreshing(true);
      try {
        const res = await fetch(`/api/notifications?userId=${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.isRead).length);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsRefreshing(false);
      }
    }

    fetchNotifications();
    
    // Poll every 30s, but only if the tab is active
    interval = setInterval(fetchNotifications, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.isRead) {
      await handleMarkAsRead(n._id!.toString());
    }
    setIsOpen(false);
    // Use window.location for hard navigation if needed, or router.push
    window.location.href = n.link;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all ${isOpen ? 'bg-gray-100 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 max-h-[450px] overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-300/40 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Notifications</h3>
              {isRefreshing && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] text-primary hover:underline font-bold transition-colors"
                >
                  Mark all as read
                </button>
              )}
              {unreadCount > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[380px] divide-y divide-gray-50">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n._id?.toString()} 
                  className={`p-5 hover:bg-gray-50 transition-all cursor-pointer group ${!n.isRead ? 'bg-primary/[0.03]' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <p className={`text-xs font-bold transition-colors ${!n.isRead ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 rounded-full bg-primary mt-1 shadow-sm shadow-primary/40" />}
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-3 line-clamp-2">{n.message}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      VIEW ACTION <span className="text-[14px]">→</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-400 text-xs font-bold bg-white">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

