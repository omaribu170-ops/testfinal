/* =====================================================
   إدارة الأعضاء - Members Management
   عرض وإضافة وتعديل الأعضاء
===================================================== */

"use client";

import { useState } from "react";
import { Plus, Users, Search, Download, Trash2, Eye, Clock, Wallet, Gamepad2 } from "lucide-react";

// =====================================================
// بيانات تجريبية للأعضاء
// =====================================================
const mockMembers = [
    {
        id: "1",
        code: "MBR001",
        name: "أحمد محمد",
        email: "ahmed@example.com",
        phone: "01012345678",
        gender: "male",
        wallet_balance: 250,
        last_visit: "2024-12-08",
        total_hours: 45,
        total_spent: 1350,
        game_nights_attended: 5,
        game_nights_won: 2,
        nickname: "الصقر",
    },
    {
        id: "2",
        code: "MBR002",
        name: "سارة أحمد",
        email: "sara@example.com",
        phone: "01098765432",
        gender: "female",
        wallet_balance: 100,
        last_visit: "2024-12-07",
        total_hours: 32,
        total_spent: 960,
        game_nights_attended: 3,
        game_nights_won: 1,
        nickname: "النجمة",
    },
    {
        id: "3",
        code: "MBR003",
        name: "محمد علي",
        email: "mohamed@example.com",
        phone: "01155544433",
        gender: "male",
        wallet_balance: 0,
        last_visit: "2024-12-09",
        total_hours: 78,
        total_spent: 2340,
        game_nights_attended: 12,
        game_nights_won: 4,
        nickname: "البطل",
    },
];

// =====================================================
// Modal إضافة عضو جديد
// =====================================================
function AddMemberModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">إضافة عضو جديد</h2>

                <form className="space-y-4">
                    {/* الاسم */}
                    <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="أدخل اسم العضو"
                            required
                        />
                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                        <input
                            type="email"
                            className="input-glass"
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    {/* رقم الهاتف */}
                    <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
                        <input
                            type="tel"
                            className="input-glass"
                            placeholder="01xxxxxxxxx"
                            required
                        />
                    </div>

                    {/* النوع */}
                    <div>
                        <label className="block text-sm font-medium mb-2">النوع</label>
                        <select className="input-glass">
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                        </select>
                    </div>

                    {/* الاسم المستعار */}
                    <div>
                        <label className="block text-sm font-medium mb-2">الاسم المستعار (للـ Entertainment Hub)</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="اختياري"
                        />
                    </div>

                    {/* الرصيد الابتدائي */}
                    <div>
                        <label className="block text-sm font-medium mb-2">الرصيد الابتدائي (ج.م)</label>
                        <input
                            type="number"
                            className="input-glass"
                            placeholder="0"
                            defaultValue={0}
                        />
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1">
                            إضافة العضو
                        </button>
                        <button type="button" onClick={onClose} className="btn-glass flex-1">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// =====================================================
