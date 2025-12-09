/* =====================================================
   Sessions API Routes
   إدارة الجلسات
===================================================== */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =====================================================
// GET /api/sessions - جلب الجلسات النشطة
// =====================================================
export async function GET() {
    try {
        const supabase = await createClient();

        const { data: sessions, error } = await supabase
            .from("sessions")
            .select(`
        *,
        tables (name, table_number),
        session_members (
          users (id, name, phone)
        )
      `)
            .is("end_time", null)
            .order("start_time", { ascending: false });

        if (error) {
            console.error("Sessions fetch error:", error);
            return NextResponse.json({ error: "خطأ في جلب الجلسات" }, { status: 500 });
        }

        return NextResponse.json({ sessions });
    } catch (error) {
        console.error("Sessions API Error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}

// =====================================================
// POST /api/sessions - بدء جلسة جديدة
// =====================================================
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const { table_id, member_ids, products } = body;

        if (!table_id || !member_ids || member_ids.length === 0) {
            return NextResponse.json(
                { error: "برجاء تحديد الترابيزة والأعضاء" },
                { status: 400 }
            );
        }

        // التحقق من أن الترابيزة غير مشغولة
        const { data: activeSession } = await supabase
            .from("sessions")
            .select("id")
            .eq("table_id", table_id)
            .is("end_time", null)
            .single();

        if (activeSession) {
            return NextResponse.json(
                { error: "هذه الترابيزة مشغولة حالياً" },
                { status: 400 }
            );
        }

        // إنشاء الجلسة
        const { data: session, error: sessionError } = await supabase
            .from("sessions")
            .insert({
                table_id,
                guest_count: member_ids.length,
                start_time: new Date().toISOString(),
            })
            .select()
            .single();

        if (sessionError) {
            console.error("Session creation error:", sessionError);
            return NextResponse.json({ error: "خطأ في إنشاء الجلسة" }, { status: 500 });
        }

        // إضافة الأعضاء للجلسة
        const sessionMembers = member_ids.map((userId: string) => ({
            session_id: session.id,
            user_id: userId,
        }));

        await supabase.from("session_members").insert(sessionMembers);

        // إضافة المنتجات إذا وجدت
        if (products && products.length > 0) {
            const sessionProducts = products.map((p: { product_id: string; quantity: number }) => ({
                session_id: session.id,
                product_id: p.product_id,
                quantity: p.quantity,
            }));

            await supabase.from("session_products").insert(sessionProducts);
        }

        return NextResponse.json({ session, message: "تم بدء الجلسة بنجاح" });
    } catch (error) {
        console.error("Session creation error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}
