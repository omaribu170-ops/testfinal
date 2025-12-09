/* =====================================================
   Statistics API Route
   إحصائيات الـ Admin Dashboard
===================================================== */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =====================================================
// GET /api/admin/statistics - جلب الإحصائيات
// =====================================================
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const period = searchParams.get("period") || "monthly";

        // تحديد الفترة الزمنية
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case "daily":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case "monthly":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "halfYearly":
                startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                break;
            case "yearly":
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // جلب إجمالي الأرباح من الجلسات
        const { data: sessions } = await supabase
            .from("sessions")
            .select("total_price, start_time")
            .eq("is_paid", true)
            .gte("start_time", startDate.toISOString());

        const totalRevenue = (sessions as { total_price: number | null }[] | null)?.reduce(
            (sum, s) => sum + (s.total_price || 0), 0
        ) || 0;

        // جلب عدد الأعضاء
        const { count: totalMembers } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("role", "member");

        // جلب عدد الجلسات النشطة
        const { count: activeSessions } = await supabase
            .from("sessions")
            .select("*", { count: "exact", head: true })
            .is("end_time", null);

        // جلب إحصائيات ليالي الألعاب
        const { data: gameNights } = await supabase
            .from("game_nights")
            .select("*")
            .gte("event_date", startDate.toISOString().split("T")[0]);

        const totalGameNights = gameNights?.length || 0;
        // تبسيط - الجوائز ستحسب لاحقاً عند ربط البيانات الحقيقية
        const totalPrizes = 0;

        // جلب المصروفات
        const { data: expenses } = await supabase
            .from("expenses")
            .select("amount")
            .gte("expense_date", startDate.toISOString().split("T")[0]);

        const totalExpenses = (expenses as { amount: number | null }[] | null)?.reduce(
            (sum, e) => sum + (e.amount || 0), 0
        ) || 0;

        // جلب أفضل الأعضاء (الأكثر دفعاً)
        const { data: topSpenders } = await supabase
            .from("users")
            .select("id, name, total_spent")
            .eq("role", "member")
            .order("total_spent", { ascending: false })
            .limit(3);

        return NextResponse.json({
            period,
            revenue: {
                total: totalRevenue,
                afterExpenses: totalRevenue - totalExpenses,
            },
            members: {
                total: totalMembers || 0,
            },
            sessions: {
                active: activeSessions || 0,
            },
            gameNights: {
                total: totalGameNights,
                totalPrizes,
            },
            expenses: {
                total: totalExpenses,
            },
            topMembers: {
                spenders: topSpenders || [],
            },
        });
    } catch (error) {
        console.error("Statistics API Error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}
