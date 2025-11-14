import React, { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import notificationService from "../api/notificationService";

const POLL_INTERVAL = 30000; // 30 seconds

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread notification count", error);
    }
  };

  const handleToggle = async () => {
    const nextState = !open;
    setOpen(nextState);
    if (!open) {
      await fetchNotifications();
      if (unreadCount > 0) {
        try {
          await notificationService.markAllAsRead();
          setUnreadCount(0);
        } catch (error) {
          console.error("Failed to mark notifications as read", error);
        }
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-white/40"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between text-sm font-semibold text-white">
            <span>Notifications</span>
            {unreadCount === 0 && notifications.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                <CheckCheck className="h-3 w-3" /> All caught up
              </span>
            )}
          </div>

          <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1 text-sm text-slate-200/90">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-slate-300">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-300">
                No notifications yet. You'll see updates on your applications here.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <p className="text-sm font-semibold text-white">{notification.title}</p>
                  <p className="mt-1 text-xs text-slate-300">{notification.message}</p>
                  <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
