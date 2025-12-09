/* =====================================================
   صفحة تسجيل الدخول - Login Page
===================================================== */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // إرسال OTP
    const sendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!phone || phone.length < 11) {
            setError("برجاء إدخال رقم هاتف صحيح");
            return;
        }

        setIsLoading(true);

        // محاكاة إرسال OTP
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setStep("otp");
    };

    // التحقق من OTP
    const verifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            setError("برجاء إدخال كود التحقق المكون من 6 أرقام");
            return;
        }

        setIsLoading(true);

        // محاكاة التحقق
        await new Promise(resolve => setTimeout(resolve, 1500));

        // في الواقع سيتم التحقق من Supabase والتوجيه
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            {/* الشعار */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold gradient-text mb-2">The Hub</h1>
                <p className="text-gray-500">مرحباً بك في مجتمعنا!</p>
            </div>

            {/* بطاقة تسجيل الدخول */}
            <div className="glass-card p-8 w-full max-w-md">
                {step === "phone" ? (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h2>

                        <form onSubmit={sendOTP} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                                <div className="relative">
                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        className="input-glass pr-12"
                                        placeholder="01xxxxxxxxx"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        maxLength={11}
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-gradient w-full flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        جاري الإرسال...
                                    </>
                                ) : (
                                    "إرسال كود التحقق"
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            ليس لديك حساب؟{" "}
                            <Link href="/register" className="text-brand-start hover:underline">
                                سجّل الآن
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setStep("phone")}
                            className="flex items-center gap-2 text-gray-500 mb-6"
                        >
                            <ArrowLeft size={20} />
                            تغيير الرقم
                        </button>

                        <h2 className="text-2xl font-bold mb-2 text-center">كود التحقق</h2>
                        <p className="text-gray-500 text-center mb-6">
                            تم إرسال كود إلى {phone}
                        </p>

                        <form onSubmit={verifyOTP} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    className="input-glass text-center text-2xl tracking-widest font-mono"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    maxLength={6}
                                    dir="ltr"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-gradient w-full flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        جاري التحقق...
                                    </>
                                ) : (
                                    "تأكيد"
                                )}
                            </button>

                            <button
                                type="button"
                                className="w-full text-center text-sm text-gray-500 hover:text-brand-start"
                            >
                                إعادة إرسال الكود
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* رابط الأدمن */}
            <Link
                href="/admin"
                className="mt-8 text-sm text-gray-400 hover:text-gray-600"
            >
                دخول الإدارة
            </Link>
        </div>
    );
}
