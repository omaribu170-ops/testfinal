/* =====================================================
   طلبات المكان - Requests Management
===================================================== */

"use client";

import { useState } from "react";
import { Package, Plus, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";

// بيانات تجريبية
const mockRequests = [
    { id: "1", type: "supply", item_name: "مناديل ورقية", quantity: 10, estimated_cost: 150, status: "pending", requested_by: "أحمد محمد", created_at: "2024-12-09" },
    { id: "2", type: "maintenance", item_name: "إصلاح تكييف", quantity: 1, estimated_cost: 500, status: "received", requested_by: "سارة أحمد", created_at: "2024-12-08" },
    { id: "3", type: "food", item_name: "قهوة تركي", quantity: 5, estimated_cost: 250, status: "completed", requested_by: "محمد علي", created_at: "2024-12-07" },
];

const typeLabels: Record<string, string> = {
    supply: "مستلزمات",
    maintenance: "صيانة",
    food: "طعام",
    drink: "مشروبات",
    other: "أخرى",
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: "في الانتظار", color: "badge-warning", icon: Clock },
    received: { label: "تم الاستلام", color: "badge-info", icon: AlertCircle },
    completed: { label: "تم التنفيذ", color: "badge-success", icon: CheckCircle2 },
};

export default function RequestsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const exportToCSV = () => {
        const headers = ["النوع", "الطلب", "الكمية", "التكلفة", "الحالة", "مقدم الطلب", "التاريخ"];
        const data = mockRequests.map(r => [typeLabels[r.type], r.item_name, r.quantity, r.estimated_cost, statusConfig[r.status].label, r.requested_by, r.created_at]);
        const csvContent = [headers.join(","), ...data.map(row => row.join(","))].join("\n");
        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "requests.csv";
        link.click();
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="text-brand-start" />
                        طلبات المكان
                    </h1>
                    <p className="text-gray-500 mt-1">إدارة طلبات المستلزمات والصيانة</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportToCSV} className="btn-glass flex items-center gap-2">
                        <Download size={18} />
                        تصدير CSV
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                        <Plus size={20} />
                        طلب جديد
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>النوع</th>
                            <th>الطلب</th>
                            <th>الكمية</th>
                            <th>التكلفة المتوقعة</th>
                            <th>مقدم الطلب</th>
                            <th>التاريخ</th>
                            <th>الحالة</th>
                            <th>الإجراء</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRequests.map((request) => {
                            const status = statusConfig[request.status];
                            const StatusIcon = status.icon;
                            return (
                                <tr key={request.id}>
                                    <td><span className="badge badge-info">{typeLabels[request.type]}</span></td>
                                    <td className="font-medium">{request.item_name}</td>
                                    <td>{request.quantity}</td>
                                    <td>{request.estimated_cost} ج.م</td>
                                    <td>{request.requested_by}</td>
                                    <td>{request.created_at}</td>
                                    <td><span className={`badge ${status.color} flex items-center gap-1`}><StatusIcon size={14} />{status.label}</span></td>
                                    <td>
                                        {request.status !== "completed" && (
                                            <button className="text-blue-500 hover:underline text-sm">
                                                تغيير الحالة
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal إضافة طلب */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">إضافة طلب جديد</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">نوع الطلب</label>
                                <select className="input-glass">
                                    <option value="supply">مستلزمات نظافة</option>
                                    <option value="food">طعام</option>
                                    <option value="drink">مشروبات</option>
                                    <option value="maintenance">صيانة</option>
                                    <option value="other">أخرى</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">اسم الطلب</label>
                                <input type="text" className="input-glass" placeholder="مثال: مناديل ورقية" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">الكمية</label>
                                    <input type="number" className="input-glass" defaultValue={1} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">التكلفة المتوقعة</label>
                                    <input type="number" className="input-glass" placeholder="0" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">تفاصيل إضافية</label>
                                <textarea className="input-glass" rows={3} placeholder="أي ملاحظات..." />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-gradient flex-1">إضافة الطلب</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-glass flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
