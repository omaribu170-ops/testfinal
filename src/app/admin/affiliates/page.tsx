/* =====================================================
   المسوقين - Affiliates Management
===================================================== */

"use client";

import { Share2, Copy, TrendingUp, Users, Wallet } from "lucide-react";

const mockAffiliates = [
    { id: "1", name: "أحمد محمد", code: "AHMED2024", referred_users: 12, total_earnings: 1850, pending_earnings: 320, paid_earnings: 1530 },
    { id: "2", name: "سارة أحمد", code: "SARA2024", referred_users: 8, total_earnings: 1200, pending_earnings: 180, paid_earnings: 1020 },
    { id: "3", name: "محمد علي", code: "MALII24", referred_users: 5, total_earnings: 650, pending_earnings: 95, paid_earnings: 555 },
];

export default function AffiliatesPage() {
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert("تم نسخ الكود!");
    };

    const totalReferred = mockAffiliates.reduce((sum, a) => sum + a.referred_users, 0);
    const totalEarnings = mockAffiliates.reduce((sum, a) => sum + a.total_earnings, 0);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Share2 className="text-brand-start" />
                        نظام المسوقين (Affiliates)
                    </h1>
                    <p className="text-gray-500 mt-1">30% عمولة على كل ساعة للعملاء المحولين</p>
                </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="stat-card">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-blue-500" size={24} />
                        <span className="text-gray-500">إجمالي المحولين</span>
                    </div>
                    <p className="text-3xl font-bold">{totalReferred}</p>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-green-500" size={24} />
                        <span className="text-gray-500">إجمالي الأرباح</span>
                    </div>
                    <p className="text-3xl font-bold">{totalEarnings.toLocaleString()} ج.م</p>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3 mb-2">
                        <Wallet className="text-purple-500" size={24} />
                        <span className="text-gray-500">عدد المسوقين</span>
                    </div>
                    <p className="text-3xl font-bold">{mockAffiliates.length}</p>
                </div>
            </div>

            {/* جدول المسوقين */}
            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>المسوق</th>
                            <th>كود التسويق</th>
                            <th>المحولين</th>
                            <th>إجمالي الأرباح</th>
                            <th>أرباح معلقة</th>
                            <th>أرباح مدفوعة</th>
                            <th>الإجراء</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockAffiliates.map((affiliate) => (
                            <tr key={affiliate.id}>
                                <td className="font-medium">{affiliate.name}</td>
                                <td>
                                    <span className="flex items-center gap-2">
                                        <code className="bg-gray-100 px-2 py-1 rounded font-mono">{affiliate.code}</code>
                                        <button onClick={() => copyCode(affiliate.code)} className="p-1 hover:bg-gray-100 rounded">
                                            <Copy size={16} className="text-gray-500" />
                                        </button>
                                    </span>
                                </td>
                                <td>{affiliate.referred_users}</td>
                                <td className="font-bold text-green-600">{affiliate.total_earnings.toLocaleString()} ج.م</td>
                                <td className="text-yellow-600">{affiliate.pending_earnings.toLocaleString()} ج.م</td>
                                <td>{affiliate.paid_earnings.toLocaleString()} ج.م</td>
                                <td>
                                    <button className="text-blue-500 hover:underline text-sm">التفاصيل</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* شرح النظام */}
            <div className="glass-card p-6 mt-8">
                <h3 className="font-bold mb-4">كيف يعمل نظام التسويق؟</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>كل عضو لديه كود تسويق خاص به</li>
                    <li>عندما يسجل شخص جديد باستخدام الكود، يصبح مرتبطاً بالمسوق</li>
                    <li>المسوق يحصل على 30% من قيمة كل ساعة يقضيها العضو المحول</li>
                    <li>الأرباح تتراكم ويمكن سحبها عند الطلب</li>
                </ol>
            </div>
        </div>
    );
}
