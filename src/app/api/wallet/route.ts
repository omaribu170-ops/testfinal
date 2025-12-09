/* =====================================================
   Wallet API Routes
   إدارة المحفظة والرصيد
===================================================== */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// =====================================================
// GET /api/wallet - جلب رصيد المحفظة
// =====================================================
export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "غير مسموح" }, { status: 401 });
        }

        // جلب بيانات المستخدم
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("wallet_balance")
            .eq("id", user.id)
            .single();

        if (userError) {
            return NextResponse.json({ error: "خطأ في جلب البيانات" }, { status: 500 });
        }

        // جلب آخر المعاملات
        const { data: transactions } = await supabase
            .from("wallet_transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

        return NextResponse.json({
            balance: userData?.wallet_balance || 0,
            transactions: transactions || [],
        });
    } catch (error) {
        console.error("Wallet API Error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}

// =====================================================
// POST /api/wallet/add - إضافة رصيد (للأدمن أو Paymob)
// =====================================================
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        const { user_id, amount, transaction_type, description } = body;

        if (!user_id || !amount || amount <= 0) {
            return NextResponse.json(
                { error: "بيانات غير صحيحة" },
                { status: 400 }
            );
        }

        // إضافة المعاملة
        const { data: transaction, error: txError } = await supabase
            .from("wallet_transactions")
            .insert({
                user_id,
                amount,
                transaction_type: transaction_type || "deposit",
                description: description || "إضافة رصيد",
            })
            .select()
            .single();

        if (txError) {
            console.error("Transaction error:", txError);
            return NextResponse.json({ error: "خطأ في إضافة المعاملة" }, { status: 500 });
        }

        // تحديث رصيد المستخدم
        const { error: updateError } = await supabase.rpc("add_wallet_balance", {
            p_user_id: user_id,
            p_amount: amount,
        });

        // إذا لم توجد الـ RPC function، نستخدم طريقة بديلة
        if (updateError) {
            const { data: currentUser } = await supabase
                .from("users")
                .select("wallet_balance")
                .eq("id", user_id)
                .single();

            const newBalance = (currentUser?.wallet_balance || 0) + amount;

            await supabase
                .from("users")
                .update({ wallet_balance: newBalance })
                .eq("id", user_id);
        }

        return NextResponse.json({
            message: "تم إضافة الرصيد بنجاح",
            transaction,
        });
    } catch (error) {
        console.error("Wallet add error:", error);
        return NextResponse.json({ error: "خطأ غير متوقع" }, { status: 500 });
    }
}
