/* =====================================================
   Admin Dashboard - الصفحة الرئيسية
   ملخص سريع للإحصائيات والجلسات النشطة
===================================================== */

import { Clock, Users, Table2, Wallet, TrendingUp, Gamepad2 } from "lucide-react";

// =====================================================
// بطاقة إحصائية
// =====================================================
function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    trend?: { value: number; isUp: boolean };
}) {
    return (
        <div className="stat-card">
            {/* أيقونة ونسبة التغير */}
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center">
                    <Icon className="text-white" size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
                        <TrendingUp size={16} className={!trend.isUp ? 'rotate-180' : ''} />
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>

            {/* القيمة والعنوان */}
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            <p className="text-gray-500 text-sm">{title}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
    );
}

// =====================================================
// الصفحة الرئيسية
// =====================================================
export default function AdminDashboard() {
    return (
        <div className="animate-fadeIn">
            {/* ===== العنوان ===== */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">مرحباً بك 👋</h1>
                <p className="text-gray-500 mt-1">إليك ملخص أداء اليوم</p>
            </div>

            {/* ===== بطاقات الإحصائيات ===== */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">إحصائيات اليوم</h2>
                <div className="dashboard-grid">
                    <StatCard
                        title="الجلسات النشطة"
                        value="5"
                        subtitle="3 ترابيزات متاحة"
                        icon={Clock}
                        trend={{ value: 12, isUp: true }}
                    />
                    <StatCard
                        title="الأعضاء اليوم"
                        value="23"
                        subtitle="15 عضو جديد هذا الأسبوع"
                        icon={Users}
                        trend={{ value: 8, isUp: true }}
                    />
                    <StatCard
                        title="الترابيزات المشغولة"
                        value="5/8"
                        subtitle="62.5% نسبة الإشغال"
                        icon={Table2}
                    />
                    <StatCard
                        title="إيرادات اليوم"
                        value="1,250 ج.م"
                        subtitle="850 ج.م من الترابيزات"
                        icon={Wallet}
                        trend={{ value: 15, isUp: true }}
                    />
                </div>
            </section>

            {/* ===== الجلسات النشطة ===== */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">الجلسات النشطة</h2>
                    <a href="/admin/sessions" className="text-sm text-blue-500 hover:underline">
                        عرض الكل
                    </a>
                </div>

                {/* قائمة الجلسات */}
                <div className="glass-card p-4">
                    <div className="space-y-4">
                        {/* جلسة نموذجية */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold">
                                        #{i}
                                    </div>
                                    <div>
                                        <p className="font-semibold">ترابيزة VIP {i}</p>
                                        <p className="text-sm text-gray-500">4 أشخاص</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="timer-display timer-small">01:23:45</p>
                                    <p className="text-sm text-gray-500">بدأ 10:30 ص</p>
                                </div>
                                <button className="btn-glass text-red-500 hover:bg-red-50">
                                    إنهاء الجلسة
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== الإجراءات السريعة ===== */}
            <section>
                <h2 className="text-xl font-semibold mb-4">إجراءات سريعة</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="/admin/sessions/new" className="glass-card p-4 text-center hover:scale-105 transition-transform">
                        <Clock className="mx-auto mb-2 text-brand-start" size={32} />
                        <p className="font-semibold">بدء جلسة جديدة</p>
                    </a>
                    <a href="/admin/members/new" className="glass-card p-4 text-center hover:scale-105 transition-transform">
                        <Users className="mx-auto mb-2 text-brand-middle" size={32} />
                        <p className="font-semibold">إضافة عضو</p>
                    </a>
                    <a href="/admin/tables" className="glass-card p-4 text-center hover:scale-105 transition-transform">
                        <Table2 className="mx-auto mb-2 text-brand-end" size={32} />
                        <p className="font-semibold">إدارة الترابيزات</p>
                    </a>
                    <a href="/admin/entertainment" className="glass-card p-4 text-center hover:scale-105 transition-transform">
                        <Gamepad2 className="mx-auto mb-2 text-purple-500" size={32} />
                        <p className="font-semibold">ليلة ألعاب جديدة</p>
                    </a>
                </div>
            </section>
        </div>
    );
}
