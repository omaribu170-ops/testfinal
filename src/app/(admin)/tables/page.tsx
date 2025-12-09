/* =====================================================
   إدارة الترابيزات - Tables Management
   عرض وإضافة وتعديل الترابيزات
===================================================== */

"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Table2, TrendingUp } from "lucide-react";

// =====================================================
// بيانات تجريبية للترابيزات
// =====================================================
const mockTables = [
    {
        id: "1",
        name: "ترابيزة VIP 1",
        table_number: 1,
        price_per_hour_per_person: 50,
        capacity_min: 2,
        capacity_max: 6,
        image_url: null,
        is_active: true,
        stats: { daily: 250, monthly: 5200, yearly: 62000 }
    },
    {
        id: "2",
        name: "ترابيزة VIP 2",
        table_number: 2,
        price_per_hour_per_person: 50,
        capacity_min: 2,
        capacity_max: 6,
        image_url: null,
        is_active: true,
        stats: { daily: 200, monthly: 4800, yearly: 58000 }
    },
    {
        id: "3",
        name: "ترابيزة عادية 1",
        table_number: 3,
        price_per_hour_per_person: 30,
        capacity_min: 1,
        capacity_max: 4,
        image_url: null,
        is_active: true,
        stats: { daily: 150, monthly: 3200, yearly: 38000 }
    },
    {
        id: "4",
        name: "ترابيزة عادية 2",
        table_number: 4,
        price_per_hour_per_person: 30,
        capacity_min: 1,
        capacity_max: 4,
        image_url: null,
        is_active: true,
        stats: { daily: 120, monthly: 2800, yearly: 34000 }
    },
    {
        id: "5",
        name: "ترابيزة كبيرة",
        table_number: 5,
        price_per_hour_per_person: 40,
        capacity_min: 4,
        capacity_max: 10,
        image_url: null,
        is_active: true,
        stats: { daily: 180, monthly: 4000, yearly: 48000 }
    },
];

// =====================================================
// Modal إضافة/تعديل ترابيزة
// =====================================================
function TableModal({
    isOpen,
    onClose,
    table
}: {
    isOpen: boolean;
    onClose: () => void;
    table?: typeof mockTables[0] | null;
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">
                    {table ? "تعديل الترابيزة" : "إضافة ترابيزة جديدة"}
                </h2>

                <form className="space-y-4">
                    {/* اسم الترابيزة */}
                    <div>
                        <label className="block text-sm font-medium mb-2">اسم الترابيزة</label>
                        <input
                            type="text"
                            className="input-glass"
                            placeholder="مثال: ترابيزة VIP 1"
                            defaultValue={table?.name || ""}
                        />
                    </div>

                    {/* رقم الترابيزة */}
                    <div>
                        <label className="block text-sm font-medium mb-2">رقم الترابيزة</label>
                        <input
                            type="number"
                            className="input-glass"
                            placeholder="مثال: 1"
                            defaultValue={table?.table_number || ""}
                        />
                    </div>

                    {/* سعر الساعة */}
                    <div>
                        <label className="block text-sm font-medium mb-2">سعر الساعة للفرد (ج.م)</label>
                        <input
                            type="number"
                            className="input-glass"
                            placeholder="مثال: 50"
                            defaultValue={table?.price_per_hour_per_person || ""}
                        />
                    </div>

                    {/* عدد الأفراد */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">أقل عدد أفراد</label>
                            <input
                                type="number"
                                className="input-glass"
                                placeholder="1"
                                defaultValue={table?.capacity_min || 1}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">أكثر عدد أفراد</label>
                            <input
                                type="number"
                                className="input-glass"
                                placeholder="6"
                                defaultValue={table?.capacity_max || ""}
                            />
                        </div>
                    </div>

                    {/* صورة الترابيزة */}
                    <div>
                        <label className="block text-sm font-medium mb-2">صورة الترابيزة (اختياري)</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="input-glass"
                        />
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1">
                            {table ? "حفظ التعديلات" : "إضافة الترابيزة"}
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
// بطاقة ترابيزة
// =====================================================
function TableCard({
    table,
    onEdit,
    onDelete
}: {
    table: typeof mockTables[0];
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="glass-card p-6 hover:scale-[1.02] transition-transform">
            {/* رقم الترابيزة والحالة */}
            <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-xl">
                    #{table.table_number}
                </div>
                <div className="flex gap-2">
                    <button onClick={onEdit} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit2 size={18} className="text-gray-500" />
                    </button>
                    <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={18} className="text-red-500" />
                    </button>
                </div>
            </div>

            {/* اسم وتفاصيل الترابيزة */}
            <h3 className="text-lg font-bold mb-2">{table.name}</h3>
            <div className="space-y-1 text-sm text-gray-500 mb-4">
                <p>السعر: {table.price_per_hour_per_person} ج.م / ساعة / فرد</p>
                <p>السعة: {table.capacity_min} - {table.capacity_max} أفراد</p>
            </div>

            {/* إحصائيات الترابيزة */}
            <div className="pt-4 border-t border-gray-200/50">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-sm font-medium">الإيرادات</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">اليوم</p>
                        <p className="font-bold">{table.stats.daily}</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">الشهر</p>
                        <p className="font-bold">{table.stats.monthly}</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">السنة</p>
                        <p className="font-bold">{table.stats.yearly}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =====================================================
// صفحة الترابيزات الرئيسية
// =====================================================
export default function TablesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<typeof mockTables[0] | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // فتح modal التعديل
    const handleEdit = (table: typeof mockTables[0]) => {
        setSelectedTable(table);
        setIsModalOpen(true);
    };

    // فتح modal الإضافة
    const handleAdd = () => {
        setSelectedTable(null);
        setIsModalOpen(true);
    };

    // إغلاق Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTable(null);
    };

    return (
        <div className="animate-fadeIn">
            {/* ===== العنوان وزر الإضافة ===== */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Table2 className="text-brand-start" />
                        إدارة الترابيزات
                    </h1>
                    <p className="text-gray-500 mt-1">
                        إجمالي الترابيزات: {mockTables.length}
                    </p>
                </div>
                <button onClick={handleAdd} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} />
                    إضافة ترابيزة
                </button>
            </div>

            {/* ===== شبكة الترابيزات ===== */}
            <div className="dashboard-grid">
                {mockTables.map((table) => (
                    <TableCard
                        key={table.id}
                        table={table}
                        onEdit={() => handleEdit(table)}
                        onDelete={() => setShowDeleteConfirm(table.id)}
                    />
                ))}
            </div>

            {/* ===== Modal الإضافة/التعديل ===== */}
            <TableModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                table={selectedTable}
            />

            {/* ===== تأكيد الحذف ===== */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">حذف الترابيزة</h2>
                        <p className="text-gray-500 mb-6">هل أنت متأكد أنك تريد حذف هذه الترابيزة؟ لا يمكن التراجع عن هذا الإجراء.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="btn-glass flex-1"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => {
                                    // هنا سيتم حذف الترابيزة
                                    setShowDeleteConfirm(null);
                                }}
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