// Modal بروفيل العضو
// =====================================================
function MemberProfileModal({
    member,
    onClose
}: {
    member: typeof mockMembers[0] | null;
    onClose: () => void;
}) {
    if (!member) return null;

    // آخر 10 زيارات (بيانات تجريبية)
    const recentSessions = [
        { date: "2024-12-08", duration: "3 ساعات", amount: 90 },
        { date: "2024-12-05", duration: "2 ساعات", amount: 60 },
        { date: "2024-12-01", duration: "4 ساعات", amount: 120 },
        { date: "2024-11-28", duration: "2.5 ساعات", amount: 75 },
        { date: "2024-11-25", duration: "3 ساعات", amount: 90 },
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content max-w-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* ===== رأس البروفيل ===== */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200/50">
                    <div className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center text-white text-2xl font-bold">
                        {member.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{member.name}</h2>
                        <p className="text-gray-500">كود العضوية: {member.code}</p>
                        {member.nickname && (
                            <p className="text-sm text-brand-start mt-1">&quot;{member.nickname}&quot;</p>
                        )}
                    </div>
                </div>

                {/* ===== البيانات الأساسية ===== */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
                        <p className="font-medium">{member.email}</p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">رقم الهاتف</p>
                        <p className="font-medium">{member.phone}</p>
                    </div>
                </div>

                {/* ===== إحصائيات الوركسبيس ===== */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Clock size={20} />
                        إحصائيات الوركسبيس
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="glass-card p-4 text-center">
                            <p className="text-2xl font-bold gradient-text">{member.total_hours}</p>
                            <p className="text-sm text-gray-500">ساعة إجمالية</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <p className="text-2xl font-bold gradient-text">{member.total_spent}</p>
                            <p className="text-sm text-gray-500">ج.م إجمالي</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <p className="text-2xl font-bold gradient-text">{member.wallet_balance}</p>
                            <p className="text-sm text-gray-500">ج.م رصيد</p>
                        </div>
                    </div>
                </div>

                {/* ===== إحصائيات Entertainment Hub ===== */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Gamepad2 size={20} />
                        إحصائيات Entertainment Hub
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="glass-card p-4 text-center">
                            <p className="text-2xl font-bold text-purple-500">{member.game_nights_attended}</p>
                            <p className="text-sm text-gray-500">ليالي ألعاب حضرها</p>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <p className="text-2xl font-bold text-green-500">{member.game_nights_won}</p>
                            <p className="text-sm text-gray-500">ليالي ألعاب كسبها</p>
                        </div>
                    </div>
                </div>

                {/* ===== آخر الزيارات ===== */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">آخر 10 زيارات</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {recentSessions.map((session, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                <span className="text-gray-600">{session.date}</span>
                                <span className="text-gray-500">{session.duration}</span>
                                <span className="font-medium">{session.amount} ج.م</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== إضافة رصيد ===== */}
                <div className="pt-4 border-t border-gray-200/50">
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            className="input-glass flex-1"
                            placeholder="المبلغ المراد إضافته"
                        />
                        <button className="btn-gradient flex items-center gap-2">
                            <Wallet size={18} />
                            إضافة رصيد
                        </button>
                    </div>
                </div>

                {/* ===== زر الإغلاق ===== */}
                <button
                    onClick={onClose}
                    className="mt-4 btn-glass w-full"
                >
                    إغلاق
                </button>
            </div>
        </div>
    );
}

// =====================================================
// صفحة الأعضاء الرئيسية
// =====================================================
export default function MembersPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // تصفية الأعضاء بناءً على البحث
    const filteredMembers = mockMembers.filter(
        member =>
            member.name.includes(searchTerm) ||
            member.email.includes(searchTerm) ||
            member.phone.includes(searchTerm) ||
            member.code.includes(searchTerm)
    );

    // تصدير CSV
    const exportToCSV = () => {
        const headers = ["الكود", "الاسم", "البريد الإلكتروني", "الهاتف", "الرصيد", "آخر زيارة"];
        const data = mockMembers.map(m => [
            m.code, m.name, m.email, m.phone, m.wallet_balance, m.last_visit
        ]);

        const csvContent = [headers.join(","), ...data.map(row => row.join(","))].join("\n");
        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "members.csv";
        link.click();
    };

    return (
        <div className="animate-fadeIn">
            {/* ===== العنوان والأزرار ===== */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="text-brand-start" />
                        إدارة الأعضاء
                    </h1>
                    <p className="text-gray-500 mt-1">
                        إجمالي الأعضاء: {mockMembers.length}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportToCSV} className="btn-glass flex items-center gap-2">
                        <Download size={18} />
                        تصدير CSV
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="btn-gradient flex items-center gap-2">
                        <Plus size={20} />
                        إضافة عضو
                    </button>
                </div>
            </div>

            {/* ===== شريط البحث ===== */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        className="input-glass pr-12"
                        placeholder="ابحث بالاسم أو الهاتف أو الإيميل..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* ===== جدول الأعضاء ===== */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>الاسم</th>
                                <th>الهاتف</th>
                                <th>البريد الإلكتروني</th>
                                <th>الرصيد</th>
                                <th>آخر زيارة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-white/30 transition-colors">
                                    <td className="font-mono text-sm">{member.code}</td>
                                    <td className="font-medium">{member.name}</td>
                                    <td>{member.phone}</td>
                                    <td>{member.email}</td>
                                    <td>
                                        <span className={member.wallet_balance > 0 ? "text-green-600" : "text-gray-400"}>
                                            {member.wallet_balance} ج.م
                                        </span>
                                    </td>
                                    <td>{member.last_visit}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedMember(member)}
                                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-500"
                                                title="عرض البروفيل"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(member.id)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                                                title="حذف العضو"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ===== Modals ===== */}
            <AddMemberModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <MemberProfileModal
                member={selectedMember}
                onClose={() => setSelectedMember(null)}
            />

            {/* ===== تأكيد الحذف ===== */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">حذف العضو</h2>
                        <p className="text-gray-500 mb-6">
                            هل أنت متأكد أنك تريد حذف هذا العضو؟ سيتم حذف جميع بياناته وسجلاته.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="btn-glass flex-1"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="bg-red-500 text-white px-6 py-3 rounded-xl flex-1 hover:bg-red-600 transition-colors"
                            >
                                تأكيد الحذف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
