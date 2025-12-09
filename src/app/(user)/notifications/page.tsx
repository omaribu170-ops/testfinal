/* =====================================================
   صفحة الإشعارات - Notifications Page
===================================================== */

"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2, Calendar, Gamepad2, Clock, Wallet } from "lucide-react";

const mockNotifications = [
    {
        id: "1",
        type: "session_end",
        title: "انتهت جلستك",
        message: "نتمنى أنك قضيت وقتاً ممتعاً! إجمالي الفاتورة: 150 ج.م",
        is_read: false,
        created_at: "2024-12-09T10:30:00",
    },
    {
        id: "2",
        type: "game_night",
        title: "ليلة ألعاب غداً! 🎮",
        message: "لا تنسى بطولة UNO يوم الخميس الساعة 6 مساءً",
        is_read: false,
        created_at: "2024-12-08T18:00:00",
    },
    {
        id: "3",
        type: "wallet",
        title: "تم إضافة رصيد",
        message: "تم إضافة 100 ج.م لرصيدك. الرصيد الحالي: 250 ج.م",
        is_read: true,
        created_at: "2024-12-07T14:15:00",
    },
    {
        id: "4",
        type: "booking",
        title: "تأكيد الحجز",
        message: "تم تأكيد حجزك يوم الجمعة الساعة 3 مساءً - ترابيزة VIP 1",
        is_read: true,
        created_at: "2024-12-06T09:00:00",
    },
];

const iconByType: Record<string, React.ElementType> = {
    session_end: Clock,
    game_night: Gamepad2,
    wallet: Wallet,
    booking: Calendar,
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);

    // تعليم الكل كمقروء
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    // حذف إشعار
    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // حذف الكل
    const deleteAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="animate-fadeIn">
            {/* الهيدر */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="text-brand-start" />
                    الإشعارات
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </h1>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="btn-glass text-sm flex items-center gap-1">
                            <CheckCheck size={16} />
                            قراءة الكل
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button onClick={deleteAll} className="btn-glass text-sm text-red-500 flex items-center gap-1">
                            <Trash2 size={16} />
                            حذف الكل
                        </button>
                    )}
                </div>
            </div>

            {/* قائمة الإشعارات */}
            {notifications.length > 0 ? (
                <div className="space-y-3">
                    {notifications.map(notification => {
                        const Icon = iconByType[notification.type] || Bell;
                        const timeAgo = getTimeAgo(notification.created_at);

                        return (
                            <div
                                key={notification.id}
                                className={`glass-card p-4 flex items-start gap-4 ${!notification.is_read ? "border-r-4 border-brand-start" : ""
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${!notification.is_read ? "bg-brand-gradient text-white" : "bg-gray-100 text-gray-500"
                                    }`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold ${!notification.is_read ? "" : "text-gray-600"}`}>
                                        {notification.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">{timeAgo}</p>
                                </div>
                                <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">لا توجد إشعارات</p>
                </div>
            )}
        </div>
    );
}

// Helper function
function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString("ar-EG");
}
