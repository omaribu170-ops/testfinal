/* =====================================================
   المتجر - Store Page
   يعمل فقط أثناء الجلسات النشطة
===================================================== */

"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Minus, ShoppingCart, X, AlertCircle } from "lucide-react";

// محاكاة حالة الجلسة - في الواقع ستأتي من API
const hasActiveSession = true;

const mockProducts = [
    { id: "1", name: "قهوة تركي", price: 25, category: "مشروبات", image: "☕" },
    { id: "2", name: "شاي أخضر", price: 15, category: "مشروبات", image: "🍵" },
    { id: "3", name: "مياه معدنية", price: 10, category: "مشروبات", image: "💧" },
    { id: "4", name: "نسكافيه", price: 20, category: "مشروبات", image: "☕" },
    { id: "5", name: "ساندوتش دجاج", price: 35, category: "طعام", image: "🥪" },
    { id: "6", name: "ساندوتش جبنة", price: 30, category: "طعام", image: "🧀" },
    { id: "7", name: "كيكة شوكولاتة", price: 30, category: "حلويات", image: "🍰" },
    { id: "8", name: "كوكيز", price: 20, category: "حلويات", image: "🍪" },
];

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export default function StorePage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [category, setCategory] = useState("all");
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const categories = ["all", "مشروبات", "طعام", "حلويات"];

    const filteredProducts = category === "all"
        ? mockProducts
        : mockProducts.filter(p => p.category === category);

    // إضافة للسلة
    const addToCart = (product: typeof mockProducts[0]) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // تقليل من السلة
    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === productId);
            if (existing && existing.quantity > 1) {
                return prev.map(item =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }
            return prev.filter(item => item.id !== productId);
        });
    };

    // حساب المجموع
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // تأكيد الطلب
    const confirmOrder = () => {
        setOrderConfirmed(true);
        setCart([]);
        setShowCart(false);
        setTimeout(() => setOrderConfirmed(false), 5000);
    };

    // إذا لم يكن هناك جلسة نشطة
    if (!hasActiveSession) {
        return (
            <div className="animate-fadeIn text-center py-12">
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={48} className="text-yellow-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">المتجر غير متاح</h1>
                <p className="text-gray-500 mb-6">المتجر يعمل فقط أثناء جلستك النشطة في المكان</p>
                <p className="text-sm text-gray-400">تعال زورنا وابدأ جلسة جديدة! 🎉</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn pb-24">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingBag className="text-brand-start" />
                    المتجر
                </h1>
            </div>

            {/* تأكيد الطلب */}
            {orderConfirmed && (
                <div className="glass-card p-4 mb-6 bg-green-50 border-green-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        ✓
                    </div>
                    <div>
                        <p className="font-bold text-green-700">تم تأكيد طلبك!</p>
                        <p className="text-sm text-green-600">سيتم إضافته لفاتورة جلستك</p>
                    </div>
                </div>
            )}

            {/* التصنيفات */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${category === cat
                                ? "bg-brand-gradient text-white"
                                : "glass-card"
                            }`}
                    >
                        {cat === "all" ? "الكل" : cat}
                    </button>
                ))}
            </div>

            {/* المنتجات */}
            <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map(product => {
                    const inCart = cart.find(item => item.id === product.id);
                    return (
                        <div key={product.id} className="glass-card p-4">
                            <div className="text-4xl text-center mb-3">{product.image}</div>
                            <h3 className="font-bold text-center mb-1">{product.name}</h3>
                            <p className="text-center text-brand-start font-bold mb-3">{product.price} ج.م</p>

                            {inCart ? (
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => removeFromCart(product.id)}
                                        className="w-8 h-8 rounded-full glass flex items-center justify-center"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="font-bold">{inCart.quantity}</span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full btn-gradient text-sm py-2"
                                >
                                    <Plus size={16} className="inline ml-1" />
                                    أضف
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* زر السلة العائم */}
            {totalItems > 0 && (
                <button
                    onClick={() => setShowCart(true)}
                    className="fixed bottom-24 left-4 right-4 max-w-lg mx-auto btn-gradient flex items-center justify-between shadow-xl"
                >
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} />
                        <span>{totalItems} عناصر</span>
                    </div>
                    <span className="font-bold">{totalPrice} ج.م</span>
                </button>
            )}

            {/* Modal السلة */}
            {showCart && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 glass rounded-t-3xl max-h-[80vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">السلة</h2>
                                <button onClick={() => setShowCart(false)} className="p-2 rounded-full glass">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                        <div>
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.price} ج.م × {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-8 h-8 rounded-full glass flex items-center justify-center"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-6 text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => addToCart({ ...item, category: "", image: "" })}
                                                className="w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>الإجمالي:</span>
                                    <span className="gradient-text">{totalPrice} ج.م</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">سيتم إضافته لفاتورة الجلسة</p>
                            </div>

                            <button onClick={confirmOrder} className="btn-gradient w-full">
                                تأكيد الطلب
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
