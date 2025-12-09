/* =====================================================
   إدارة المخزن - Inventory Management
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, Package, Edit2, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    is_active: boolean;
    created_at: string;
}

const productCategories = [
    { value: "drinks", label: "مشروبات" },
    { value: "snacks", label: "سناكس" },
    { value: "food", label: "طعام" },
    { value: "other", label: "أخرى" }
];

// =====================================================
// Modal إضافة/تعديل منتج
// =====================================================
function ProductModal({
    isOpen,
    onClose,
    onSuccess,
    editProduct
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editProduct: Product | null;
}) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "drinks",
        price: 0,
        cost: 0,
        stock: 0,
        is_active: true
    });

    useEffect(() => {
        if (editProduct) {
            setFormData({
                name: editProduct.name,
                category: editProduct.category,
                price: editProduct.price,
                cost: editProduct.cost,
                stock: editProduct.stock,
                is_active: editProduct.is_active
            });
        } else {
            setFormData({ name: "", category: "drinks", price: 0, cost: 0, stock: 0, is_active: true });
        }
    }, [editProduct]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();

            if (editProduct) {
                const { error } = await supabase
                    .from("products")
                    .update(formData)
                    .eq("id", editProduct.id);

                if (!error) {
                    alert("تم تعديل المنتج!");
                    onSuccess();
                    onClose();
                } else {
                    alert("خطأ: " + error.message);
                }
            } else {
                const { error } = await supabase
                    .from("products")
                    .insert(formData);

                if (!error) {
                    alert("تم إضافة المنتج!");
                    onSuccess();
                    onClose();
                } else {
                    alert("خطأ: " + error.message);
                }
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
                <h2 className="text-xl font-bold mb-6">
                    {editProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">اسم المنتج *</label>
                        <input
                            type="text"
                            className="input-glass"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">التصنيف</label>
                        <select
                            className="input-glass"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {productCategories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">سعر البيع (ج.م)</label>
                            <input
                                type="number"
                                className="input-glass"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">التكلفة (ج.م)</label>
                            <input
                                type="number"
                                className="input-glass"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
                                min={0}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">الكمية بالمخزن</label>
                        <input
                            type="number"
                            className="input-glass"
                            value={formData.stock}
                            onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                            min={0}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "حفظ"}
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
export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data } = await supabase
                .from("products")
                .select("*")
                .order("name");

            setProducts(data as Product[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id: string) => {
        if (!confirm("هل أنت متأكد؟")) return;

        const supabase = createClient();
        const { error } = await supabase.from("products").delete().eq("id", id);

        if (!error) {
            alert("تم الحذف");
            fetchProducts();
        }
    };

    const getCategoryLabel = (val: string) => productCategories.find(c => c.value === val)?.label || val;

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="text-brand-start" />
                        المخزن
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {products.length} منتج
                    </p>
                </div>
                <button
                    onClick={() => { setEditProduct(null); setIsModalOpen(true); }}
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus size={20} />
                    إضافة منتج
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto" size={40} />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 glass-card">
                    <Package size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">لا يوجد منتجات</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                        <div key={product.id} className="glass-card p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold">{product.name}</h3>
                                <span className="badge bg-gray-100">{getCategoryLabel(product.category)}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                                <div className="text-center">
                                    <p className="text-gray-500">السعر</p>
                                    <p className="font-bold text-green-600">{product.price} ج.م</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500">التكلفة</p>
                                    <p className="font-bold">{product.cost} ج.م</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500">الكمية</p>
                                    <p className={`font-bold ${product.stock < 5 ? "text-red-500" : ""}`}>
                                        {product.stock}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setEditProduct(product); setIsModalOpen(true); }}
                                    className="btn-glass flex-1 flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={14} />
                                    تعديل
                                </button>
                                <button
                                    onClick={() => deleteProduct(product.id)}
                                    className="p-2 hover:bg-red-50 rounded-xl text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditProduct(null); }}
                onSuccess={fetchProducts}
                editProduct={editProduct}
            />
        </div>
    );
}
