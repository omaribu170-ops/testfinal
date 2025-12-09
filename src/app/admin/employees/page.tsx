/* =====================================================
   إدارة الموظفين - Employees Management (Super Admin Only)
===================================================== */

"use client";

import { useState } from "react";
import { UserCog, Plus, Eye, Edit2 } from "lucide-react";

const mockEmployees = [
    { id: "1", name: "محمد أحمد", phone: "01012345678", shift: "morning", salary: 4000, hire_date: "2024-01-15", is_active: true },
    { id: "2", name: "سارة خالد", phone: "01098765432", shift: "evening", salary: 4000, hire_date: "2024-03-01", is_active: true },
    { id: "3", name: "أحمد علي", phone: "01155544433", shift: "full", salary: 5000, hire_date: "2023-06-01", is_active: true },
];

const shiftLabels: Record<string, string> = {
    morning: "صباحي",
    evening: "مسائي",
    night: "ليلي",
    full: "كامل",
};

export default function EmployeesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <UserCog className="text-brand-start" />
                        إدارة الموظفين
                    </h1>
                    <p className="text-gray-500 mt-1">إجمالي الموظفين: {mockEmployees.length}</p>
                </div>
                <button onClick={() => { setSelectedEmployee(null); setIsModalOpen(true); }} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} />
                    إضافة موظف
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>الاسم</th>
                            <th>رقم الهاتف</th>
                            <th>الوردية</th>
                            <th>الراتب</th>
                            <th>تاريخ التعيين</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockEmployees.map((employee) => (
                            <tr key={employee.id}>
                                <td className="font-medium">{employee.name}</td>
                                <td>{employee.phone}</td>
                                <td><span className="badge badge-info">{shiftLabels[employee.shift]}</span></td>
                                <td>{employee.salary.toLocaleString()} ج.م</td>
                                <td>{employee.hire_date}</td>
                                <td><span className={`badge ${employee.is_active ? "badge-success" : "badge-error"}`}>{employee.is_active ? "نشط" : "غير نشط"}</span></td>
                                <td>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedEmployee(employee)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500"><Eye size={18} /></button>
                                        <button onClick={() => { setSelectedEmployee(employee); setIsModalOpen(true); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><Edit2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal إضافة/تعديل موظف */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">{selectedEmployee ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}</h2>
                        <form className="space-y-4">
                            <div><label className="block text-sm font-medium mb-2">الاسم الكامل</label><input type="text" className="input-glass" defaultValue={selectedEmployee?.name} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-2">رقم الهاتف</label><input type="tel" className="input-glass" defaultValue={selectedEmployee?.phone} /></div>
                                <div><label className="block text-sm font-medium mb-2">العنوان</label><input type="text" className="input-glass" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-2">الوردية</label>
                                    <select className="input-glass" defaultValue={selectedEmployee?.shift}>
                                        <option value="morning">صباحي</option>
                                        <option value="evening">مسائي</option>
                                        <option value="night">ليلي</option>
                                        <option value="full">كامل</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-medium mb-2">الراتب (ج.م)</label><input type="number" className="input-glass" defaultValue={selectedEmployee?.salary} /></div>
                            </div>
                            <div><label className="block text-sm font-medium mb-2">رقم البطاقة</label><input type="text" className="input-glass" /></div>
                            <div><label className="block text-sm font-medium mb-2">صورة البطاقة</label><input type="file" accept="image/*" className="input-glass" /></div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-gradient flex-1">{selectedEmployee ? "حفظ التعديلات" : "إضافة الموظف"}</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-glass flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
