/* =====================================================
   صفحة البروفيل - User Profile Page
===================================================== */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Wallet, Share2, Clock, Gamepad2, Trophy, ChevronLeft, Plus } from "lucide-react";

// بيانات تجريبية
const mockUser = {
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "01012345678",
    wallet_balance: 250,
    affiliate_code: "AHMED2024",
    affiliate_earnings: 1850,
    total_hours: 45,
    total_spent: 1350,
    game_nights_attended: 5,
    game_nights_won: 2,
};

export default function ProfilePage() {
    const [showAddBalance, setShowAddBalance] = useState(false);

    return (
        <div className="animate-fadeIn">
            {/* ===== الهيدر ===== */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">حسابي</h1>
                <Link href="/profile/edit" className="btn-glass flex items-center gap-2 text-sm">
                    <Edit2 size={16} />
                    تعديل
                </Link>
            </div>

            {/* ===== بطاقة البروفيل ===== */}
            <div className="glass-card p-6 mb-6 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {mockUser.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{mockUser.name}</h2>
                <p className="text-gray-500">{mockUser.email}</p>
                <p className="text-gray-500">{mockUser.phone}</p>
            </div>

            {/* ===== الرصيد ===== */}
            <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Wallet className="text-green-500" size={24} />
                        <span className="font-medium">رصيدي</span>
                    </div>
                    <button
                        onClick={() => setShowAddBalance(true)}
                        className="btn-gradient text-sm flex items-center gap-1"
                    >
                        <Plus size={16} />
                        إضافة رصيد
                    </button>
                </div>
                <p className="text-4xl font-bold gradient-text">{mockUser.wallet_balance} ج.م</p>
            </div>

            {/* ===== إحصائيات الوركسبيس ===== */}
            <div className="glass-card p-6 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    إحصائياتي في الوركسبيس
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/50 rounded-xl">
                        <p className="text-2xl font-bold gradient-text">{mockUser.total_hours}</p>
                        <p className="text-sm text-gray-500">ساعة</p>
                    </div>
                    <div className="text-center p-4 bg-white/50 rounded-xl">
                        <p className="text-2xl font-bold gradient-text">{mockUser.total_spent}</p>
                        <p className="text-sm text-gray-500">ج.م منفقة</p>
                    </div>
                </div>
            </div>

            {/* ===== إحصائيات الألعاب ===== */}
            <div className="glass-card p-6 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Gamepad2 size={20} />
                    إحصائياتي في ليالي الألعاب
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/50 rounded-xl">
                        <p className="text-2xl font-bold text-purple-500">{mockUser.game_nights_attended}</p>
                        <p className="text-sm text-gray-500">ليالي حضرتها</p>
                    </div>
                    <div className="text-center p-4 bg-white/50 rounded-xl flex items-center justify-center gap-2">
                        <Trophy className="text-yellow-500" size={20} />
                        <div>
                            <p className="text-2xl font-bold text-green-500">{mockUser.game_nights_won}</p>
                            <p className="text-sm text-gray-500">فوز</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== كود الـ Affiliate ===== */}
            <div className="glass-card p-6 mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Share2 size={20} />
                    كود التسويق الخاص بي
                </h3>
                <div className="flex items-center justify-between p-4 bg-brand-gradient/10 rounded-xl mb-4">
                    <code className="text-xl font-bold font-mono">{mockUser.affiliate_code}</code>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(mockUser.affiliate_code);
                            alert("تم نسخ الكود!");
                        }}
                        className="btn-glass text-sm"
                    >
                        نسخ
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">أرباحي من التسويق</span>
                    <span className="text-xl font-bold text-green-500">{mockUser.affiliate_earnings} ج.م</span>
                </div>
                <Link href="/profile/affiliate" className="mt-4 flex items-center justify-center gap-2 text-blue-500">
                    عرض التفاصيل <ChevronLeft size={16} />
                </Link>
            </div>

            {/* ===== Modal إضافة رصيد ===== */}
            {showAddBalance && (
                <div className="modal-overlay" onClick={() => setShowAddBalance(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">إضافة رصيد</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">المبلغ (ج.م)</label>
                                <input type="number" className="input-glass" placeholder="100" />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[50, 100, 200, 500].map(amount => (
                                    <button key={amount} className="btn-glass">{amount}</button>
                                ))}
                            </div>
                            <button className="btn-gradient w-full">
                                متابعة للدفع
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
