/* =====================================================
   إدارة المصروفات - Expenses Management
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, Wallet, Trash2, Loader2, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Expense {
    id: string;
    category: string;
    description: string;
    amount: number;
    expense_date: string;
    created_at: string;
}

const categories = [
    { value: "supplies", label: "مستلزمات" },
    { value: "utilities", label: "مرافق (كهرباء/ماء)" },
    { value: "salaries", label: "مرتبات" },
    { value: "maintenance", label: "صيانة" },
    { value: "rent", label: "إيجار" },
    { value: "marketing", label: "تسويق" },
    { value: "other", label: "أخرى" }
];

// =====================================================
// Modal إضافة مصروف
// =====================================================
function AddExpenseModal({
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
        category: "supplies",
        description: "",
        amount: 0,
        expense_date: new Date().toISOString().split("T")[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("expenses")
                .insert(formData);

            if (error) {
                alert("حدث خطأ: " + error.message);
            } else {
                alert("تم إضافة المصروف بنجاح!");
                onSuccess();
                onClose();
                setFormData({ category: "supplies", description: "", amount: 0, expense_date: new Date().toISOString().split("T")[0] });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">إضافة مصروف جديد</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">التصنيف</label>
                        <select
                            className="input-glass"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">الوصف *</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="وصف المصروف"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">المبلغ (ج.م) *</label>
                        <input
                            type="number"
                            className="input-glass"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                            required
                            min={1}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">التاريخ</label>
                        <input
                            type="date"
                            className="input-glass"
                            value={formData.expense_date}
                            onChange={e => setFormData({ ...formData, expense_date: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "إضافة"}
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
// الصفحة الرئيسية
// =====================================================
export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("expenses")
                .select("*")
                .order("expense_date", { ascending: false });

            if (!error) setExpenses(data as Expense[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const deleteExpense = async (id: string) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;

        const supabase = createClient();
        const { error } = await supabase.from("expenses").delete().eq("id", id);

        if (!error) {
            alert("تم الحذف");
            fetchExpenses();
        }
    };

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const getCategoryLabel = (val: string) => categories.find(c => c.value === val)?.label || val;

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Wallet className="text-brand-start" />
                        المصروفات
                    </h1>
                    <p className="text-gray-500 mt-1">
                        الإجمالي: <span className="font-bold text-red-500">{totalExpenses} ج.م</span>
                    </p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} />
                    إضافة مصروف
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto" size={40} />
                </div>
            ) : expenses.length === 0 ? (
                <div className="text-center py-12 glass-card">
                    <Wallet size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">لا يوجد مصروفات مسجلة</p>
                </div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>التصنيف</th>
                                <th>الوصف</th>
                                <th>المبلغ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense.id}>
                                    <td className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        {expense.expense_date}
                                    </td>
                                    <td>
                                        <span className="badge bg-gray-100">{getCategoryLabel(expense.category)}</span>
                                    </td>
                                    <td>{expense.description}</td>
                                    <td className="font-bold text-red-500">{expense.amount} ج.م</td>
                                    <td>
                                        <button
                                            onClick={() => deleteExpense(expense.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchExpenses} />
        </div>
    );
}
