/* =====================================================
   Entertainment Hub - ليالي الألعاب والبطولات
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Gamepad2, Plus, Trophy, Users, Calendar, Clock, CheckCircle2 } from "lucide-react";

// بيانات تجريبية
const upcomingGameNight = {
    id: "next",
    title: "ليلة الألعاب الكبرى",
    event_date: "2024-12-14",
    start_time: "18:00",
    tournaments: [
        { game_name: "UNO", prize_first: 500, prize_second: 200, prize_third: 100 },
        { game_name: "شطرنج", prize_first: 300, prize_second: 150, prize_third: 50 },
    ],
};

const pastGameNights = [
    {
        id: "1", title: "ليلة بورد جيمز", event_date: "2024-12-07", participants: 24, total_prizes: 1500, tournaments: [
            { game_name: "مونوبولي", winners: [{ name: "أحمد محمد", rank: 1, prize: 500 }, { name: "سارة أحمد", rank: 2, prize: 200 }] },
        ]
    },
    {
        id: "2", title: "ليلة الكارت جيمز", event_date: "2024-11-30", participants: 18, total_prizes: 1200, tournaments: [
            { game_name: "UNO", winners: [{ name: "خالد عمر", rank: 1, prize: 400 }, { name: "نورا سعيد", rank: 2, prize: 200 }] },
        ]
    },
];

// Countdown Component
function Countdown({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const target = new Date(targetDate).getTime();
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = target - now;
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex gap-4 justify-center">
            {[
                { value: timeLeft.days, label: "يوم" },
                { value: timeLeft.hours, label: "ساعة" },
                { value: timeLeft.minutes, label: "دقيقة" },
                { value: timeLeft.seconds, label: "ثانية" },
            ].map((item, i) => (
                <div key={i} className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-2xl font-bold">
                        {item.value.toString().padStart(2, "0")}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.label}</p>
                </div>
            ))}
        </div>
    );
}

export default function EntertainmentPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGameNight, setSelectedGameNight] = useState<typeof pastGameNights[0] | null>(null);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Gamepad2 className="text-brand-start" />
                        Entertainment Hub
                    </h1>
                    <p className="text-gray-500 mt-1">إدارة ليالي الألعاب والبطولات</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} />
                    بطولة جديدة
                </button>
            </div>

            {/* البطولة القادمة */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">البطولة القادمة</h2>
                <div className="glass-card p-8 text-center">
                    <h3 className="text-2xl font-bold gradient-text mb-2">{upcomingGameNight.title}</h3>
                    <p className="text-gray-500 mb-6 flex items-center justify-center gap-2">
                        <Calendar size={18} />
                        {new Date(upcomingGameNight.event_date).toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        <Clock size={18} className="mr-2" />
                        {upcomingGameNight.start_time}
                    </p>
                    <Countdown targetDate={`${upcomingGameNight.event_date}T${upcomingGameNight.start_time}`} />
                    <div className="mt-6 flex gap-4 justify-center">
                        {upcomingGameNight.tournaments.map((t, i) => (
                            <div key={i} className="bg-white/50 rounded-xl p-4">
                                <p className="font-bold">{t.game_name}</p>
                                <p className="text-sm text-gray-500">🥇 {t.prize_first} | 🥈 {t.prize_second} | 🥉 {t.prize_third}</p>
                            </div>
                        ))}
                    </div>
                    <button className="btn-glass mt-6">
                        <Users size={18} className="inline ml-2" />
                        إضافة مشاركين
                    </button>
                </div>
            </section>

            {/* سجل البطولات */}
            <section>
                <h2 className="text-xl font-semibold mb-4">سجل ليالي الألعاب</h2>
                <div className="glass-card overflow-hidden">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>الاسم</th>
                                <th>التاريخ</th>
                                <th>المشاركين</th>
                                <th>إجمالي الجوائز</th>
                                <th>الإجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pastGameNights.map((gn) => (
                                <tr key={gn.id}>
                                    <td className="font-medium">{gn.title}</td>
                                    <td>{new Date(gn.event_date).toLocaleDateString("ar-EG")}</td>
                                    <td>{gn.participants}</td>
                                    <td>{gn.total_prizes} ج.م</td>
                                    <td><button onClick={() => setSelectedGameNight(gn)} className="text-blue-500 hover:underline">التفاصيل</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal إضافة بطولة */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content max-w-xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">إضافة بطولة جديدة</h2>
                        <form className="space-y-4">
                            <div><label className="block text-sm font-medium mb-2">اسم البطولة</label><input type="text" className="input-glass" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-2">التاريخ</label><input type="date" className="input-glass" /></div>
                                <div><label className="block text-sm font-medium mb-2">الوقت</label><input type="time" className="input-glass" /></div>
                            </div>
                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-medium mb-3">الألعاب والجوائز</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-4 gap-2">
                                        <input type="text" className="input-glass" placeholder="اسم اللعبة" />
                                        <input type="number" className="input-glass" placeholder="🥇 الأول" />
                                        <input type="number" className="input-glass" placeholder="🥈 الثاني" />
                                        <input type="number" className="input-glass" placeholder="🥉 الثالث" />
                                    </div>
                                </div>
                                <button type="button" className="text-blue-500 text-sm mt-2">+ إضافة لعبة أخرى</button>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-gradient flex-1">إنشاء البطولة</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-glass flex-1">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal تفاصيل ليلة ألعاب */}
            {selectedGameNight && (
                <div className="modal-overlay" onClick={() => setSelectedGameNight(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">{selectedGameNight.title}</h2>
                        <p className="text-gray-500 mb-6">{new Date(selectedGameNight.event_date).toLocaleDateString("ar-EG")}</p>
                        {selectedGameNight.tournaments.map((t, i) => (
                            <div key={i} className="mb-4">
                                <h3 className="font-bold flex items-center gap-2"><Trophy size={18} className="text-yellow-500" />{t.game_name}</h3>
                                <div className="space-y-2 mt-2">
                                    {t.winners.map((w, j) => (
                                        <div key={j} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                            <span className="flex items-center gap-2">{w.rank === 1 ? "🥇" : w.rank === 2 ? "🥈" : "🥉"} {w.name}</span>
                                            <span className="font-bold">{w.prize} ج.م</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setSelectedGameNight(null)} className="btn-glass w-full mt-4">إغلاق</button>
                    </div>
                </div>
            )}
        </div>
    );
}
