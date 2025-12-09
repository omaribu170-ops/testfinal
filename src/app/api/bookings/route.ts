/* =====================================================
   Bookings API Routes
   إدارة الحجوزات المسبقة
===================================================== */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =====================================================
// GET /api/bookings - جلب حجوزات المستخدم
// =====================================================
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // جلب المستخدم الحالي
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
        }

        const { data: bookings, error } = await supabase
            .from("bookings")
            .select(`
        *,
        tables (name, table_number, price_per_hour_per_person)
      `)
            .eq("user_id", user.id)
            .order("booking_date", { ascending: false });

        if (error) {
            console.error("Bookings fetch error:", error);
            return NextResponse.json({ error: "خطأ في جلب الحجوزات" }, { status: 500 });
        }

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error("Bookings API Error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}

// =====================================================
// POST /api/bookings - إنشاء حجز جديد
// =====================================================
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const { table_id, booking_date, start_time, duration_hours, guests } = body;

        // التحقق من البيانات
        if (!table_id || !booking_date || !start_time || !duration_hours || !guests) {
            return NextResponse.json(
                { error: "برجاء ملء جميع البيانات المطلوبة" },
                { status: 400 }
            );
        }

        // جلب المستخدم الحالي
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
        }

        // التحقق من عدم وجود تعارض
        const bookingStart = new Date(`${booking_date}T${start_time}`);
        const bookingEnd = new Date(bookingStart.getTime() + duration_hours * 60 * 60 * 1000);

        const { data: conflicts } = await supabase
            .from("bookings")
            .select("id")
            .eq("table_id", table_id)
            .eq("booking_date", booking_date)
            .eq("status", "confirmed");

        // (في الواقع يجب التحقق من تداخل الأوقات بشكل أدق)

        if (conflicts && conflicts.length > 0) {
            return NextResponse.json(
                { error: "هذا الموعد محجوز بالفعل" },
                { status: 400 }
            );
        }

        // جلب سعر الترابيزة
        const { data: table } = await supabase
            .from("tables")
            .select("price_per_hour_per_person")
            .eq("id", table_id)
            .single();

        const estimatedPrice = table
            ? table.price_per_hour_per_person * duration_hours * guests
            : 0;

        // إنشاء الحجز
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .insert({
                user_id: user.id,
                table_id,
                booking_date,
                start_time,
                duration_hours,
                guests,
                estimated_price: estimatedPrice,
                status: "pending",
            })
            .select()
            .single();

        if (bookingError) {
            console.error("Booking creation error:", bookingError);
            return NextResponse.json({ error: "خطأ في إنشاء الحجز" }, { status: 500 });
        }

        return NextResponse.json({
            booking,
            message: "تم إنشاء الحجز بنجاح! سيتم التأكيد قريباً",
        });
    } catch (error) {
        console.error("Booking creation error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}
