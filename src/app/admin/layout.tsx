/* =====================================================
   Admin Layout - الـ Layout الخاص بلوحة التحكم
===================================================== */

import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* ===== الشريط الجانبي ===== */}
            <AdminSidebar />

            {/* ===== المحتوى الرئيسي ===== */}
            <main className="flex-1 mr-0 md:mr-[280px] p-6 bg-[var(--background)]">
                {children}
            </main>
        </div>
    );
}
