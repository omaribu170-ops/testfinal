/* =====================================================
   نظام النظافة - Cleaning System
   Checklist يومي للنظافة
===================================================== */

"use client";

import { useState } from "react";
import {
    Sparkles,
    CheckCircle2,
    XCircle,
    Calendar,
    Clock,
    Download,
    History
} from "lucide-react";

// =====================================================
// توليد الـ time slots
// =====================================================
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 22; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
        if (hour < 22) {
            slots.push(`${hour.toString().padStart(2, "0")}:30`);
        }
    }
    return slots;
};

const timeSlots = generateTimeSlots();
const areas = [
    { id: "bathroom", name: "الحمامات" },
    { id: "hall", name: "القاعة الرئيسية" },
    { id: "kitchen", name: "المطبخ" },
    { id: "entrance", name: "المدخل" },
];

// =====================================================
// بيانات تجريبية
// =====================================================
const mockTodayChecks = timeSlots.slice(0, 8).map((slot, i) => ({
    time_slot: slot,
    areas: areas.map(area => ({
        ...area,
        status: i < 6 ? "checked" : i === 6 ? "missed" : "pending",
        checked_by: i < 6 ? "محمد أحمد" : null,
    })),
}));

const mockHistory = [
    { date: "2024-12-08", completed: 24, missed: 1, total: 25 },
    { date: "2024-12-07", completed: 25, missed: 0, total: 25 },
    { date: "2024-12-06", completed: 23, missed: 2, total: 25 },
    { date: "2024-12-05", completed: 25, missed: 0, total: 25 },
];

// =====================================================
// صفحة النظافة
// =====================================================
export default function CleaningPage() {
    const [activeTab, setActiveTab] = useState<"today" | "history">("today");
    const [selectedDate, setSelectedDate] = useState("");

    // الوقت الحالي
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes() < 30 ? "00" : "30"}`;

    // التحقق إذا كان الـ slot فات وقته
    const isSlotPassed = (slot: string) => {
        return slot < currentTime;
    };

    // التحقق إذا كان الـ slot هو الحالي
    const isCurrentSlot = (slot: string) => {
        const slotHour = parseInt(slot.split(":")[0]);
        const slotMin = parseInt(slot.split(":")[1]);
        const nextSlot = slotMin === 0 ? `${slotHour.toString().padStart(2, "0")}:30` : `${(slotHour + 1).toString().padStart(2, "0")}:00`;
        return slot <= currentTime && currentTime < nextSlot;
    };

    // تصدير PDF
    const exportToPDF = () => {
        alert("سيتم تصدير التقرير كملف PDF");
    };

    return (
        <div className="animate-fadeIn">
            {/* ===== العنوان ===== */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Sparkles className="text-brand-start" />
                        نظام النظافة
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>
                <button onClick={exportToPDF} className="btn-gradient flex items-center gap-2">
                    <Download size={18} />
                    تصدير PDF
                </button>
            </div>

            {/* ===== التبويبات ===== */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("today")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "today"
                            ? "bg-brand-gradient text-white"
                            : "glass-card"
                        }`}
                >
                    <Clock size={18} className="inline-block ml-2" />
                    اليوم الحالي
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "history"
                            ? "bg-brand-gradient text-white"
                            : "glass-card"
                        }`}
                >
                    <History size={18} className="inline-block ml-2" />
                    السجل
                </button>
            </div>

            {activeTab === "today" ? (
                /* ===== checklist اليوم ===== */
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th className="w-24">الوقت</th>
                                    {areas.map(area => (
                                        <th key={area.id}>{area.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((slot) => {
                                    const slotData = mockTodayChecks.find(c => c.time_slot === slot);
                                    const isPassed = isSlotPassed(slot);
                                    const isCurrent = isCurrentSlot(slot);

                                    return (
                                        <tr
                                            key={slot}
                                            className={`transition-colors ${isCurrent ? "bg-yellow-50" : isPassed ? "" : "opacity-50"
                                                }`}
                                        >
                                            <td className={`font-mono ${isCurrent ? "font-bold text-brand-start" : ""}`}>
                                                {slot}
                                                {isCurrent && <span className="text-xs block text-brand-start">الآن</span>}
                                            </td>
                                            {areas.map(area => {
                                                const areaData = slotData?.areas.find(a => a.id === area.id);
                                                const status = areaData?.status || (isPassed ? "missed" : "pending");

                                                return (
                                                    <td key={area.id} className="text-center">
                                                        {status === "checked" ? (
                                                            <button className="p-2 rounded-lg bg-green-100 text-green-600" disabled>
                                                                <CheckCircle2 size={24} />
                                                            </button>
                                                        ) : status === "missed" ? (
                                                            <button className="p-2 rounded-lg bg-red-100 text-red-500" disabled>
                                                                <XCircle size={24} />
                                                            </button>
                                                        ) : isCurrent ? (
                                                            <button className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors animate-pulse">
                                                                <CheckCircle2 size={24} />
                                                            </button>
                                                        ) : (
                                                            <span className="p-2 rounded-lg bg-gray-100 text-gray-400 inline-block">
                                                                <Clock size={24} />
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* زر إتمام اليوم */}
                    <div className="p-4 border-t border-gray-200/50">
                        <button className="btn-gradient w-full">
                            <CheckCircle2 size={20} className="inline-block ml-2" />
                            تم إنهاء جميع مهام النظافة لليوم
                        </button>
                    </div>
                </div>
            ) : (
                /* ===== السجل ===== */
                <>
                    {/* فلتر التاريخ */}
                    <div className="mb-6">
                        <div className="relative max-w-xs">
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="date"
                                className="input-glass pr-12"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* جدول السجل */}
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>التاريخ</th>
                                        <th>المهام المكتملة</th>
                                        <th>المهام الفائتة</th>
                                        <th>الإجمالي</th>
                                        <th>النسبة</th>
                                        <th>الإجراء</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockHistory.map((day) => {
                                        const percentage = ((day.completed / day.total) * 100).toFixed(1);
                                        return (
                                            <tr key={day.date}>
                                                <td>
                                                    {new Date(day.date).toLocaleDateString("ar-EG", {
                                                        weekday: "long",
                                                        month: "short",
                                                        day: "numeric"
                                                    })}
                                                </td>
                                                <td>
                                                    <span className="text-green-600 font-medium">{day.completed}</span>
                                                </td>
                                                <td>
                                                    <span className={day.missed > 0 ? "text-red-500 font-medium" : "text-gray-400"}>
                                                        {day.missed}
                                                    </span>
                                                </td>
                                                <td>{day.total}</td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-brand-gradient"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm">{percentage}%</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="text-blue-500 hover:underline text-sm">
                                                        عرض التفاصيل
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
