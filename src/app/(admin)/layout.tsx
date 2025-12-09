/* =====================================================
   Admin Layout
   الـ Layout الرئيسي للوحة التحكم
===================================================== */

import AdminSidebar from "@/components/admin/Sidebar";

// =====================================================
// Admin Layout Component
// =====================================================
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {/* ===== الشريط الجانبي ===== */}
            <AdminSidebar />

            {/* ===== المحتوى الرئيسي ===== */}
            <main className="mr-[280px] min-h-screen p-6 max-md:mr-0 max-md:pb-24">
                {children}
            </main>
        </div>
    );
}
