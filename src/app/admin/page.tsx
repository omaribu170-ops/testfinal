/* =====================================================
   Admin Dashboard - الصفحة الرئيسية للوحة التحكم
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Users, Clock, Wallet, Plus, Play, ChevronLeft } from "lucide-react";
import Link from "next/link";

// إحصائيات تجريبية
const mockStats = {
    activeSessions: 5,
    newMembers: 12,
    occupiedTables: 7,
    todayRevenue: 2450,
};

// جلسات نشطة تجريبية
const mockActiveSessions = [
    { id: "1", table: "VIP 1", members: ["أحمد", "محمد"], startTime: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: "2", table: "عادية 3", members: ["سارة"], startTime: new Date(Date.now() - 3600000).toISOString() },
    { id: "3", table: "كبيرة 1", members: ["خالد", "نورا", "علي"], startTime: new Date(Date.now() - 1800000).toISOString() },
];

// Timer Component
function SessionTimer({ startTime }: { startTime: string }) {
    const [elapsed, setElapsed] = useState("");

    useEffect(() => {
        const updateTimer = () => {
            const start = new Date(startTime).getTime();
            const now = Date.now();
            const diff = now - start;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setElapsed(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    return <span className="timer-small font-mono">{elapsed}</span>;
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
    return (
        <div className="stat-card">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="text-white" size={24} />
                </div>
                <span className="text-gray-500 text-sm">{label}</span>
            </div>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <LayoutDashboard className="text-brand-start" />
                        لوحة التحكم
                    </h1>
                    <p className="text-gray-500 mt-1">مرحباً بك في The Hub</p>
                </div>
                <Link href="/admin/sessions" className="btn-gradient flex items-center gap-2">
                    <Plus size={20} />
                    جلسة جديدة
                </Link>
            </div>

            {/* الإحصائيات السريعة */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Clock} label="الجلسات النشطة" value={mockStats.activeSessions} color="bg-blue-500" />
                <StatCard icon={Users} label="أعضاء جدد اليوم" value={mockStats.newMembers} color="bg-green-500" />
                <StatCard icon={LayoutDashboard} label="الترابيزات المشغولة" value={`${mockStats.occupiedTables}/10`} color="bg-purple-500" />
                <StatCard icon={Wallet} label="إيرادات اليوم" value={`${mockStats.todayRevenue} ج.م`} color="bg-orange-500" />
            </div>

            {/* الجلسات النشطة */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">الجلسات النشطة</h2>
                    <Link href="/admin/sessions" className="text-sm text-gray-500 flex items-center gap-1">
                        عرض الكل <ChevronLeft size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockActiveSessions.map((session) => (
                        <div key={session.id} className="glass-card p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-bold">{session.table}</span>
                                <span className="badge badge-info">
                                    <Play size={12} className="ml-1" />
                                    نشطة
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{session.members.join("، ")}</p>
                            <div className="flex items-center justify-between">
                                <SessionTimer startTime={session.startTime} />
                                <button className="text-sm text-red-500 hover:underline">إنهاء</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* إجراءات سريعة */}
            <section>
                <h2 className="text-xl font-semibold mb-4">إجراءات سريعة</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "عضو جديد", href: "/admin/members", icon: "👤" },
                        { label: "جلسة جديدة", href: "/admin/sessions", icon: "🎯" },
                        { label: "الإحصائيات", href: "/admin/statistics", icon: "📊" },
                        { label: "المخزن", href: "/admin/inventory", icon: "📦" },
                    ].map((action) => (
                        <Link key={action.href} href={action.href} className="glass-card p-4 text-center hover:scale-105 transition-transform">
                            <span className="text-3xl">{action.icon}</span>
                            <p className="mt-2 font-medium">{action.label}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
