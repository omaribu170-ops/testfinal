/* =====================================================
   إدارة الجلسات - Sessions Management
   الجلسات النشطة والسجل والفواتير
===================================================== */

"use client";

import { useState, useEffect } from "react";
import {
    Clock,
    Plus,
    Search,
    Download,
    Filter,
    CheckCircle2,
    XCircle,
    Calendar,
    Users,
    Receipt,
    Printer
} from "lucide-react";

// =====================================================
// بيانات تجريبية للجلسات النشطة
// =====================================================
const mockActiveSessions = [
    {
        id: "1",
        table_number: 1,
        table_name: "ترابيزة VIP 1",
        start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // منذ ساعتين
        members: ["أحمد محمد", "سارة أحمد", "محمد علي"],
        price_per_person: 50,
        products: [
            { name: "قهوة", quantity: 3, price: 25 },
            { name: "شاي", quantity: 2, price: 15 },
        ],
    },
    {
        id: "2",
        table_number: 3,
        table_name: "ترابيزة عادية 1",
        start_time: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // منذ 45 دقيقة
        members: ["علي حسن", "نورا سعيد"],
        price_per_person: 30,
        products: [],
    },
    {
        id: "3",
        table_number: 5,
        table_name: "ترابيزة كبيرة",
        start_time: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), // منذ 3.5 ساعة
        members: ["خالد عمر", "أمل حسين", "ياسر محمود", "هدى سمير", "كريم أحمد"],
        price_per_person: 40,
        products: [
            { name: "ساندوتش", quantity: 5, price: 35 },
            { name: "مياه", quantity: 5, price: 10 },
            { name: "قهوة", quantity: 3, price: 25 },
        ],
    },
];

// =====================================================
// بيانات تجريبية لسجل الجلسات
// =====================================================
const mockSessionHistory = [
    {
        id: "h1",
        date: "2024-12-08",
        table_number: 2,
        start_time: "14:30",
        end_time: "17:00",
        members: ["أحمد محمد", "سارة أحمد"],
        total_price: 175,
        payment_method: "cash",
        is_paid: true,
    },
    {
        id: "h2",
        date: "2024-12-08",
        table_number: 1,
        start_time: "10:00",
        end_time: "12:30",
        members: ["محمد علي"],
        total_price: 125,
        payment_method: "visa",
        is_paid: true,
    },
    {
        id: "h3",
        date: "2024-12-07",
        table_number: 4,
        start_time: "16:00",
        end_time: "19:30",
        members: ["نورا سعيد", "علي حسن", "هدى سمير"],
        total_price: 315,
        payment_method: "wallet",
        is_paid: true,
    },
];

