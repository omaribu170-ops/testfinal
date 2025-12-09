/* =====================================================
   إدارة الموظفين - Employees Management
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, UserCog, Edit2, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Employee {
    id: string;
    name: string;
    phone: string;
    role: string;
    salary: number;
    hired_date: string;
    is_active: boolean;
    created_at: string;
}

const roles = [
    { value: "manager", label: "مدير" },
    { value: "cashier", label: "كاشير" },
    { value: "barista", label: "باريستا" },
    { value: "cleaner", label: "عامل نظافة" },
    { value: "security", label: "أمن" }
];

function EmployeeModal({
    isOpen, onClose, onSuccess, editEmployee
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editEmployee: Employee | null;
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", phone: "", role: "cashier", salary: 0, hired_date: new Date().toISOString().split("T")[0]
    });

    useEffect(() => {
        if (editEmployee) {
            setFormData({
                name: editEmployee.name,
                phone: editEmployee.phone,
                role: editEmployee.role,
                salary: editEmployee.salary,
                hired_date: editEmployee.hired_date
            });
        } else {
            setFormData({ name: "", phone: "", role: "cashier", salary: 0, hired_date: new Date().toISOString().split("T")[0] });
        }
    }, [editEmployee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const supabase = createClient();
            if (editEmployee) {
                await supabase.from("employees").update(formData).eq("id", editEmployee.id);
            } else {
                await supabase.from("employees").insert({ ...formData, is_active: true });
            }
            onSuccess();
            onClose();
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
                <h2 className="text-xl font-bold mb-6">{editEmployee ? "تعديل الموظف" : "إضافة موظف"}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">الاسم *</label>
                        <input type="text" className="input-glass" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">الهاتف *</label>
                        <input type="tel" className="input-glass" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">الوظيفة</label>
                        <select className="input-glass" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">المرتب (ج.م)</label>
                        <input type="number" className="input-glass" value={formData.salary} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">تاريخ التعيين</label>
                        <input type="date" className="input-glass" value={formData.hired_date} onChange={e => setFormData({ ...formData, hired_date: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "حفظ"}
                        </button>
                        <button type="button" onClick={onClose} className="btn-glass flex-1">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data } = await supabase.from("employees").select("*").order("name");
            setEmployees(data as Employee[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    const deleteEmployee = async (id: string) => {
        if (!confirm("هل أنت متأكد؟")) return;
        const supabase = createClient();
        await supabase.from("employees").delete().eq("id", id);
        fetchEmployees();
    };

    const getRoleLabel = (val: string) => roles.find(r => r.value === val)?.label || val;

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <UserCog className="text-brand-start" />
                        الموظفين
                    </h1>
                    <p className="text-gray-500 mt-1">{employees.length} موظف</p>
                </div>
                <button onClick={() => { setEditEmployee(null); setIsModalOpen(true); }} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} /> إضافة موظف
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" size={40} /></div>
            ) : employees.length === 0 ? (
                <div className="text-center py-12 glass-card"><UserCog size={48} className="mx-auto mb-4 text-gray-400" /><p className="text-gray-500">لا يوجد موظفين</p></div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <table className="data-table">
                        <thead><tr><th>الاسم</th><th>الوظيفة</th><th>الهاتف</th><th>المرتب</th><th></th></tr></thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td className="font-medium">{emp.name}</td>
                                    <td><span className="badge bg-blue-100 text-blue-700">{getRoleLabel(emp.role)}</span></td>
                                    <td>{emp.phone}</td>
                                    <td className="font-bold">{emp.salary} ج.م</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditEmployee(emp); setIsModalOpen(true); }} className="p-2 hover:bg-blue-50 rounded-lg text-blue-500"><Edit2 size={16} /></button>
                                            <button onClick={() => deleteEmployee(emp.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <EmployeeModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditEmployee(null); }} onSuccess={fetchEmployees} editEmployee={editEmployee} />
        </div>
    );
}
