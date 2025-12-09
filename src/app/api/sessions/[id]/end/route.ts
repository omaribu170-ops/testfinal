/* =====================================================
   End Session & Payment API
   إنهاء الجلسة والدفع
===================================================== */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =====================================================
// PUT /api/sessions/[id]/end - إنهاء جلسة
// =====================================================
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const body = await request.json();

        const { payment_method, payment_details, discount } = body;

        if (!payment_method) {
            return NextResponse.json(
                { error: "برجاء تحديد طريقة الدفع" },
                { status: 400 }
            );
        }

        // جلب بيانات الجلسة
        const { data: session, error: sessionError } = await supabase
            .from("sessions")
            .select(`
        *,
        tables (price_per_hour_per_person),
        session_products (
          quantity,
          products (price)
        )
      `)
            .eq("id", id)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: "الجلسة غير موجودة" }, { status: 404 });
        }

        if (session.end_time) {
            return NextResponse.json({ error: "هذه الجلسة منتهية بالفعل" }, { status: 400 });
        }

        // حساب المدة والسعر
        const startTime = new Date(session.start_time);
        const endTime = new Date();
        const durationHours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));

        // سعر الترابيزة
        const tablePrice = durationHours * session.tables.price_per_hour_per_person * session.guest_count;

        // سعر المنتجات
        const productsPrice = session.session_products.reduce(
            (sum: number, sp: { quantity: number; products: { price: number } }) =>
                sum + (sp.quantity * sp.products.price),
            0
        );

        // الإجمالي
        let totalPrice = tablePrice + productsPrice;

        // تطبيق الخصم
        if (discount && discount > 0) {
            totalPrice = totalPrice - discount;
        }

        // تحديث الجلسة
        const { error: updateError } = await supabase
            .from("sessions")
            .update({
                end_time: endTime.toISOString(),
                total_price: totalPrice,
                payment_method,
                payment_details,
                discount: discount || 0,
                is_paid: true,
            })
            .eq("id", id);

        if (updateError) {
            console.error("Session update error:", updateError);
            return NextResponse.json({ error: "خطأ في تحديث الجلسة" }, { status: 500 });
        }

        return NextResponse.json({
            message: "تم إنهاء الجلسة بنجاح",
            bill: {
                duration_hours: durationHours,
                table_price: tablePrice,
                products_price: productsPrice,
                discount: discount || 0,
                total_price: totalPrice,
                payment_method,
            },
        });
    } catch (error) {
        console.error("End session error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}