// =====================================================
// Timer Component - مكون العد التصاعدي
// =====================================================
function SessionTimer({ startTime }: { startTime: string }) {
    const [elapsed, setElapsed] = useState("00:00:00");

    useEffect(() => {
        const start = new Date(startTime).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diff = now - start;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsed(
                `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    return <span className="timer-display">{elapsed}</span>;
}

// =====================================================
// Modal إضافة جلسة جديدة
// =====================================================
function NewSessionModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [members, setMembers] = useState<string[]>([""]);
    const [products, setProducts] = useState<{ name: string; price: number }[]>([]);

    if (!isOpen) return null;

    const addMember = () => setMembers([...members, ""]);
    const removeMember = (index: number) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const addProduct = () => setProducts([...products, { name: "", price: 0 }]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content max-w-xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-6">إضافة جلسة جديدة</h2>

                <form className="space-y-6">
                    {/* ===== اختيار الترابيزة ===== */}
                    <div>
                        <label className="block text-sm font-medium mb-2">الترابيزة *</label>
                        <select className="input-glass">
                            <option value="">اختر الترابيزة</option>
                            <option value="1">ترابيزة VIP 1 - 50 ج.م/ساعة/فرد</option>
                            <option value="2">ترابيزة VIP 2 - 50 ج.م/ساعة/فرد</option>
                            <option value="3">ترابيزة عادية 1 - 30 ج.م/ساعة/فرد</option>
                            <option value="4">ترابيزة عادية 2 - 30 ج.م/ساعة/فرد</option>
                            <option value="5">ترابيزة كبيرة - 40 ج.م/ساعة/فرد</option>
                        </select>
                    </div>

                    {/* ===== الأعضاء ===== */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">الأعضاء *</label>
                            <button
                                type="button"
                                onClick={addMember}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                + إضافة عضو
                            </button>
                        </div>
                        <div className="space-y-2">
                            {members.map((_, index) => (
                                <div key={index} className="flex gap-2">
                                    <select className="input-glass flex-1">
                                        <option value="">اختر العضو</option>
                                        <option value="1">أحمد محمد</option>
                                        <option value="2">سارة أحمد</option>
                                        <option value="3">محمد علي</option>
                                        <option value="guest">زائر (غير مسجل)</option>
                                    </select>
                                    {members.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMember(index)}
                                            className="p-3 rounded-lg bg-red-50 text-red-500"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ===== المنتجات (اختياري) ===== */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">المنتجات (اختياري)</label>
                            <button
                                type="button"
                                onClick={addProduct}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                + إضافة منتج
                            </button>
                        </div>
                        {products.length > 0 && (
                            <div className="space-y-2">
                                {products.map((_, index) => (
                                    <div key={index} className="flex gap-2">
                                        <select className="input-glass flex-1">
                                            <option value="">اختر المنتج</option>
                                            <option value="coffee">قهوة - 25 ج.م</option>
                                            <option value="tea">شاي - 15 ج.م</option>
                                            <option value="water">مياه - 10 ج.م</option>
                                            <option value="sandwich">ساندوتش - 35 ج.م</option>
                                            <option value="cake">كيكة - 30 ج.م</option>
                                        </select>
                                        <input
                                            type="number"
                                            className="input-glass w-20"
                                            placeholder="الكمية"
                                            min="1"
                                            defaultValue={1}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ===== أزرار الإجراءات ===== */}
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1">
                            بدء الجلسة
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
// Modal إنهاء الجلسة والفاتورة
// =====================================================
function EndSessionModal({
    session,
    onClose
}: {
    session: typeof mockActiveSessions[0] | null;
    onClose: () => void;
}) {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentDetails, setPaymentDetails] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    if (!session) return null;

    // حساب المدة والسعر
    const startTime = new Date(session.start_time);
    const now = new Date();
    const hours = Math.ceil((now.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    const tablePrice = hours * session.price_per_person * session.members.length;
    const productsPrice = session.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalPrice = tablePrice + productsPrice;

    if (isPaid) {
        return (
            <div className="modal-overlay">
                <div className="modal-content text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">تم الدفع بنجاح!</h2>
                    <p className="text-gray-500 mb-6">تم إنهاء الجلسة وتسجيلها في السجل</p>
                    <button onClick={onClose} className="btn-gradient w-full">
                        العودة للوحة التحكم
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content max-w-lg"
                onClick={e => e.stopPropagation()}
            >
                {!showConfirmation ? (
                    <>
                        <h2 className="text-xl font-bold mb-2">إنهاء الجلسة</h2>
                        <p className="text-gray-500 mb-6">هل أنت متأكد من إنهاء هذه الجلسة؟</p>

                        <div className="glass-card p-4 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold">
                                    #{session.table_number}
                                </div>
                                <div>
                                    <p className="font-semibold">{session.table_name}</p>
                                    <p className="text-sm text-gray-500">{session.members.length} أشخاص</p>
                                </div>
                            </div>
                            <SessionTimer startTime={session.start_time} />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={onClose} className="btn-glass flex-1">
                                إلغاء
                            </button>
                            <button
                                onClick={() => setShowConfirmation(true)}
                                className="btn-gradient flex-1"
                            >
                                تأكيد الإنهاء
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* ===== الفاتورة ===== */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Receipt size={24} />
                                الفاتورة
                            </h2>
                            <button className="p-2 rounded-lg hover:bg-gray-100">
                                <Printer size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* بيانات الجلسة */}
                            <div className="bg-white/50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">التاريخ:</span>
                                    <span>{new Date().toLocaleDateString("ar-EG")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">وقت البدء:</span>
                                    <span>{startTime.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">وقت الانتهاء:</span>
                                    <span>{now.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">الترابيزة:</span>
                                    <span>{session.table_name}</span>
                                </div>
                            </div>

                            {/* الأعضاء */}
                            <div className="bg-white/50 rounded-xl p-4">
                                <p className="text-gray-500 text-sm mb-2">الأعضاء:</p>
                                <p>{session.members.join("، ")}</p>
                            </div>

                            {/* تفاصيل السعر */}
                            <div className="bg-white/50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>سعر الترابيزة ({hours} ساعات × {session.members.length} أفراد × {session.price_per_person} ج.م)</span>
                                    <span>{tablePrice} ج.م</span>
                                </div>
                                {session.products.length > 0 && (
                                    <>
                                        <hr className="border-gray-200" />
                                        <p className="text-sm text-gray-500">المنتجات:</p>
                                        {session.products.map((p, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span>{p.name} × {p.quantity}</span>
                                                <span>{p.price * p.quantity} ج.م</span>
                                            </div>
                                        ))}
                                    </>
                                )}
                                <hr className="border-gray-200" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>الإجمالي:</span>
                                    <span className="gradient-text">{totalPrice} ج.م</span>
                                </div>
                            </div>

                            {/* طريقة الدفع */}
                            <div>
                                <label className="block text-sm font-medium mb-2">طريقة الدفع *</label>
                                <select
                                    className="input-glass"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="">اختر طريقة الدفع</option>
                                    <option value="cash">كاش</option>
                                    <option value="visa">فيزا</option>
                                    <option value="wallet">محفظة</option>
                                </select>
                            </div>

                            {/* حقل إضافي حسب طريقة الدفع */}
                            {paymentMethod === "visa" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">اسم صاحب الكارت</label>
                                    <input
                                        type="text"
                                        className="input-glass"
                                        placeholder="أدخل اسم صاحب الكارت"
                                        value={paymentDetails}
                                        onChange={(e) => setPaymentDetails(e.target.value)}
                                    />
                                </div>
                            )}
                            {paymentMethod === "wallet" && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">اسم صاحب التحويل أو رقم المحفظة</label>
                                    <input
                                        type="text"
                                        className="input-glass"
                                        placeholder="أدخل البيانات"
                                        value={paymentDetails}
                                        onChange={(e) => setPaymentDetails(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsPaid(true)}
                            className="btn-gradient w-full"
                            disabled={!paymentMethod}
                        >
                            تأكيد الدفع
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// =====================================================
// صفحة الجلسات الرئيسية
// =====================================================
export default function SessionsPage() {
    const [activeTab, setActiveTab] = useState<"active" | "history">("active");
    const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
    const [sessionToEnd, setSessionToEnd] = useState<typeof mockActiveSessions[0] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    // تصدير CSV
    const exportToCSV = () => {
        const headers = ["التاريخ", "الترابيزة", "وقت البدء", "وقت الانتهاء", "الأعضاء", "الإجمالي", "طريقة الدفع"];
        const data = mockSessionHistory.map(s => [
            s.date, s.table_number, s.start_time, s.end_time, s.members.join(" - "), s.total_price, s.payment_method
        ]);

        const csvContent = [headers.join(","), ...data.map(row => row.join(","))].join("\n");
        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "sessions-history.csv";
        link.click();
    };

    return (
        <div className="animate-fadeIn">
            {/* ===== العنوان والأزرار ===== */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Clock className="text-brand-start" />
                        إدارة الجلسات
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {mockActiveSessions.length} جلسات نشطة
                    </p>
                </div>
                <button
                    onClick={() => setIsNewSessionOpen(true)}
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus size={20} />
                    جلسة جديدة
                </button>
            </div>

            {/* ===== التبويبات ===== */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("active")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "active"
                            ? "bg-brand-gradient text-white"
                            : "glass-card"
                        }`}
                >
                    الجلسات النشطة ({mockActiveSessions.length})
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "history"
                            ? "bg-brand-gradient text-white"
                            : "glass-card"
                        }`}
                >
                    السجل
                </button>
            </div>

            {/* ===== محتوى التبويب النشط ===== */}
            {activeTab === "active" ? (
                /* ===== الجلسات النشطة ===== */
                <div className="space-y-4">
                    {mockActiveSessions.map((session) => (
                        <div
                            key={session.id}
                            className="glass-card p-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold text-xl">
                                    #{session.table_number}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{session.table_name}</h3>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Users size={16} />
                                        <span>{session.members.join("، ")}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        بدء: {new Date(session.start_time).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>

                            <div className="text-center">
                                <SessionTimer startTime={session.start_time} />
                                <p className="text-sm text-gray-500 mt-1">الوقت المنقضي</p>
                            </div>

                            <button
                                onClick={() => setSessionToEnd(session)}
                                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors"
                            >
                                إنهاء الجلسة
                            </button>
                        </div>
                    ))}

                    {mockActiveSessions.length === 0 && (
                        <div className="glass-card p-12 text-center">
                            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">لا توجد جلسات نشطة حالياً</p>
                        </div>
                    )}
                </div>
            ) : (
                /* ===== سجل الجلسات ===== */
                <>
                    {/* الفلاتر */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                className="input-glass pr-12"
                                placeholder="ابحث بالاسم أو رقم الهاتف..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="date"
                                className="input-glass pr-12"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        <button onClick={exportToCSV} className="btn-glass flex items-center gap-2">
                            <Download size={18} />
                            تصدير CSV
                        </button>
                    </div>

                    {/* جدول السجل */}
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>التاريخ</th>
                                        <th>الترابيزة</th>
                                        <th>وقت البدء</th>
                                        <th>وقت الانتهاء</th>
                                        <th>الأعضاء</th>
                                        <th>الإجمالي</th>
                                        <th>طريقة الدفع</th>
                                        <th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockSessionHistory.map((session) => (
                                        <tr key={session.id} className="hover:bg-white/30 transition-colors cursor-pointer">
                                            <td>{session.date}</td>
                                            <td>#{session.table_number}</td>
                                            <td>{session.start_time}</td>
                                            <td>{session.end_time}</td>
                                            <td>{session.members.join("، ")}</td>
                                            <td className="font-medium">{session.total_price} ج.م</td>
                                            <td>
                                                <span className="badge badge-info">
                                                    {session.payment_method === "cash" ? "كاش" :
                                                        session.payment_method === "visa" ? "فيزا" : "محفظة"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-success">تم الدفع</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ===== Modals ===== */}
            <NewSessionModal
                isOpen={isNewSessionOpen}
                onClose={() => setIsNewSessionOpen(false)}
            />

            <EndSessionModal
                session={sessionToEnd}
                onClose={() => setSessionToEnd(null)}
            />
        </div>
    );
}
