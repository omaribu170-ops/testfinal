/* =====================================================
   إدارة المهام - Tasks Management
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, ClipboardList, Trash2, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Task {
    id: string;
    title: string;
    description: string | null;
    assigned_to: string | null;
    priority: string;
    status: string;
    due_date: string | null;
    created_at: string;
}

interface Employee {
    id: string;
    name: string;
}

const priorities = [
    { value: "low", label: "منخفضة", color: "bg-gray-100 text-gray-700" },
    { value: "medium", label: "متوسطة", color: "bg-yellow-100 text-yellow-700" },
    { value: "high", label: "عالية", color: "bg-red-100 text-red-700" }
];

const statuses = [
    { value: "pending", label: "قيد الانتظار" },
    { value: "in_progress", label: "جاري التنفيذ" },
    { value: "completed", label: "مكتمل" }
];

function TaskModal({
    isOpen, onClose, onSuccess, employees
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    employees: Employee[];
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "", description: "", assigned_to: "", priority: "medium", due_date: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const supabase = createClient();
            await supabase.from("tasks").insert({
                ...formData,
                assigned_to: formData.assigned_to || null,
                due_date: formData.due_date || null,
                status: "pending"
            });
            onSuccess();
            onClose();
            setFormData({ title: "", description: "", assigned_to: "", priority: "medium", due_date: "" });
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
                <h2 className="text-xl font-bold mb-6">مهمة جديدة</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">العنوان *</label>
                        <input type="text" className="input-glass" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">الوصف</label>
                        <textarea className="input-glass" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">تعيين لـ</label>
                        <select className="input-glass" value={formData.assigned_to} onChange={e => setFormData({ ...formData, assigned_to: e.target.value })}>
                            <option value="">-- اختر موظف --</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">الأولوية</label>
                            <select className="input-glass" value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">تاريخ الاستحقاق</label>
                            <input type="date" className="input-glass" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "إضافة"}
                        </button>
                        <button type="button" onClick={onClose} className="btn-glass flex-1">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data: tasksData } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
            const { data: employeesData } = await supabase.from("employees").select("id, name");
            setTasks(tasksData as Task[] || []);
            setEmployees(employeesData as Employee[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const updateStatus = async (id: string, status: string) => {
        const supabase = createClient();
        await supabase.from("tasks").update({ status }).eq("id", id);
        fetchData();
    };

    const deleteTask = async (id: string) => {
        if (!confirm("هل أنت متأكد؟")) return;
        const supabase = createClient();
        await supabase.from("tasks").delete().eq("id", id);
        fetchData();
    };

    const getPriorityInfo = (val: string) => priorities.find(p => p.value === val) || priorities[1];
    const getStatusLabel = (val: string) => statuses.find(s => s.value === val)?.label || val;
    const getEmployeeName = (id: string | null) => employees.find(e => e.id === id)?.name || "-";

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ClipboardList className="text-brand-start" />
                        المهام
                    </h1>
                    <p className="text-gray-500 mt-1">{tasks.length} مهمة</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} /> مهمة جديدة
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" size={40} /></div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-12 glass-card"><ClipboardList size={48} className="mx-auto mb-4 text-gray-400" /><p className="text-gray-500">لا يوجد مهام</p></div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => {
                        const priority = getPriorityInfo(task.priority);
                        return (
                            <div key={task.id} className={`glass-card p-4 ${task.status === "completed" ? "opacity-60" : ""}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className={`font-bold ${task.status === "completed" ? "line-through" : ""}`}>{task.title}</h3>
                                            <span className={`badge ${priority.color}`}>{priority.label}</span>
                                        </div>
                                        {task.description && <p className="text-gray-500 text-sm mb-2">{task.description}</p>}
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>الحالة: {getStatusLabel(task.status)}</span>
                                            <span>تعيين: {getEmployeeName(task.assigned_to)}</span>
                                            {task.due_date && <span>استحقاق: {task.due_date}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {task.status !== "completed" && (
                                            <button onClick={() => updateStatus(task.id, "completed")} className="p-2 hover:bg-green-50 rounded-lg text-green-500">
                                                <Check size={18} />
                                            </button>
                                        )}
                                        <button onClick={() => deleteTask(task.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} employees={employees} />
        </div>
    );
}
