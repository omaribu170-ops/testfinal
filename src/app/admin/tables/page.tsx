/* =====================================================
   إدارة الترابيزات - Tables Management
   عرض وإضافة وتعديل الترابيزات - مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, Table2, Edit2, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// نوع الترابيزة
interface Table {
    id: string;
    name: string;
    type: string;
    capacity: number;
    hourly_rate: number;
    status: string;
    created_at: string;
}

// =====================================================
// Modal إضافة/تعديل ترابيزة
// =====================================================
function TableModal({
    isOpen,
    onClose,
    onSuccess,
    editTable
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editTable: Table | null;
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "regular",
        capacity: 4,
        hourly_rate: 30
    });

    useEffect(() => {
        if (editTable) {
            setFormData({
                name: editTable.name,
                type: editTable.type,
                capacity: editTable.capacity,
                hourly_rate: editTable.hourly_rate
            });
        } else {
            setFormData({ name: "", type: "regular", capacity: 4, hourly_rate: 30 });
        }
    }, [editTable]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();

            if (editTable) {
                // تعديل
                const { error } = await supabase
                    .from("tables")
                    .update(formData)
                    .eq("id", editTable.id);

                if (error) {
                    alert("حدث خطأ: " + error.message);
                } else {
                    alert("تم تعديل الترابيزة بنجاح!");
                    onSuccess();
                    onClose();
                }
            } else {
                // إضافة
                const { error } = await supabase
                    .from("tables")
                    .insert({ ...formData, status: "available" });

                if (error) {
                    alert("حدث خطأ: " + error.message);
                } else {
                    alert("تم إضافة الترابيزة بنجاح!");
                    onSuccess();
                    onClose();
                }
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
                <h2 className="text-xl font-bold mb-6">
                    {editTable ? "تعديل الترابيزة" : "إضافة ترابيزة جديدة"}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">اسم الترابيزة *</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="مثال: VIP 1"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">نوع الترابيزة</label>
                        <select
                            className="input-glass"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="regular">عادية</option>
                            <option value="vip">VIP</option>
                            <option value="large">كبيرة</option>
                            <option value="private">خاصة</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">السعة (أشخاص)</label>
                        <input
                            type="number"
                            className="input-glass"
                            value={formData.capacity}
                            onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                            min={1}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">سعر الساعة (ج.م)</label>
                        <input
                            type="number"
                            className="input-glass"
                            value={formData.hourly_rate}
                            onChange={e => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                            min={0}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : (editTable ? "حفظ التعديلات" : "إضافة الترابيزة")}
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
// صفحة الترابيزات الرئيسية
// =====================================================
export default function TablesPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTable, setEditTable] = useState<Table | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // جلب الترابيزات
    const fetchTables = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("tables")
                .select("*")
                .order("name");

            if (error) {
                console.error("Error fetching tables:", error);
            } else {
                setTables(data as Table[] || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // حذف ترابيزة
    const deleteTable = async (id: string) => {
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("tables")
                .delete()
                .eq("id", id);

            if (error) {
                alert("حدث خطأ: " + error.message);
            } else {
                alert("تم حذف الترابيزة بنجاح");
                fetchTables();
            }
        } catch (err) {
            console.error(err);
        }
        setShowDeleteConfirm(null);
    };

    // ألوان الأنواع
    const typeColors: Record<string, string> = {
        regular: "bg-blue-100 text-blue-700",
        vip: "bg-yellow-100 text-yellow-700",
        large: "bg-purple-100 text-purple-700",
        private: "bg-green-100 text-green-700"
    };

    const typeLabels: Record<string, string> = {
        regular: "عادية",
        vip: "VIP",
        large: "كبيرة",
        private: "خاصة"
    };

    const statusColors: Record<string, string> = {
        available: "bg-green-100 text-green-700",
        occupied: "bg-red-100 text-red-700",
        maintenance: "bg-gray-100 text-gray-700"
    };

    const statusLabels: Record<string, string> = {
        available: "متاحة",
        occupied: "مشغولة",
        maintenance: "صيانة"
    };

    return (
        <div className="animate-fadeIn">
            {/* العنوان والأزرار */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Table2 className="text-brand-start" />
                        إدارة الترابيزات
                    </h1>
                    <p className="text-gray-500 mt-1">
                        إجمالي الترابيزات: {tables.length}
                    </p>
                </div>
                <button
                    onClick={() => { setEditTable(null); setIsModalOpen(true); }}
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus size={20} />
                    إضافة ترابيزة
                </button>
            </div>

            {/* شبكة الترابيزات */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                    <p className="text-gray-500">جاري التحميل...</p>
                </div>
            ) : tables.length === 0 ? (
                <div className="text-center py-12 glass-card">
                    <Table2 size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-4">لا يوجد ترابيزات</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-gradient"
                    >
                        إضافة أول ترابيزة
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tables.map((table) => (
                        <div key={table.id} className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">{table.name}</h3>
                                <span className={`badge ${statusColors[table.status] || "bg-gray-100"}`}>
                                    {statusLabels[table.status] || table.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">النوع:</span>
                                    <span className={`badge ${typeColors[table.type] || "bg-gray-100"}`}>
                                        {typeLabels[table.type] || table.type}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">السعة:</span>
                                    <span>{table.capacity} أشخاص</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">سعر الساعة:</span>
                                    <span className="font-bold text-brand-start">{table.hourly_rate} ج.م</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setEditTable(table); setIsModalOpen(true); }}
                                    className="btn-glass flex-1 flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={16} />
                                    تعديل
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(table.id)}
                                    className="p-3 rounded-xl hover:bg-red-50 text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal إضافة/تعديل */}
            <TableModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditTable(null); }}
                onSuccess={fetchTables}
                editTable={editTable}
            />

            {/* تأكيد الحذف */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">حذف الترابيزة</h2>
                        <p className="text-gray-500 mb-6">هل أنت متأكد؟</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(null)} className="btn-glass flex-1">
                                إلغاء
                            </button>
                            <button
                                onClick={() => deleteTable(showDeleteConfirm)}
                                className="bg-red-500 text-white px-6 py-3 rounded-xl flex-1 hover:bg-red-600"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
