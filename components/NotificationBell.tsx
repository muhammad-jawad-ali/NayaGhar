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
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 max-h-[400px] overflow-y-auto rounded-2xl bg-slate-900 border border-white/10 shadow-2xl shadow-black z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications</h3>
              {isRefreshing && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />}
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  Mark all as read
                </button>
              )}
              {unreadCount > 0 && <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
            </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n._id?.toString()} 
                  className={`p-4 hover:bg-white/[0.04] transition-all cursor-pointer group ${!n.isRead ? 'bg-indigo-500/5' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-xs font-bold transition-colors ${!n.isRead ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{n.title}</p>
                    {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2">{n.message}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      VIEW ACTION →
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
