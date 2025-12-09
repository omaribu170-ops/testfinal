/* =====================================================
   المتجر - Store Page
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    is_active: boolean;
}

interface CartItem extends Product {
    quantity: number;
}

const categoryLabels: Record<string, string> = {
    drinks: "مشروبات",
    snacks: "سناكس",
    food: "طعام",
    other: "أخرى"
};

export default function StorePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data } = await supabase
                .from("products")
                .select("*")
                .eq("is_active", true)
                .gt("stock", 0)
                .order("name");

            setProducts(data as Product[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.quantity < product.stock) {
                setCart(cart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            }
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: string) => {
        const existing = cart.find(item => item.id === productId);
        if (existing && existing.quantity > 1) {
            setCart(cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ));
        } else {
            setCart(cart.filter(item => item.id !== productId));
        }
    };

    const getQuantity = (productId: string) => {
        return cart.find(item => item.id === productId)?.quantity || 0;
    };

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const categories = ["all", ...new Set(products.map(p => p.category))];

    const filteredProducts = selectedCategory === "all"
        ? products
        : products.filter(p => p.category === selectedCategory);

    const checkout = async () => {
        if (cart.length === 0) return;

        // في الواقع سيتم إنشاء order في قاعدة البيانات
        alert(`تم الطلب بنجاح! الإجمالي: ${totalPrice} ج.م`);
        setCart([]);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pb-32">
            {/* الهيدر */}
            <header className="glass border-b border-white/20 p-4 sticky top-0 z-10">
                <div className="max-w-lg mx-auto flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/20 rounded-xl">
                        <ArrowRight size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">المتجر</h1>
                </div>
            </header>

            <div className="max-w-lg mx-auto px-4 py-6">
                {/* التصنيفات */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl whitespace-nowrap ${selectedCategory === cat
                                    ? "bg-brand-gradient text-white"
                                    : "btn-glass"
                                }`}
                        >
                            {cat === "all" ? "الكل" : categoryLabels[cat] || cat}
                        </button>
                    ))}
                </div>

                {/* المنتجات */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="animate-spin mx-auto" size={40} />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">لا يوجد منتجات</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map(product => {
                            const quantity = getQuantity(product.id);
                            return (
                                <div key={product.id} className="glass-card p-4">
                                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 flex items-center justify-center text-4xl">
                                        {product.category === "drinks" ? "🥤" :
                                            product.category === "snacks" ? "🍿" :
                                                product.category === "food" ? "🍔" : "📦"}
                                    </div>
                                    <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                                    <p className="text-brand-start font-bold">{product.price} ج.م</p>
                                    <p className="text-xs text-gray-500 mb-3">متاح: {product.stock}</p>

                                    {quantity > 0 ? (
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => removeFromCart(product.id)}
                                                className="p-2 bg-red-100 text-red-500 rounded-lg"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-bold">{quantity}</span>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="p-2 bg-green-100 text-green-500 rounded-lg"
                                                disabled={quantity >= product.stock}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="btn-gradient w-full text-sm py-2"
                                        >
                                            إضافة
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* سلة المشتريات */}
            {totalItems > 0 && (
                <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto">
                    <button
                        onClick={checkout}
                        className="btn-gradient w-full py-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <ShoppingCart size={20} />
                            <span>{totalItems} عنصر</span>
                        </div>
                        <span className="font-bold">{totalPrice} ج.م</span>
                    </button>
                </div>
            )}

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 px-6 py-3 safe-bottom">
                <div className="max-w-lg mx-auto flex items-center justify-around">
                    <Link href="/" className="nav-item"><span className="text-2xl">🏠</span></Link>
                    <Link href="/booking" className="nav-item"><span className="text-2xl">📅</span></Link>
                    <Link href="/tools" className="nav-item"><span className="text-2xl">🛠️</span></Link>
                    <Link href="/store" className="nav-item active"><span className="text-2xl">🛒</span></Link>
                    <Link href="/profile" className="nav-item"><span className="text-2xl">👤</span></Link>
                </div>
            </nav>
        </div>
    );
}
