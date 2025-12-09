/* =====================================================
   مصروفات المكان - Expenses Management
===================================================== */

"use client";

import { useState } from "react";
import { Wallet, Plus, Download, Calendar } from "lucide-react";

const mockExpenses = [
    { id: "1", title: "إيجار الشهر", category: "rent", amount: 15000, expense_date: "2024-12-01", description: "إيجار شهر ديسمبر" },
    { id: "2", title: "فاتورة الكهرباء", category: "utilities", amount: 2500, expense_date: "2024-12-05", description: "فاتورة كهرباء نوفمبر" },
    { id: "3", title: "رواتب الموظفين", category: "salary", amount: 12000, expense_date: "2024-12-01", description: "رواتب شهر ديسمبر" },
    { id: "4", title: "مستلزمات نظافة", category: "supplies", amount: 800, expense_date: "2024-12-08", description: "شراء مناديل ومنظفات" },
];

const categoryLabels: Record<string, string> = {
    rent: "إيجار",
    utilities: "مرافق",
    salary: "رواتب",
    supplies: "مستلزمات",
    maintenance: "صيانة",
    other: "أخرى",
};

export default function ExpensesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState("");

    const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);

    const exportToCSV = () => {
        const headers = ["العنوان", "التصنيف", "المبلغ", "التاريخ", "الوصف"];
        const data = mockExpenses.map(e => [e.title, categoryLabels[e.category], e.amount, e.expense_date, e.description]);
        const csvContent = [headers.join(","), ...data.map(row => row.join(","))].join("\n");
        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "expenses.csv";
        link.click();
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Wallet className="text-brand-start" />
                        مصروفات المكان
                    </h1>
                    <p className="text-gray-500 mt-1">إجمالي المصروفات: {totalExpenses.toLocaleString()} ج.م</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportToCSV} className="btn-glass flex items-center gap-2">
                        <Download size={18} />
                        تصدير CSV
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                        <Plus size={20} />
                        إضافة مصروف
                    </button>
                </div>
            </div>

            {/* فلتر التاريخ */}
            <div className="mb-6">
                <div className="relative max-w-xs">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="date" className="input-glass pr-12" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>العنوان</th>
                            <th>التصنيف</th>
                            <th>المبلغ</th>
                            <th>التاريخ</th>
                            <th>الوصف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockExpenses.map((expense) => (
                            <tr key={expense.id}>
                                <td className="font-medium">{expense.title}</td>
                                <td><span className="badge badge-info">{categoryLabels[expense.category]}</span></td>
                                <td className="font-bold text-red-500">{expense.amount.toLocaleString()} ج.م</td>
                                <td>{expense.expense_date}</td>
                                <td className="text-gray-500">{expense.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal إضافة مصروف */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">إضافة مصروف جديد</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">عنوان المصروف</label>
                                <input type="text" className="input-glass" placeholder="مثال: فاتورة الكهرباء" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">التصنيف</label>
                                <select className="input-glass">
                                    <option value="rent">إيجار</option>
                                    <option value="utilities">مرافق (كهرباء/مياه/غاز)</option>
                                    <option value="salary">رواتب</option>
                                    <option value="supplies">مستلزمات</option>
                                    <option value="maintenance">صيانة</option>
                                    <option value="other">أخرى</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">المبلغ (ج.م)</label>
                                    <input type="number" className="input-glass" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">التاريخ</label>
                                    <input type="date" className="input-glass" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">الوصف</label>
                                <textarea className="input-glass" rows={3} placeholder="تفاصيل إضافية..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">صورة الفاتورة (اختياري)</label>
                                <input type="file" accept="image/*" className="input-glass" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-gradient flex-1">إضافة المصروف</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-glass flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
