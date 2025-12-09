/* =====================================================
   Entertainment Hub - ليالي الألعاب
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, Gamepad2, Trash2, Loader2, Trophy, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface GameNight {
    id: string;
    title: string;
    event_date: string;
    game_type: string;
    entry_fee: number;
    max_participants: number;
    prize_pool: number;
    status: string;
    created_at: string;
}

const gameTypes = ["UNO", "Monopoly", "Chess", "PlayStation", "Board Games", "Card Games"];
const statusLabels: Record<string, { label: string; color: string }> = {
    upcoming: { label: "قادم", color: "bg-blue-100 text-blue-700" },
    ongoing: { label: "جاري", color: "bg-green-100 text-green-700" },
    completed: { label: "منتهي", color: "bg-gray-100 text-gray-700" },
    cancelled: { label: "ملغي", color: "bg-red-100 text-red-700" }
};

function AddEventModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "", event_date: "", game_type: "UNO", entry_fee: 50, max_participants: 16, prize_pool: 500
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const supabase = createClient();
            await supabase.from("game_nights").insert({ ...formData, status: "upcoming" });
            onSuccess();
            onClose();
            setFormData({ title: "", event_date: "", game_type: "UNO", entry_fee: 50, max_participants: 16, prize_pool: 500 });
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
                <h2 className="text-xl font-bold mb-6">ليلة ألعاب جديدة</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">عنوان الحدث *</label>
                        <input type="text" className="input-glass" placeholder="مثال: بطولة UNO الأسبوعية" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">التاريخ *</label>
                            <input type="date" className="input-glass" value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">نوع اللعبة</label>
                            <select className="input-glass" value={formData.game_type} onChange={e => setFormData({ ...formData, game_type: e.target.value })}>
                                {gameTypes.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">رسوم الدخول</label>
                            <input type="number" className="input-glass" value={formData.entry_fee} onChange={e => setFormData({ ...formData, entry_fee: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">الحد الأقصى</label>
                            <input type="number" className="input-glass" value={formData.max_participants} onChange={e => setFormData({ ...formData, max_participants: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">الجوائز</label>
                            <input type="number" className="input-glass" value={formData.prize_pool} onChange={e => setFormData({ ...formData, prize_pool: Number(e.target.value) })} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "إنشاء"}
                        </button>
                        <button type="button" onClick={onClose} className="btn-glass flex-1">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function EntertainmentPage() {
    const [events, setEvents] = useState<GameNight[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data } = await supabase.from("game_nights").select("*").order("event_date", { ascending: false });
            setEvents(data as GameNight[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const deleteEvent = async (id: string) => {
        if (!confirm("هل أنت متأكد؟")) return;
        const supabase = createClient();
        await supabase.from("game_nights").delete().eq("id", id);
        fetchEvents();
    };

    const updateStatus = async (id: string, status: string) => {
        const supabase = createClient();
        await supabase.from("game_nights").update({ status }).eq("id", id);
        fetchEvents();
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Gamepad2 className="text-brand-start" />
                        Entertainment Hub
                    </h1>
                    <p className="text-gray-500 mt-1">{events.length} حدث</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} /> ليلة ألعاب جديدة
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" size={40} /></div>
            ) : events.length === 0 ? (
                <div className="text-center py-12 glass-card"><Gamepad2 size={48} className="mx-auto mb-4 text-gray-400" /><p className="text-gray-500">لا يوجد أحداث</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map(event => {
                        const status = statusLabels[event.status] || statusLabels.upcoming;
                        return (
                            <div key={event.id} className="glass-card p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`badge ${status.color}`}>{status.label}</span>
                                    <button onClick={() => deleteEvent(event.id)} className="p-1 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                                </div>
                                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                                <div className="space-y-1 text-sm text-gray-500 mb-4">
                                    <p className="flex items-center gap-2"><Calendar size={14} /> {event.event_date}</p>
                                    <p className="flex items-center gap-2"><Gamepad2 size={14} /> {event.game_type}</p>
                                    <p className="flex items-center gap-2"><Trophy size={14} /> جوائز: {event.prize_pool} ج.م</p>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>رسوم: {event.entry_fee} ج.م</span>
                                    <span>الحد: {event.max_participants} لاعب</span>
                                </div>
                                {event.status === "upcoming" && (
                                    <button onClick={() => updateStatus(event.id, "ongoing")} className="btn-glass w-full mt-4">بدء الحدث</button>
                                )}
                                {event.status === "ongoing" && (
                                    <button onClick={() => updateStatus(event.id, "completed")} className="btn-gradient w-full mt-4">إنهاء</button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchEvents} />
        </div>
    );
}
