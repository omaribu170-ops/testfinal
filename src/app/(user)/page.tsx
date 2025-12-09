/* =====================================================
   الصفحة الرئيسية للمستخدم - User Home Page
===================================================== */

import Link from "next/link";
import { Clock, Brain, FileText, ChevronLeft, Bell } from "lucide-react";

// =====================================================
// الأدوات المتاحة
// =====================================================
const tools = [
    { href: "/tools/pomodoro", icon: Clock, label: "Pomodoro Timer", color: "bg-red-500" },
    { href: "/tools/ai", icon: Brain, label: "صميده AI", color: "bg-purple-500" },
    { href: "/tools/notes", icon: FileText, label: "الملاحظات", color: "bg-blue-500" },
];

// =====================================================
// بانرات تجريبية
// =====================================================
const banners = [
    { id: 1, title: "عرض خاص!", description: "ساعتين بسعر ساعة كل يوم أحد", bgColor: "from-brand-start to-brand-end" },
    { id: 2, title: "ليلة ألعاب قريباً", description: "انضم لبطولة UNO يوم الخميس", bgColor: "from-purple-500 to-pink-500" },
];

// =====================================================
// الصفحة الرئيسية
// =====================================================
export default function HomePage() {
    // الاسم الأول (للعرض)
    const firstName = "أحمد";

    return (
        <div className="animate-fadeIn">
            {/* ===== الهيدر ===== */}
            <header className="flex items-center justify-between mb-6">
                {/* الشعار */}
                <div>
                    <h1 className="text-2xl font-bold gradient-text">The Hub</h1>
                </div>

                {/* الإشعارات والبروفيل */}
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full glass hover:scale-105 transition-transform relative">
                        <Bell size={22} />
                        <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold">
                        {firstName.charAt(0)}
                    </Link>
                </div>
            </header>

            {/* ===== الترحيب ===== */}
            <section className="mb-6">
                <h2 className="text-xl">
                    أهلاً يا <span className="font-bold">{firstName}</span> 👋
                </h2>
                <p className="text-gray-500 text-sm">نتمنى لك يوم مثمر!</p>
            </section>

            {/* ===== بانرات العروض ===== */}
            <section className="mb-8">
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className={`flex-shrink-0 w-72 h-32 rounded-2xl bg-gradient-to-r ${banner.bgColor} p-6 text-white snap-center`}
                        >
                            <h3 className="text-lg font-bold mb-1">{banner.title}</h3>
                            <p className="text-sm opacity-90">{banner.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== الأدوات ===== */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">استخدم أدواتنا</h3>
                    <Link href="/tools" className="text-sm text-gray-500 flex items-center gap-1">
                        الكل <ChevronLeft size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className="glass-card p-4 text-center hover:scale-105 transition-transform"
                            >
                                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                                <p className="text-sm font-medium">{tool.label}</p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* ===== أخبار وعروض ===== */}
            <section>
                <h3 className="text-lg font-semibold mb-4">أخبار وعروض</h3>
                <div className="space-y-3">
                    <div className="glass-card p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center text-white text-2xl">
                            🎮
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold">بطولة UNO القادمة</h4>
                            <p className="text-sm text-gray-500">الخميس 14 ديسمبر - الجوائز 1500 ج.م</p>
                        </div>
                        <ChevronLeft className="text-gray-400" />
                    </div>
                    <div className="glass-card p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl">
                            ☕
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold">قهوة مجانية</h4>
                            <p className="text-sm text-gray-500">مع كل جلسة 3 ساعات أو أكثر</p>
                        </div>
                        <ChevronLeft className="text-gray-400" />
                    </div>
                </div>
            </section>
        </div>
    );
}
