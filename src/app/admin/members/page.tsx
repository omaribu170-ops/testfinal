/* =====================================================
   إدارة الأعضاء - Members Management
   عرض وإضافة وتعديل الأعضاء - مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Search, Download, Trash2, Eye, Clock, Wallet, Gamepad2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// نوع العضو
interface Member {
    id: string;
    code: string | null;
    name: string;
    email: string | null;
    phone: string;
    gender: string | null;
    wallet_balance: number;
    last_visit: string | null;
    total_hours: number;
    total_spent: number;
    game_nights_attended: number;
    game_nights_won: number;
    nickname: string | null;
    created_at: string;
}

// =====================================================
// Modal إضافة عضو جديد
// =====================================================
function AddMemberModal({
    isOpen,
    onClose,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "male",
        nickname: "",
        wallet_balance: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();

            // إنشاء كود العضوية
            const code = "MBR" + Date.now().toString().slice(-6);

            const { error } = await supabase
                .from("users")
                .insert({
                    name: formData.name,
                    email: formData.email || null,
                    phone: formData.phone,
                    gender: formData.gender,
                    nickname: formData.nickname || null,
                    wallet_balance: formData.wallet_balance,
                    code: code,
                    role: "member",
                    total_hours: 0,
                    total_spent: 0,
                    game_nights_attended: 0,
                    game_nights_won: 0
                });

            if (error) {
                console.error("Error adding member:", error);
                alert("حدث خطأ: " + error.message);
            } else {
                alert("تم إضافة العضو بنجاح!");
                onSuccess();
                onClose();
                setFormData({ name: "", email: "", phone: "", gender: "male", nickname: "", wallet_balance: 0 });
            }
        } catch (err) {
            console.error(err);
            alert("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">إضافة عضو جديد</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="أدخل اسم العضو"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            className="input-glass"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
                        <input
                            type="tel"
                            className="input-glass"
                            placeholder="01xxxxxxxxx"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">النوع</label>
                        <select
                            className="input-glass"
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">الاسم المستعار</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="اختياري"
                            value={formData.nickname}
                            onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">الرصيد الابتدائي (ج.م)</label>
                        <input
                            type="number"
                            className="input-glass"
                            placeholder="0"
                            value={formData.wallet_balance}
                            onChange={e => setFormData({ ...formData, wallet_balance: Number(e.target.value) })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "إضافة العضو"}
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
    onClose,
    onAddBalance
}: {
    member: Member | null;
    onClose: () => void;
    onAddBalance: (memberId: string, amount: number) => void;
}) {
    const [balanceAmount, setBalanceAmount] = useState("");

    if (!member) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
                {/* رأس البروفيل */}
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

                {/* البيانات الأساسية */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
                        <p className="font-medium">{member.email || "غير محدد"}</p>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">رقم الهاتف</p>
                        <p className="font-medium">{member.phone}</p>
                    </div>
                </div>

                {/* إحصائيات الوركسبيس */}
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

                {/* إحصائيات Entertainment Hub */}
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

                {/* إضافة رصيد */}
                <div className="pt-4 border-t border-gray-200/50">
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            className="input-glass flex-1"
                            placeholder="المبلغ المراد إضافته"
                            value={balanceAmount}
                            onChange={e => setBalanceAmount(e.target.value)}
                        />
                        <button
                            className="btn-gradient flex items-center gap-2"
                            onClick={() => {
                                if (balanceAmount && Number(balanceAmount) > 0) {
                                    onAddBalance(member.id, Number(balanceAmount));
                                    setBalanceAmount("");
                                }
                            }}
                        >
                            <Wallet size={18} />
                            إضافة رصيد
                        </button>
                    </div>
                </div>

                <button onClick={onClose} className="mt-4 btn-glass w-full">
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
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // جلب الأعضاء من Supabase
    const fetchMembers = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("role", "member")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching members:", error);
            } else {
                setMembers(data as Member[] || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // حذف عضو
    const deleteMember = async (id: string) => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("users")
                .delete()
                .eq("id", id);

            if (error) {
                alert("حدث خطأ: " + error.message);
            } else {
                alert("تم حذف العضو بنجاح");
                fetchMembers();
            }
        } catch (err) {
            console.error(err);
        }
        setShowDeleteConfirm(null);
    };

    // إضافة رصيد
    const addBalance = async (memberId: string, amount: number) => {
        try {
            const supabase = createClient();
            const member = members.find(m => m.id === memberId);
            if (!member) return;

            const { error } = await supabase
                .from("users")
                .update({ wallet_balance: member.wallet_balance + amount })
                .eq("id", memberId);

            if (error) {
                alert("حدث خطأ: " + error.message);
            } else {
                alert(`تم إضافة ${amount} ج.م بنجاح`);
                fetchMembers();
                const updated = { ...member, wallet_balance: member.wallet_balance + amount };
                setSelectedMember(updated);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // تصفية الأعضاء
    const filteredMembers = members.filter(
        member =>
            member.name.includes(searchTerm) ||
            (member.email?.includes(searchTerm)) ||
            member.phone.includes(searchTerm) ||
            (member.code?.includes(searchTerm))
    );

    // تصدير CSV
    const exportToCSV = () => {
        const headers = ["الكود", "الاسم", "البريد الإلكتروني", "الهاتف", "الرصيد", "آخر زيارة"];
        const data = members.map(m => [
            m.code, m.name, m.email || "", m.phone, m.wallet_balance, m.last_visit || ""
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
            {/* العنوان والأزرار */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="text-brand-start" />
                        إدارة الأعضاء
                    </h1>
                    <p className="text-gray-500 mt-1">
                        إجمالي الأعضاء: {members.length}
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

            {/* شريط البحث */}
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

            {/* جدول الأعضاء */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                        <p className="text-gray-500">جاري التحميل...</p>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">لا يوجد أعضاء</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="btn-gradient mt-4"
                        >
                            إضافة أول عضو
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>الكود</th>
                                    <th>الاسم</th>
                                    <th>الهاتف</th>
                                    <th>البريد الإلكتروني</th>
                                    <th>الرصيد</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-white/30 transition-colors">
                                        <td className="font-mono text-sm">{member.code}</td>
                                        <td className="font-medium">{member.name}</td>
                                        <td>{member.phone}</td>
                                        <td>{member.email || "-"}</td>
                                        <td>
                                            <span className={member.wallet_balance > 0 ? "text-green-600" : "text-gray-400"}>
                                                {member.wallet_balance} ج.م
                                            </span>
                                        </td>
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
                )}
            </div>

            {/* Modals */}
            <AddMemberModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchMembers}
            />

            <MemberProfileModal
                member={selectedMember}
                onClose={() => setSelectedMember(null)}
                onAddBalance={addBalance}
            />

            {/* تأكيد الحذف */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">حذف العضو</h2>
                        <p className="text-gray-500 mb-6">
                            هل أنت متأكد أنك تريد حذف هذا العضو؟
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="btn-glass flex-1"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => deleteMember(showDeleteConfirm)}
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
