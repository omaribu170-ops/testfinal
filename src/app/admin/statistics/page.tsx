/* =====================================================
   الإحصائيات - Statistics Dashboard
   تقارير شاملة عن أداء المكان
===================================================== */

"use client";

import { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    Clock,
    Wallet,
    Gamepad2,
    Calendar,
    Download,
    ArrowUp,
    ArrowDown,
    Trophy,
    Table2,
    Package
} from "lucide-react";

// =====================================================
// بيانات تجريبية للإحصائيات
// =====================================================
const mockStats = {
    // الأرباح
    totalProfit: 125000,
    dailyProfit: 1450,
    monthlyProfit: 32500,
    halfYearlyProfit: 68000,
    yearlyProfit: 125000,

    // أرباح مفصلة
    tablesProfit: 95000,
    productsProfit: 30000,

    // الأعضاء والجلسات
    totalMembers: 156,
    avgDailySessions: 12,

    // ليالي الألعاب
    totalGameNights: 24,
    gameNightsParticipants: 312,
    gameNightsEntryFees: 4680,
    totalPrizes: 12000,
    profitAfterPrizes: 113000,

    // المصروفات
    totalExpenses: 45000,
    netProfit: 68000,

    // Top Members
    topSpenders: [
        { name: "أحمد محمد", amount: 3500, hours: 78 },
        { name: "سارة أحمد", amount: 2800, hours: 62 },
        { name: "محمد علي", amount: 2400, hours: 54 },
    ],
    topGamersParticipation: [
        { name: "خالد عمر", count: 18 },
        { name: "نورا سعيد", count: 15 },
        { name: "علي حسن", count: 12 },
    ],
    topGamersWinners: [
        { name: "أحمد محمد", wins: 8, prize: 2400 },
        { name: "هدى سمير", wins: 6, prize: 1800 },
        { name: "كريم أحمد", wins: 5, prize: 1500 },
    ],
};

