/* =====================================================
   صفحة الحجز - Booking Page
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Table2, Loader2, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Table {
    id: string;
    name: string;
    type: string;
    capacity: number;
    hourly_rate: number;
    status: string;
}

interface Booking {
    id: string;
    table_id: string;
    tables: { name: string } | null;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
}

export default function BookingPage() {
    const [tables, setTables] = useState<Table[]>([]);
    const [userBookings, setUserBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [bookingDate, setBookingDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const supabase = createClient();

            // جلب الترابيزات المتاحة
            const { data: tablesData } = await supabase
                .from("tables")
                .select("*")
                .eq("status", "available")
                .order("name");

            // جلب حجوزات المستخدم
            const { data: bookingsData } = await supabase
                .from("bookings")
                .select("*, tables(name)")
                .gte("booking_date", new Date().toISOString().split("T")[0])
                .order("booking_date");

            setTables(tablesData as Table[] || []);
            setUserBookings(bookingsData as Booking[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleBooking = async () => {
        if (!selectedTable || !bookingDate || !startTime || !endTime) {
            alert("يرجى ملء جميع الحقول");
            return;
        }

        setSubmitting(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("bookings")
                .insert({
                    table_id: selectedTable.id,
                    booking_date: bookingDate,
                    start_time: startTime,
                    end_time: endTime,
                    status: "pending"
                });

            if (error) {
                alert("حدث خطأ: " + error.message);
            } else {
                alert("تم إرسال طلب الحجز بنجاح!");
                setSelectedTable(null);
                setBookingDate("");
                setStartTime("");
                setEndTime("");
                fetchData();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const statusLabels: Record<string, { label: string; color: string }> = {
        pending: { label: "قيد المراجعة", color: "bg-yellow-100 text-yellow-700" },
        confirmed: { label: "مؤكد", color: "bg-green-100 text-green-700" },
        cancelled: { label: "ملغي", color: "bg-red-100 text-red-700" }
    };

    const typeLabels: Record<string, string> = {
        regular: "عادية",
        vip: "VIP",
        large: "كبيرة",
        private: "خاصة"
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24">
            {/* الهيدر */}
            <header className="glass border-b border-white/20 p-4 sticky top-0 z-10">
                <div className="max-w-lg mx-auto flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/20 rounded-xl">
                        <ArrowRight size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">حجز ترابيزة</h1>
                </div>
            </header>

            <div className="max-w-lg mx-auto px-4 py-6">
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="animate-spin mx-auto" size={40} />
                    </div>
                ) : (
                    <>
                        {/* نموذج الحجز */}
                        <div className="glass-card p-4 mb-6">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Calendar size={20} />
                                حجز جديد
                            </h2>

                            <div className="space-y-4">
                                {/* اختيار الترابيزة */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">الترابيزة</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {tables.map(table => (
                                            <button
                                                key={table.id}
                                                onClick={() => setSelectedTable(table)}
                                                className={`p-3 rounded-xl text-right ${selectedTable?.id === table.id
                                                        ? "bg-brand-gradient text-white"
                                                        : "bg-white/50 hover:bg-white/70"
                                                    }`}
                                            >
                                                <p className="font-bold">{table.name}</p>
                                                <p className="text-xs opacity-80">
                                                    {typeLabels[table.type]} • {table.capacity} أشخاص
                                                </p>
                                                <p className="text-xs opacity-80">{table.hourly_rate} ج.م/ساعة</p>
                                            </button>
                                        ))}
                                    </div>
                                    {tables.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">لا توجد ترابيزات متاحة</p>
                                    )}
                                </div>

                                {/* التاريخ والوقت */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">التاريخ</label>
                                    <input
                                        type="date"
                                        className="input-glass"
                                        min={new Date().toISOString().split("T")[0]}
                                        value={bookingDate}
                                        onChange={e => setBookingDate(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">من</label>
                                        <input
                                            type="time"
                                            className="input-glass"
                                            value={startTime}
                                            onChange={e => setStartTime(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">إلى</label>
                                        <input
                                            type="time"
                                            className="input-glass"
                                            value={endTime}
                                            onChange={e => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={submitting || !selectedTable}
                                    className="btn-gradient w-full flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                    تأكيد الحجز
                                </button>
                            </div>
                        </div>

                        {/* حجوزاتي */}
                        <div>
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Clock size={20} />
                                حجوزاتي
                            </h2>
                            {userBookings.length === 0 ? (
                                <div className="text-center py-8 glass-card">
                                    <Table2 size={40} className="mx-auto mb-2 text-gray-400" />
                                    <p className="text-gray-500">لا يوجد حجوزات</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {userBookings.map(booking => {
                                        const status = statusLabels[booking.status] || statusLabels.pending;
                                        return (
                                            <div key={booking.id} className="glass-card p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-bold">{booking.tables?.name}</h3>
                                                    <span className={`badge ${status.color}`}>{status.label}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {booking.booking_date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {booking.start_time} - {booking.end_time}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 px-6 py-3 safe-bottom">
                <div className="max-w-lg mx-auto flex items-center justify-around">
                    <Link href="/" className="nav-item"><span className="text-2xl">🏠</span></Link>
                    <Link href="/booking" className="nav-item active"><span className="text-2xl">📅</span></Link>
                    <Link href="/tools" className="nav-item"><span className="text-2xl">🛠️</span></Link>
                    <Link href="/store" className="nav-item"><span className="text-2xl">🛒</span></Link>
                    <Link href="/profile" className="nav-item"><span className="text-2xl">👤</span></Link>
                </div>
            </nav>
        </div>
    );
}
