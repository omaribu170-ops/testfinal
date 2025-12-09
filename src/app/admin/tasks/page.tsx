/* =====================================================
   إدارة المهام - Tasks Management
===================================================== */

"use client";

import { useState } from "react";
import { ClipboardList, Plus, CheckCircle2, Clock, AlertTriangle, Calendar } from "lucide-react";

const mockTasks = [
    { id: "1", title: "تنظيف المخزن", description: "ترتيب وتنظيف المخزن بالكامل", priority: "high", deadline: "2024-12-10T18:00", status: "pending", assigned_to: ["محمد أحمد"], created_by: "الأدمن" },
    { id: "2", title: "جرد المنتجات", description: "عمل جرد شامل للمنتجات", priority: "medium", deadline: "2024-12-12T12:00", status: "in_progress", assigned_to: ["سارة خالد", "أحمد علي"], created_by: "الأدمن" },
    { id: "3", title: "صيانة التكييف", description: "الاتصال بفني الصيانة", priority: "low", deadline: "2024-12-15T10:00", status: "completed", assigned_to: ["محمد أحمد"], created_by: "الأدمن" },
];

const priorityConfig: Record<string, { label: string; color: string }> = {
    low: { label: "منخفضة", color: "badge-info" },
    medium: { label: "متوسطة", color: "badge-warning" },
    high: { label: "عالية", color: "badge-error" },
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: "قيد الانتظار", color: "badge-warning", icon: Clock },
    in_progress: { label: "قيد التنفيذ", color: "badge-info", icon: Clock },
    completed: { label: "مكتملة", color: "badge-success", icon: CheckCircle2 },
    overdue: { label: "متأخرة", color: "badge-error", icon: AlertTriangle },
};

export default function TasksPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ClipboardList className="text-brand-start" />
                        إدارة المهام
                    </h1>
                    <p className="text-gray-500 mt-1">إجمالي المهام: {mockTasks.length}</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} />
                    إضافة مهمة
                </button>
            </div>

            <div className="space-y-4">
                {mockTasks.map((task) => {
                    const priority = priorityConfig[task.priority];
                    const status = statusConfig[task.status];
                    const StatusIcon = status.icon;
                    const deadline = new Date(task.deadline);
                    const isOverdue = deadline < new Date() && task.status !== "completed";

                    return (
                        <div key={task.id} className={`glass-card p-6 ${isOverdue ? "border-red-300" : ""}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold">{task.title}</h3>
                                        <span className={`badge ${priority.color}`}>{priority.label}</span>
                                        <span className={`badge ${isOverdue ? "badge-error" : status.color} flex items-center gap-1`}>
                                            <StatusIcon size={14} />
                                            {isOverdue ? "متأخرة" : status.label}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 mb-3">{task.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {deadline.toLocaleDateString("ar-EG")} - {deadline.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        <span>المكلفين: {task.assigned_to.join("، ")}</span>
                                    </div>
                                </div>
                                {task.status !== "completed" && !isOverdue && (
                                    <button className="btn-glass text-green-600 hover:bg-green-50">
                                        <CheckCircle2 size={20} className="ml-2 inline" />
                                        تم الإنجاز
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal إضافة مهمة */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">إضافة مهمة جديدة</h2>
                        <form className="space-y-4">
                            <div><label className="block text-sm font-medium mb-2">عنوان المهمة</label><input type="text" className="input-glass" /></div>
                            <div><label className="block text-sm font-medium mb-2">الوصف</label><textarea className="input-glass" rows={3} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-2">الأولوية</label>
                                    <select className="input-glass">
                                        <option value="low">منخفضة</option>
                                        <option value="medium">متوسطة</option>
                                        <option value="high">عالية</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-medium mb-2">الموعد النهائي</label><input type="datetime-local" className="input-glass" /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-2">المكلفين</label>
                                <select className="input-glass" multiple>
                                    <option value="1">محمد أحمد</option>
                                    <option value="2">سارة خالد</option>
                                    <option value="3">أحمد علي</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-gradient flex-1">إضافة المهمة</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-glass flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
