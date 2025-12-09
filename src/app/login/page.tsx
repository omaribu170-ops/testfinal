/* =====================================================
   صفحة تسجيل الدخول - Login Page
   يستخدم جدول users مباشرة (بدون Supabase Auth)
===================================================== */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Phone, Lock, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UserData {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    password_hash: string | null;
    role: string;
    wallet_balance: number;
}

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const supabase = createClient();

            // البحث عن المستخدم برقم الهاتف
            const { data, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("phone", phone)
                .single();

            const user = data as UserData | null;

            if (userError || !user) {
                setError("رقم الهاتف غير مسجل");
                return;
            }

            // التحقق من كلمة المرور (مقارنة بسيطة)
            // في الإنتاج يجب استخدام bcrypt أو مشابه
            if (user.password_hash !== password) {
                setError("كلمة المرور غير صحيحة");
                return;
            }

            // حفظ بيانات المستخدم في localStorage
            localStorage.setItem("user", JSON.stringify({
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                wallet_balance: user.wallet_balance
            }));

            // التوجيه حسب الدور
            if (user.role === "super_admin" || user.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }

        } catch (err) {
            console.error(err);
            setError("حدث خطأ في الاتصال بقاعدة البيانات");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* الشعار */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🏠</span>
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">The Hub</h1>
                    <p className="text-gray-500 mt-2">مرحباً بعودتك!</p>
                </div>

                {/* نموذج تسجيل الدخول */}
                <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                        <div className="relative">
                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="tel"
                                className="input-glass pr-12"
                                placeholder="01xxxxxxxxx"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">كلمة المرور</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="input-glass pr-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
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
                                <ArrowLeft size={20} />
                                تسجيل الدخول
                            </>
                        )}
                    </button>
                </form>

                {/* روابط */}
                <div className="text-center mt-6 space-y-2">
                    <p className="text-gray-500">
                        ليس لديك حساب؟{" "}
                        <Link href="/register" className="text-brand-start font-medium">
                            سجل الآن
                        </Link>
                    </p>
                </div>

                {/* زر الـ Admin للتجريب */}
                <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
                    <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">
                        دخول كـ Admin (للتجريب)
                    </Link>
                </div>

                {/* بيانات تجريبية */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-center">
                    <p className="font-medium text-blue-700 mb-2">بيانات تجريبية:</p>
                    <p className="text-blue-600">هاتف: 01000000000</p>
                    <p className="text-blue-600">كلمة المرور: admin123</p>
                </div>
            </div>
        </div>
    );
}
