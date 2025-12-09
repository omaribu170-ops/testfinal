/* =====================================================
   صفحة التسجيل - Registration Page
===================================================== */

"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Phone, Mail, ArrowLeft, Loader2, Users } from "lucide-react";

export default function RegisterPage() {
    const [step, setStep] = useState<"info" | "otp">("info");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "male",
        referralCode: "",
    });

    const [otp, setOtp] = useState("");

    // تحديث البيانات
    const updateForm = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // إرسال بيانات التسجيل
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // التحقق من البيانات
        if (!formData.name || !formData.phone || !formData.email) {
            setError("برجاء ملء جميع الحقول المطلوبة");
            return;
        }

        if (formData.phone.length !== 11) {
            setError("برجاء إدخال رقم هاتف صحيح");
            return;
        }

        if (!formData.email.includes("@")) {
            setError("برجاء إدخال بريد إلكتروني صحيح");
            return;
        }

        setIsLoading(true);

        // محاكاة إرسال OTP
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setStep("otp");
    };

    // التحقق من OTP وإكمال التسجيل
    const verifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            setError("برجاء إدخال كود التحقق المكون من 6 أرقام");
            return;
        }

        setIsLoading(true);

        // محاكاة التسجيل
        await new Promise(resolve => setTimeout(resolve, 1500));

        // في الواقع سيتم التسجيل في Supabase والتوجيه
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            {/* الشعار */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold gradient-text mb-2">The Hub</h1>
                <p className="text-gray-500">انضم لمجتمعنا!</p>
            </div>

            {/* بطاقة التسجيل */}
            <div className="glass-card p-8 w-full max-w-md">
                {step === "info" ? (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-center">إنشاء حساب</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* الاسم */}
                            <div>
                                <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                                <div className="relative">
                                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        className="input-glass pr-12"
                                        placeholder="أحمد محمد"
                                        value={formData.name}
                                        onChange={(e) => updateForm("name", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* البريد الإلكتروني */}
                            <div>
                                <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                                <div className="relative">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        className="input-glass pr-12"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={(e) => updateForm("email", e.target.value)}
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {/* رقم الهاتف */}
                            <div>
                                <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
                                <div className="relative">
                                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        className="input-glass pr-12"
                                        placeholder="01xxxxxxxxx"
                                        value={formData.phone}
                                        onChange={(e) => updateForm("phone", e.target.value)}
                                        maxLength={11}
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {/* النوع */}
                            <div>
                                <label className="block text-sm font-medium mb-2">النوع</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => updateForm("gender", "male")}
                                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${formData.gender === "male"
                                                ? "border-brand-start bg-brand-start/10"
                                                : "border-gray-200"
                                            }`}
                                    >
                                        ذكر
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateForm("gender", "female")}
                                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${formData.gender === "female"
                                                ? "border-brand-start bg-brand-start/10"
                                                : "border-gray-200"
                                            }`}
                                    >
                                        أنثى
                                    </button>
                                </div>
                            </div>

                            {/* كود الدعوة */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <span className="flex items-center gap-2">
                                        <Users size={16} />
                                        كود الدعوة (اختياري)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input-glass font-mono uppercase"
                                    placeholder="XXXX2024"
                                    value={formData.referralCode}
                                    onChange={(e) => updateForm("referralCode", e.target.value.toUpperCase())}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    إذا كان لديك كود دعوة من صديق
                                </p>
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
                                    "متابعة"
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            لديك حساب بالفعل؟{" "}
                            <Link href="/login" className="text-brand-start hover:underline">
                                سجّل دخول
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setStep("info")}
                            className="flex items-center gap-2 text-gray-500 mb-6"
                        >
                            <ArrowLeft size={20} />
                            تعديل البيانات
                        </button>

                        <h2 className="text-2xl font-bold mb-2 text-center">كود التحقق</h2>
                        <p className="text-gray-500 text-center mb-6">
                            تم إرسال كود إلى {formData.phone}
                        </p>

                        <form onSubmit={verifyAndRegister} className="space-y-4">
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
                                        جاري إنشاء الحساب...
                                    </>
                                ) : (
                                    "إنشاء الحساب"
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
        </div>
    );
}
