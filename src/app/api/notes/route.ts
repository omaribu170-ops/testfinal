/* =====================================================
   Notes API Routes
   إدارة الملاحظات
===================================================== */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =====================================================
// GET /api/notes - جلب ملاحظات المستخدم
// =====================================================
export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
        }

        const { data: notes, error } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", user.id)
            .order("is_pinned", { ascending: false })
            .order("updated_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: "خطأ في جلب الملاحظات" }, { status: 500 });
        }

        return NextResponse.json({ notes });
    } catch (error) {
        console.error("Notes API Error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}

// =====================================================
// POST /api/notes - إنشاء ملاحظة جديدة
// =====================================================
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
        }

        const { title, content, color } = body;

        const { data: note, error } = await supabase
            .from("notes")
            .insert({
                user_id: user.id,
                title: title || "ملاحظة جديدة",
                content: content || "",
                color: color || "#ffffff",
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: "خطأ في إنشاء الملاحظة" }, { status: 500 });
        }

        return NextResponse.json({ note });
    } catch (error) {
        console.error("Note creation error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}

// =====================================================
// PUT /api/notes - تحديث ملاحظة
// =====================================================
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
        }

        const { id, title, content, color, is_pinned } = body;

        if (!id) {
            return NextResponse.json({ error: "معرف الملاحظة مطلوب" }, { status: 400 });
        }

        const { data: note, error } = await supabase
            .from("notes")
            .update({
                title,
                content,
                color,
                is_pinned,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: "خطأ في تحديث الملاحظة" }, { status: 500 });
        }

        return NextResponse.json({ note });
    } catch (error) {
        console.error("Note update error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}

// =====================================================
// DELETE /api/notes - حذف ملاحظة
// =====================================================
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
        }

        if (!id) {
            return NextResponse.json({ error: "معرف الملاحظة مطلوب" }, { status: 400 });
        }

        const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            return NextResponse.json({ error: "خطأ في حذف الملاحظة" }, { status: 500 });
        }

        return NextResponse.json({ message: "تم حذف الملاحظة" });
    } catch (error) {
        console.error("Note delete error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}
