/* =====================================================
   صفحة التسجيل - Register Page
   مربوط بـ Supabase Auth
===================================================== */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, Lock, User, Mail, Loader2, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        referralCode: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // التحقق من كلمة المرور
        if (formData.password !== formData.confirmPassword) {
            setError("كلمة المرور غير متطابقة");
            return;
        }

        if (formData.password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();

            // التحقق من عدم وجود الهاتف مسبقاً
            const { data: existingUser } = await supabase
                .from("users")
                .select("id")
                .eq("phone", formData.phone)
                .single();

            if (existingUser) {
                setError("رقم الهاتف مسجل مسبقاً");
                return;
            }

            // إنشاء حساب في Supabase Auth
            const authEmail = `${formData.phone}@thehub.local`;

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: authEmail,
                password: formData.password
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            // إنشاء سجل في جدول users
            if (authData.user) {
                const code = "MBR" + Date.now().toString().slice(-6);

                const { error: profileError } = await supabase
                    .from("users")
                    .insert({
                        auth_id: authData.user.id,
                        name: formData.name,
                        phone: formData.phone,
                        email: formData.email || null,
                        code: code,
                        role: "member",
                        wallet_balance: 0,
                        total_hours: 0,
                        total_spent: 0,
                        game_nights_attended: 0,
                        game_nights_won: 0,
                        referred_by: formData.referralCode || null
                    });

                if (profileError) {
                    setError(profileError.message);
                    return;
                }

                // تحديث إحصائيات المسوق إذا وجد كود إحالة
                if (formData.referralCode) {
                    await supabase.rpc("increment_affiliate_referral", {
                        affiliate_code: formData.referralCode
                    });
                }
            }

            // نجاح!
            alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول");
            router.push("/login");

        } catch (err) {
            console.error(err);
            setError("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* الشعار */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏠</span>
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">إنشاء حساب جديد</h1>
                    <p className="text-gray-500 mt-1">انضم لعائلة The Hub</p>
                </div>

                {/* نموذج التسجيل */}
                <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                        <div className="relative">
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                className="input-glass pr-12"
                                placeholder="محمد أحمد"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
                        <div className="relative">
                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="tel"
                                className="input-glass pr-12"
                                placeholder="01xxxxxxxxx"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني (اختياري)</label>
                        <div className="relative">
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                className="input-glass pr-12"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">كلمة المرور *</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="input-glass pr-12"
                                placeholder="6 أحرف على الأقل"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور *</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="input-glass pr-12"
                                placeholder="أعد كتابة كلمة المرور"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">كود الإحالة (اختياري)</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="HUB123ABC"
                            value={formData.referralCode}
                            onChange={e => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                            dir="ltr"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-gradient w-full flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <UserPlus size={20} />
                                إنشاء الحساب
                            </>
                        )}
                    </button>
                </form>

                {/* رابط تسجيل الدخول */}
                <div className="text-center mt-6">
                    <p className="text-gray-500">
                        لديك حساب بالفعل؟{" "}
                        <Link href="/login" className="text-brand-start font-medium">
                            تسجيل الدخول
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
