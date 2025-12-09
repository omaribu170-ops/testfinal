/* =====================================================
   الإحصائيات - Statistics Dashboard
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { BarChart2, Users, Clock, Wallet, TrendingUp, Loader2, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Stats {
    totalMembers: number;
    totalSessions: number;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    averageSessionDuration: number;
    topMembers: { name: string; total_spent: number }[];
}

export default function StatisticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("month");

    const fetchStats = async () => {
        setLoading(true);
        try {
            const supabase = createClient();

            // تحديد تاريخ البداية
            const now = new Date();
            let startDate: Date;
            if (period === "week") {
                startDate = new Date(now.setDate(now.getDate() - 7));
            } else if (period === "month") {
                startDate = new Date(now.setMonth(now.getMonth() - 1));
            } else {
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            }
            const startDateStr = startDate.toISOString();

            // عدد الأعضاء الكلي
            const { count: membersCount } = await supabase
                .from("users")
                .select("*", { count: "exact", head: true })
                .eq("role", "member");

            // الجلسات المكتملة
            const { data: sessions } = await supabase
                .from("sessions")
                .select("total_price, start_time, end_time")
                .eq("is_paid", true)
                .gte("end_time", startDateStr);

            // المصروفات
            const { data: expenses } = await supabase
                .from("expenses")
                .select("amount")
                .gte("expense_date", startDateStr.split("T")[0]);

            // أفضل الأعضاء
            const { data: topMembers } = await supabase
                .from("users")
                .select("name, total_spent")
                .eq("role", "member")
                .order("total_spent", { ascending: false })
                .limit(5);

            // الحسابات
            const totalRevenue = (sessions as { total_price: number | null }[] || [])
                .reduce((sum, s) => sum + (s.total_price || 0), 0);

            const totalExpenses = (expenses as { amount: number }[] || [])
                .reduce((sum, e) => sum + (e.amount || 0), 0);

            // متوسط مدة الجلسة
            let avgDuration = 0;
            if (sessions && sessions.length > 0) {
                const totalMinutes = sessions.reduce((sum, s) => {
                    if (s.start_time && s.end_time) {
                        const diff = new Date(s.end_time).getTime() - new Date(s.start_time).getTime();
                        return sum + diff / (1000 * 60);
                    }
                    return sum;
                }, 0);
                avgDuration = Math.round(totalMinutes / sessions.length);
            }

            setStats({
                totalMembers: membersCount || 0,
                totalSessions: sessions?.length || 0,
                totalRevenue,
                totalExpenses,
                netProfit: totalRevenue - totalExpenses,
                averageSessionDuration: avgDuration,
                topMembers: topMembers as { name: string; total_spent: number }[] || []
            });

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, [period]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (!stats) {
        return <div className="text-center py-12 text-gray-500">حدث خطأ في تحميل البيانات</div>;
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BarChart2 className="text-brand-start" />
                        الإحصائيات
                    </h1>
                </div>
                <div className="flex gap-2">
                    {["week", "month", "year"].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-xl text-sm ${period === p ? "bg-brand-gradient text-white" : "btn-glass"}`}
                        >
                            {p === "week" ? "أسبوع" : p === "month" ? "شهر" : "سنة"}
                        </button>
                    ))}
                </div>
            </div>

            {/* الإحصائيات الرئيسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-500"><Users className="text-white" size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">إجمالي الأعضاء</p>
                            <p className="text-2xl font-bold">{stats.totalMembers}</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-purple-500"><Clock className="text-white" size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">الجلسات</p>
                            <p className="text-2xl font-bold">{stats.totalSessions}</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-500"><Wallet className="text-white" size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">الإيرادات</p>
                            <p className="text-2xl font-bold">{stats.totalRevenue} ج.م</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-orange-500"><TrendingUp className="text-white" size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">صافي الربح</p>
                            <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {stats.netProfit} ج.م
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* تفاصيل */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* المصروفات vs الإيرادات */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Calendar size={20} />
                        ملخص مالي
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">الإيرادات</span>
                            <span className="font-bold text-green-600">{stats.totalRevenue} ج.م</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">المصروفات</span>
                            <span className="font-bold text-red-600">{stats.totalExpenses} ج.م</span>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center">
                            <span className="font-bold">صافي الربح</span>
                            <span className={`font-bold text-xl ${stats.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {stats.netProfit} ج.م
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        متوسط مدة الجلسة: {stats.averageSessionDuration} دقيقة
                    </div>
                </div>

                {/* أفضل الأعضاء */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Users size={20} />
                        أفضل الأعضاء
                    </h3>
                    {stats.topMembers.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">لا يوجد بيانات</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.topMembers.map((member, index) => (
                                <div key={member.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-400" : "bg-gray-300"
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <span className="font-medium">{member.name}</span>
                                    </div>
                                    <span className="font-bold gradient-text">{member.total_spent} ج.م</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
