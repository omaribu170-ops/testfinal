/* =====================================================
   Admin Sidebar Component
   الشريط الجانبي للوحة التحكم
===================================================== */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Table2,
    Users,
    Clock,
    BarChart3,
    Sparkles,
    Package,
    Wallet,
    UserCog,
    ClipboardList,
    Boxes,
    Gamepad2,
    Share2,
    LogOut
} from "lucide-react";

// =====================================================
// قائمة الروابط في الـ Sidebar
// =====================================================
const sidebarLinks = [
    {
        title: "لوحة التحكم",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "الترابيزات",
        href: "/admin/tables",
        icon: Table2,
    },
    {
        title: "الأعضاء",
        href: "/admin/members",
        icon: Users,
    },
    {
        title: "الجلسات",
        href: "/admin/sessions",
        icon: Clock,
    },
    {
        title: "الإحصائيات",
        href: "/admin/statistics",
        icon: BarChart3,
    },
    {
        title: "النظافة",
        href: "/admin/cleaning",
        icon: Sparkles,
    },
    {
        title: "طلبات المكان",
        href: "/admin/requests",
        icon: Package,
    },
    {
        title: "المصروفات",
        href: "/admin/expenses",
        icon: Wallet,
    },
    {
        title: "الموظفين",
        href: "/admin/employees",
        icon: UserCog,
        superAdminOnly: true,
    },
    {
        title: "المهام",
        href: "/admin/tasks",
        icon: ClipboardList,
    },
    {
        title: "المخزن",
        href: "/admin/inventory",
        icon: Boxes,
    },
    {
        title: "Entertainment Hub",
        href: "/admin/entertainment",
        icon: Gamepad2,
    },
    {
        title: "المسوقين",
        href: "/admin/affiliates",
        icon: Share2,
    },
];

// =====================================================
// Sidebar Component
// =====================================================
export default function AdminSidebar() {
    // الحصول على المسار الحالي
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            {/* ===== الشعار ===== */}
            <div className="mb-8">
                <Link href="/admin" className="flex items-center gap-3">
                    {/* لوجو مؤقت - نص متدرج */}
                    <span className="text-2xl font-bold gradient-text">The Hub</span>
                </Link>
                <p className="text-sm text-gray-500 mt-1">لوحة التحكم</p>
            </div>

            {/* ===== قائمة الروابط ===== */}
            <nav className="flex-1 space-y-1">
                {sidebarLinks.map((link) => {
                    // التحقق من الصفحة النشطة
                    const isActive = pathname === link.href ||
                        (link.href !== "/admin" && pathname.startsWith(link.href));

                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`sidebar-link ${isActive ? "active" : ""}`}
                        >
                            <Icon size={20} />
                            <span>{link.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* ===== زر تسجيل الخروج ===== */}
            <div className="pt-4 border-t border-gray-200/50 mt-4">
                <button className="sidebar-link w-full text-red-500 hover:bg-red-50">
                    <LogOut size={20} />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
}
