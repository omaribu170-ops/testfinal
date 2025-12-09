/* =====================================================
   المخزن - Inventory Management
===================================================== */

"use client";

import { useState } from "react";
import { Boxes, Plus, Edit2, AlertTriangle } from "lucide-react";

const mockProducts = [
    { id: "1", name: "قهوة", name_ar: "قهوة", type: "drink", price: 25, cost_price: 10, stock_quantity: 85, min_stock_alert: 20, is_for_sale: true },
    { id: "2", name: "شاي", name_ar: "شاي", type: "drink", price: 15, cost_price: 5, stock_quantity: 120, min_stock_alert: 30, is_for_sale: true },
    { id: "3", name: "مياه", name_ar: "مياه", type: "drink", price: 10, cost_price: 3, stock_quantity: 200, min_stock_alert: 50, is_for_sale: true },
    { id: "4", name: "ساندوتش", name_ar: "ساندوتش", type: "food", price: 35, cost_price: 15, stock_quantity: 25, min_stock_alert: 10, is_for_sale: true },
    { id: "5", name: "كيكة", name_ar: "كيكة", type: "food", price: 30, cost_price: 12, stock_quantity: 8, min_stock_alert: 10, is_for_sale: true },
    { id: "6", name: "مناديل", name_ar: "مناديل", type: "supply", price: 0, cost_price: 15, stock_quantity: 5, min_stock_alert: 10, is_for_sale: false },
];

const typeLabels: Record<string, string> = { food: "طعام", drink: "مشروبات", supply: "مستلزمات", equipment: "معدات" };

export default function InventoryPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState("all");

    const filteredProducts = filter === "all" ? mockProducts : mockProducts.filter(p => p.type === filter);
    const lowStockItems = mockProducts.filter(p => p.stock_quantity <= p.min_stock_alert);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Boxes className="text-brand-start" />
                        المخزن
                    </h1>
                    <p className="text-gray-500 mt-1">إجمالي المنتجات: {mockProducts.length}</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} />
                    إضافة منتج
                </button>
            </div>

            {/* تنبيه المخزون المنخفض */}
            {lowStockItems.length > 0 && (
                <div className="glass-card p-4 mb-6 border-yellow-300 bg-yellow-50/50">
                    <div className="flex items-center gap-2 text-yellow-700">
                        <AlertTriangle size={20} />
                        <span className="font-medium">تنبيه: {lowStockItems.length} منتجات قاربت على النفاد!</span>
                        <span className="text-sm">({lowStockItems.map(p => p.name_ar).join("، ")})</span>
                    </div>
                </div>
            )}

            {/* فلتر النوع */}
            <div className="flex gap-2 mb-6">
                {["all", "drink", "food", "supply", "equipment"].map(type => (
                    <button key={type} onClick={() => setFilter(type)} className={`px-4 py-2 rounded-xl transition-all ${filter === type ? "bg-brand-gradient text-white" : "glass-card"}`}>
                        {type === "all" ? "الكل" : typeLabels[type]}
                    </button>
                ))}
            </div>

            <div className="glass-card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>النوع</th>
                            <th>سعر البيع</th>
                            <th>سعر التكلفة</th>
                            <th>الكمية</th>
                            <th>الحد الأدنى</th>
                            <th>للبيع</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const isLow = product.stock_quantity <= product.min_stock_alert;
                            return (
                                <tr key={product.id} className={isLow ? "bg-yellow-50" : ""}>
                                    <td className="font-medium">{product.name_ar}</td>
                                    <td><span className="badge badge-info">{typeLabels[product.type]}</span></td>
                                    <td>{product.price > 0 ? `${product.price} ج.م` : "-"}</td>
                                    <td>{product.cost_price} ج.م</td>
                                    <td className={isLow ? "text-red-500 font-bold" : ""}>{product.stock_quantity}</td>
                                    <td>{product.min_stock_alert}</td>
                                    <td>{product.is_for_sale ? <span className="badge badge-success">نعم</span> : <span className="badge badge-error">لا</span>}</td>
                                    <td><button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><Edit2 size={18} /></button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal إضافة منتج */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">إضافة منتج جديد</h2>
                        <form className="space-y-4">
                            <div><label className="block text-sm font-medium mb-2">اسم المنتج</label><input type="text" className="input-glass" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-2">النوع</label>
                                    <select className="input-glass">
                                        <option value="drink">مشروبات</option>
                                        <option value="food">طعام</option>
                                        <option value="supply">مستلزمات</option>
                                        <option value="equipment">معدات</option>
                                    </select>
                                </div>
                                <div><label className="block text-sm font-medium mb-2">الكمية</label><input type="number" className="input-glass" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-2">سعر البيع</label><input type="number" className="input-glass" /></div>
                                <div><label className="block text-sm font-medium mb-2">سعر التكلفة</label><input type="number" className="input-glass" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-2">الحد الأدنى للتنبيه</label><input type="number" className="input-glass" /></div>
                                <div className="flex items-center gap-2 pt-6"><input type="checkbox" id="forSale" /><label htmlFor="forSale">متاح للبيع</label></div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-gradient flex-1">إضافة المنتج</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-glass flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
