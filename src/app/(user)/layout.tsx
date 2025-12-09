/* =====================================================
   User Layout - الـ Layout الرئيسي للمستخدم
   مع Navbar سفلي
===================================================== */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, Plus, ShoppingBag, User } from "lucide-react";

// =====================================================
// Navbar Items
// =====================================================
const navItems = [
    { href: "/", icon: Home, label: "الرئيسية" },
    { href: "/tools", icon: Wrench, label: "الأدوات" },
    { href: "/booking", icon: Plus, label: "احجز", isMain: true },
    { href: "/store", icon: ShoppingBag, label: "المتجر" },
    { href: "/profile", icon: User, label: "حسابي" },
];

// =====================================================
// User Layout Component
// =====================================================
export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // إخفاء الـ Navbar في صفحات الأدوات
    const hideNavbar = pathname.startsWith("/tools/");

    return (
        <div className="min-h-screen pb-20">
            {/* ===== المحتوى ===== */}
            <main className="max-w-lg mx-auto px-4 py-6">
                {children}
            </main>

            {/* ===== Navbar السفلي ===== */}
            {!hideNavbar && (
                <nav className="fixed bottom-0 right-0 left-0 glass border-t border-white/20 z-50">
                    <div className="max-w-lg mx-auto flex justify-around items-center py-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${item.isMain
                                            ? "bg-brand-gradient text-white px-6 py-3 -mt-6 rounded-full shadow-lg"
                                            : isActive
                                                ? "text-brand-start"
                                                : "text-gray-500"
                                        }`}
                                >
                                    <Icon size={item.isMain ? 28 : 24} />
                                    {!item.isMain && (
                                        <span className="text-xs">{item.label}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
