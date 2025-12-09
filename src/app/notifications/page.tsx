/* =====================================================
   الإشعارات - Notifications Page
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Bell, ArrowRight, Loader2, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Notification {
    id: string;
    user_id: string | null;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

const typeIcons: Record<string, string> = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    promo: "🎉",
    booking: "📅",
    wallet: "💰"
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data } = await supabase
                .from("notifications")
                .select("*")
                .order("created_at", { ascending: false });

            setNotifications(data as Notification[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const markAsRead = async (id: string) => {
        try {
            const supabase = createClient();
            await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("id", id);

            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const supabase = createClient();
            await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("is_read", false);

            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const supabase = createClient();
            await supabase
                .from("notifications")
                .delete()
                .eq("id", id);

            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        if (hours < 24) return `منذ ${hours} ساعة`;
        return `منذ ${days} يوم`;
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24">
            {/* الهيدر */}
            <header className="glass border-b border-white/20 p-4 sticky top-0 z-10">
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/20 rounded-xl">
                            <ArrowRight size={24} />
                        </Link>
                        <h1 className="text-xl font-bold">الإشعارات</h1>
                        {unreadCount > 0 && (
                            <span className="badge bg-red-500 text-white">{unreadCount}</span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-sm text-brand-start">
                            قراءة الكل
                        </button>
                    )}
                </div>
            </header>

            <div className="max-w-lg mx-auto px-4 py-6">
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="animate-spin mx-auto" size={40} />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">لا يوجد إشعارات</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`glass-card p-4 ${!notification.is_read ? "border-r-4 border-brand-start" : "opacity-70"}`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">
                                        {typeIcons[notification.type] || "📢"}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{notification.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatTime(notification.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {!notification.is_read && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-1.5 hover:bg-green-50 rounded-lg text-green-500"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 px-6 py-3 safe-bottom">
                <div className="max-w-lg mx-auto flex items-center justify-around">
                    <Link href="/" className="nav-item"><span className="text-2xl">🏠</span></Link>
                    <Link href="/booking" className="nav-item"><span className="text-2xl">📅</span></Link>
                    <Link href="/tools" className="nav-item"><span className="text-2xl">🛠️</span></Link>
                    <Link href="/store" className="nav-item"><span className="text-2xl">🛒</span></Link>
                    <Link href="/profile" className="nav-item"><span className="text-2xl">👤</span></Link>
                </div>
            </nav>
        </div>
    );
}
