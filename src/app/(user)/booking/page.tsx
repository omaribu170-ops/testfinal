/* =====================================================
   صفحة الحجز - Booking Page
   حجز مسبق للترابيزات
===================================================== */

"use client";

import { useState } from "react";
import { Calendar, Clock, Users, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

const mockTables = [
    { id: "1", name: "ترابيزة VIP 1", price: 50, capacity: "2-6", available: true },
    { id: "2", name: "ترابيزة VIP 2", price: 50, capacity: "2-6", available: true },
    { id: "3", name: "ترابيزة عادية 1", price: 30, capacity: "1-4", available: false },
    { id: "4", name: "ترابيزة عادية 2", price: 30, capacity: "1-4", available: true },
    { id: "5", name: "ترابيزة كبيرة", price: 40, capacity: "4-10", available: true },
];

const timeSlots = [
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedTable, setSelectedTable] = useState("");
    const [guests, setGuests] = useState(1);
    const [duration, setDuration] = useState(2);
    const [isConfirmed, setIsConfirmed] = useState(false);

    // توليد أيام الأسبوع القادم
    const getNextDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const days = getNextDays();

    // حساب السعر
    const selectedTableData = mockTables.find(t => t.id === selectedTable);
    const estimatedPrice = selectedTableData ? selectedTableData.price * duration * guests : 0;

    // تأكيد الحجز
    const confirmBooking = () => {
        setIsConfirmed(true);
    };

    if (isConfirmed) {
        return (
            <div className="animate-fadeIn text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">تم الحجز بنجاح! 🎉</h1>
                <p className="text-gray-500 mb-6">سيتم إرسال تأكيد على الإيميل والواتساب</p>

                <div className="glass-card p-6 text-right max-w-sm mx-auto mb-6">
                    <h3 className="font-bold mb-4">تفاصيل الحجز</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">التاريخ:</span>
                            <span>{selectedDate?.toLocaleDateString("ar-EG")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">الوقت:</span>
                            <span>{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">الترابيزة:</span>
                            <span>{selectedTableData?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">عدد الأفراد:</span>
                            <span>{guests}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">المدة:</span>
                            <span>{duration} ساعات</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-bold">
                            <span>السعر المتوقع:</span>
                            <span className="gradient-text">{estimatedPrice} ج.م</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setIsConfirmed(false);
                        setStep(1);
                        setSelectedDate(null);
                        setSelectedTime("");
                        setSelectedTable("");
                    }}
                    className="btn-glass"
                >
                    حجز آخر
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold mb-6">احجز مكانك</h1>

            {/* مؤشر الخطوات */}
            <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map(s => (
                    <div
                        key={s}
                        className={`w-3 h-3 rounded-full transition-all ${s === step ? "w-8 bg-brand-gradient" : s < step ? "bg-green-500" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>

            {/* الخطوة 1: اختيار التاريخ والوقت */}
            {step === 1 && (
                <div className="space-y-6">
                    {/* اختيار اليوم */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Calendar size={20} />
                            اختر اليوم
                        </h3>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {days.map((date, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={`flex-shrink-0 w-16 p-3 rounded-xl text-center transition-all ${selectedDate?.toDateString() === date.toDateString()
                                            ? "bg-brand-gradient text-white"
                                            : "glass-card"
                                        }`}
                                >
                                    <p className="text-xs">{date.toLocaleDateString("ar-EG", { weekday: "short" })}</p>
                                    <p className="text-lg font-bold">{date.getDate()}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* اختيار الوقت */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Clock size={20} />
                            اختر الوقت
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`p-3 rounded-xl text-center transition-all ${selectedTime === time
                                            ? "bg-brand-gradient text-white"
                                            : "glass-card"
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        disabled={!selectedDate || !selectedTime}
                        className="btn-gradient w-full disabled:opacity-50"
                    >
                        التالي
                        <ChevronLeft size={20} className="inline mr-2" />
                    </button>
                </div>
            )}

            {/* الخطوة 2: اختيار الترابيزة */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={() => setStep(1)} className="p-2 rounded-lg glass">
                            <ChevronRight size={20} />
                        </button>
                        <h3 className="font-semibold">اختر الترابيزة</h3>
                    </div>

                    <div className="space-y-3">
                        {mockTables.map(table => (
                            <button
                                key={table.id}
                                onClick={() => table.available && setSelectedTable(table.id)}
                                disabled={!table.available}
                                className={`w-full p-4 rounded-xl text-right transition-all ${selectedTable === table.id
                                        ? "bg-brand-gradient text-white"
                                        : table.available
                                            ? "glass-card hover:scale-[1.02]"
                                            : "glass-card opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">{table.name}</p>
                                        <p className={`text-sm ${selectedTable === table.id ? "text-white/80" : "text-gray-500"}`}>
                                            {table.capacity} أفراد
                                        </p>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">{table.price} ج.م</p>
                                        <p className={`text-sm ${selectedTable === table.id ? "text-white/80" : "text-gray-500"}`}>
                                            للساعة/الفرد
                                        </p>
                                    </div>
                                </div>
                                {!table.available && (
                                    <p className="text-red-500 text-sm mt-2">محجوزة في هذا الوقت</p>
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setStep(3)}
                        disabled={!selectedTable}
                        className="btn-gradient w-full disabled:opacity-50"
                    >
                        التالي
                        <ChevronLeft size={20} className="inline mr-2" />
                    </button>
                </div>
            )}

            {/* الخطوة 3: التفاصيل والتأكيد */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={() => setStep(2)} className="p-2 rounded-lg glass">
                            <ChevronRight size={20} />
                        </button>
                        <h3 className="font-semibold">تفاصيل الحجز</h3>
                    </div>

                    {/* عدد الأفراد */}
                    <div>
                        <label className="block font-medium mb-2 flex items-center gap-2">
                            <Users size={20} />
                            عدد الأفراد
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setGuests(Math.max(1, guests - 1))}
                                className="w-12 h-12 rounded-xl glass font-bold text-xl"
                            >
                                -
                            </button>
                            <span className="text-2xl font-bold w-12 text-center">{guests}</span>
                            <button
                                onClick={() => setGuests(guests + 1)}
                                className="w-12 h-12 rounded-xl glass font-bold text-xl"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* المدة */}
                    <div>
                        <label className="block font-medium mb-2 flex items-center gap-2">
                            <Clock size={20} />
                            المدة (بالساعات)
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setDuration(Math.max(1, duration - 1))}
                                className="w-12 h-12 rounded-xl glass font-bold text-xl"
                            >
                                -
                            </button>
                            <span className="text-2xl font-bold w-12 text-center">{duration}</span>
                            <button
                                onClick={() => setDuration(duration + 1)}
                                className="w-12 h-12 rounded-xl glass font-bold text-xl"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* ملخص السعر */}
                    <div className="glass-card p-4">
                        <h4 className="font-medium mb-3">ملخص الحجز</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">التاريخ:</span>
                                <span>{selectedDate?.toLocaleDateString("ar-EG")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">الوقت:</span>
                                <span>{selectedTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">الترابيزة:</span>
                                <span>{selectedTableData?.name}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>السعر المتوقع:</span>
                                <span className="gradient-text">{estimatedPrice} ج.م</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={confirmBooking} className="btn-gradient w-full">
                        <CheckCircle2 size={20} className="inline ml-2" />
                        تأكيد الحجز
                    </button>
                </div>
            )}
        </div>
    );
}
