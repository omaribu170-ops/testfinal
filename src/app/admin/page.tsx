/* =====================================================
   Admin Dashboard - الصفحة الرئيسية للوحة التحكم
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Users, Clock, Wallet, Plus, Play, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeSessions: 0,
        totalMembers: 0,
        occupiedTables: 0,
        totalTables: 0,
        todayRevenue: 0
    });
    const [activeSessions, setActiveSessions] = useState<{
        id: string;
        table_name: string;
        members: string[];
        start_time: string;
    }[]>([]);

    // جلب البيانات
    const fetchData = async () => {
        setLoading(true);
        try {
            const supabase = createClient();

            // الجلسات النشطة
            const { data: sessions } = await supabase
                .from("sessions")
                .select("id, start_time, members, tables(name)")
                .is("end_time", null);

            // عدد الأعضاء
            const { count: membersCount } = await supabase
                .from("users")
                .select("*", { count: "exact", head: true })
                .eq("role", "member");

            // الترابيزات
            const { data: tables } = await supabase
                .from("tables")
                .select("status");

            // إيرادات اليوم
            const today = new Date().toISOString().split("T")[0];
            const { data: todaySessions } = await supabase
                .from("sessions")
                .select("total_price")
                .eq("is_paid", true)
                .gte("end_time", today);

            const todayRevenue = (todaySessions as { total_price: number | null }[] || [])
                .reduce((sum, s) => sum + (s.total_price || 0), 0);

            const occupiedCount = (tables || []).filter(t => t.status === "occupied").length;

            setStats({
                activeSessions: sessions?.length || 0,
                totalMembers: membersCount || 0,
                occupiedTables: occupiedCount,
                totalTables: tables?.length || 0,
                todayRevenue
            });

            setActiveSessions((sessions || []).map(s => ({
                id: s.id,
                table_name: (s.tables as { name: string } | null)?.name || "غير معروف",
                members: s.members || [],
                start_time: s.start_time
            })));

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

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
                <StatCard icon={Clock} label="الجلسات النشطة" value={stats.activeSessions} color="bg-blue-500" />
                <StatCard icon={Users} label="إجمالي الأعضاء" value={stats.totalMembers} color="bg-green-500" />
                <StatCard icon={LayoutDashboard} label="الترابيزات المشغولة" value={`${stats.occupiedTables}/${stats.totalTables}`} color="bg-purple-500" />
                <StatCard icon={Wallet} label="إيرادات اليوم" value={`${stats.todayRevenue} ج.م`} color="bg-orange-500" />
            </div>

            {/* الجلسات النشطة */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">الجلسات النشطة</h2>
                    <Link href="/admin/sessions" className="text-sm text-gray-500 flex items-center gap-1">
                        عرض الكل <ChevronLeft size={16} />
                    </Link>
                </div>
                {activeSessions.length === 0 ? (
                    <div className="glass-card p-8 text-center">
                        <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">لا يوجد جلسات نشطة حالياً</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeSessions.slice(0, 6).map((session) => (
                            <div key={session.id} className="glass-card p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold">{session.table_name}</span>
                                    <span className="badge badge-info">
                                        <Play size={12} className="ml-1" />
                                        نشطة
                                    </span>
                                </div>
                                {session.members.length > 0 && (
                                    <p className="text-sm text-gray-500 mb-3">{session.members.join("، ")}</p>
                                )}
                                <div className="flex items-center justify-between">
                                    <SessionTimer startTime={session.start_time} />
                                    <Link href="/admin/sessions" className="text-sm text-red-500 hover:underline">
                                        إنهاء
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