// =====================================================
// بطاقة إحصائية
// =====================================================
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color = "brand"
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    trend?: { value: number; isUp: boolean };
    color?: "brand" | "green" | "blue" | "purple" | "red";
}) {
    const colorClasses = {
        brand: "bg-brand-gradient",
        green: "bg-green-500",
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        red: "bg-red-500",
    };

    return (
        <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {trend.isUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-bold mb-1">{value}</h3>
            <p className="text-gray-500 text-sm">{title}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
    );
}

// =====================================================
// صفحة الإحصائيات
// =====================================================
export default function StatisticsPage() {
    const [period, setPeriod] = useState<"daily" | "monthly" | "halfYearly" | "yearly">("monthly");

    // تصدير PDF (محاكاة)
    const exportToPDF = () => {
        alert("سيتم تصدير التقرير كملف PDF");
    };

    return (
        <div className="animate-fadeIn">
            {/* ===== العنوان ===== */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BarChart3 className="text-brand-start" />
                        الإحصائيات والتقارير
                    </h1>
                    <p className="text-gray-500 mt-1">نظرة شاملة على أداء المكان</p>
                </div>
                <div className="flex gap-3">
                    {/* فلتر الفترة */}
                    <select
                        className="input-glass"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as typeof period)}
                    >
                        <option value="daily">يومي</option>
                        <option value="monthly">شهري</option>
                        <option value="halfYearly">نصف سنوي</option>
                        <option value="yearly">سنوي</option>
                    </select>
                    <button onClick={exportToPDF} className="btn-gradient flex items-center gap-2">
                        <Download size={18} />
                        تصدير PDF
                    </button>
                </div>
            </div>

            {/* ===== ملخص الأرباح ===== */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">ملخص الأرباح</h2>
                <div className="dashboard-grid">
                    <StatCard
                        title="إجمالي الأرباح"
                        value={`${mockStats.totalProfit.toLocaleString()} ج.م`}
                        icon={Wallet}
                        trend={{ value: 15, isUp: true }}
                    />
                    <StatCard
                        title="أرباح اليوم"
                        value={`${mockStats.dailyProfit.toLocaleString()} ج.م`}
                        icon={TrendingUp}
                        trend={{ value: 8, isUp: true }}
                        color="green"
                    />
                    <StatCard
                        title="أرباح الشهر"
                        value={`${mockStats.monthlyProfit.toLocaleString()} ج.م`}
                        icon={Calendar}
                        color="blue"
                    />
                    <StatCard
                        title="أرباح السنة"
                        value={`${mockStats.yearlyProfit.toLocaleString()} ج.م`}
                        icon={BarChart3}
                        color="purple"
                    />
                </div>
            </section>

            {/* ===== تفصيل الأرباح ===== */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">تفصيل مصادر الأرباح</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard
                        title="أرباح تأجير الترابيزات"
                        value={`${mockStats.tablesProfit.toLocaleString()} ج.م`}
                        subtitle={`${((mockStats.tablesProfit / mockStats.totalProfit) * 100).toFixed(1)}% من الإجمالي`}
                        icon={Table2}
                    />
                    <StatCard
                        title="أرباح المنتجات"
                        value={`${mockStats.productsProfit.toLocaleString()} ج.م`}
                        subtitle={`${((mockStats.productsProfit / mockStats.totalProfit) * 100).toFixed(1)}% من الإجمالي`}
                        icon={Package}
                        color="green"
                    />
                </div>
            </section>

            {/* ===== إحصائيات عامة ===== */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">إحصائيات عامة</h2>
                <div className="dashboard-grid">
                    <StatCard
                        title="إجمالي الأعضاء"
                        value={mockStats.totalMembers}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="متوسط الجلسات اليومية"
                        value={mockStats.avgDailySessions}
                        subtitle="جلسة في اليوم"
                        icon={Clock}
                        color="purple"
                    />
                </div>
            </section>

            {/* ===== إحصائيات ليالي الألعاب ===== */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Gamepad2 />
                    إحصائيات Entertainment Hub
                </h2>
                <div className="dashboard-grid">
                    <StatCard
                        title="عدد ليالي الألعاب"
                        value={mockStats.totalGameNights}
                        icon={Gamepad2}
                        color="purple"
                    />
                    <StatCard
                        title="إجمالي المشاركين"
                        value={mockStats.gameNightsParticipants}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="رسوم الدخول"
                        value={`${mockStats.gameNightsEntryFees.toLocaleString()} ج.م`}
                        icon={Wallet}
                        color="green"
                    />
                    <StatCard
                        title="إجمالي الجوائز"
                        value={`${mockStats.totalPrizes.toLocaleString()} ج.م`}
                        subtitle="جوائز تم توزيعها"
                        icon={Trophy}
                        color="red"
                    />
                </div>
            </section>

            {/* ===== المصروفات وصافي الربح ===== */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">المصروفات وصافي الربح</h2>
                <div className="dashboard-grid">
                    <StatCard
                        title="الربح بعد خصم الجوائز"
                        value={`${mockStats.profitAfterPrizes.toLocaleString()} ج.م`}
                        icon={TrendingUp}
                        color="green"
                    />
                    <StatCard
                        title="مصروفات المكان"
                        value={`${mockStats.totalExpenses.toLocaleString()} ج.م`}
                        icon={Wallet}
                        color="red"
                    />
                    <StatCard
                        title="صافي الربح"
                        value={`${mockStats.netProfit.toLocaleString()} ج.م`}
                        subtitle="بعد خصم جميع المصروفات"
                        icon={BarChart3}
                        trend={{ value: 12, isUp: true }}
                    />
                </div>
            </section>

            {/* ===== أفضل الأعضاء ===== */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="text-yellow-500" />
                    أفضل الأعضاء
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* أكثر الأعضاء دفعاً */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Wallet size={18} className="text-brand-start" />
                            أكثر 3 أعضاء دفعاً
                        </h3>
                        <div className="space-y-3">
                            {mockStats.topSpenders.map((member, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : "bg-amber-600"
                                            }`}>
                                            {i + 1}
                                        </span>
                                        <span className="font-medium">{member.name}</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">{member.amount} ج.م</p>
                                        <p className="text-xs text-gray-500">{member.hours} ساعة</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* أكثر الأعضاء مشاركةً في الألعاب */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Gamepad2 size={18} className="text-purple-500" />
                            أكثر 3 أعضاء مشاركة
                        </h3>
                        <div className="space-y-3">
                            {mockStats.topGamersParticipation.map((member, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : "bg-amber-600"
                                            }`}>
                                            {i + 1}
                                        </span>
                                        <span className="font-medium">{member.name}</span>
                                    </div>
                                    <p className="font-bold">{member.count} مشاركة</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* أكثر الأعضاء فوزاً */}
                    <div className="glass-card p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Trophy size={18} className="text-green-500" />
                            أكثر 3 أعضاء فوزاً
                        </h3>
                        <div className="space-y-3">
                            {mockStats.topGamersWinners.map((member, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${i === 0 ? "bg-yellow-500" : i === 1 ? "bg-gray-400" : "bg-amber-600"
                                            }`}>
                                            {i + 1}
                                        </span>
                                        <span className="font-medium">{member.name}</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">{member.wins} فوز</p>
                                        <p className="text-xs text-gray-500">{member.prize} ج.م جوائز</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
