/* =====================================================
   نظام النظافة - Cleaning System
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check, X, Loader2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface CleaningLog {
    id: string;
    area: string;
    cleaned_by: string | null;
    cleaned_at: string;
    notes: string | null;
    created_at: string;
}

const areas = [
    "المدخل", "منطقة الجلوس الرئيسية", "الحمامات", "المطبخ/الباريستا",
    "ترابيزة VIP 1", "ترابيزة VIP 2", "المخزن", "الممرات"
];

export default function CleaningPage() {
    const [logs, setLogs] = useState<CleaningLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState("");
    const [cleanedBy, setCleanedBy] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const today = new Date().toISOString().split("T")[0];
            const { data } = await supabase
                .from("cleaning_logs")
                .select("*")
                .gte("cleaned_at", today)
                .order("cleaned_at", { ascending: false });
            setLogs(data as CleaningLog[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    const addCleaningLog = async () => {
        if (!selectedArea || !cleanedBy) {
            alert("اختر المنطقة واسم المنظف");
            return;
        }
        try {
            const supabase = createClient();
            await supabase.from("cleaning_logs").insert({
                area: selectedArea,
                cleaned_by: cleanedBy,
                cleaned_at: new Date().toISOString()
            });
            setSelectedArea("");
            setCleanedBy("");
            fetchLogs();
        } catch (err) {
            console.error(err);
        }
    };

    const isAreaCleaned = (area: string) => logs.some(log => log.area === area);

    const getLogForArea = (area: string) => logs.find(log => log.area === area);

    return (
        <div className="animate-fadeIn">
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
            </div>

            {/* إضافة سجل نظافة */}
            <div className="glass-card p-4 mb-6">
                <h3 className="font-bold mb-4">تسجيل نظافة</h3>
                <div className="flex gap-4 flex-wrap">
                    <select
                        className="input-glass flex-1 min-w-[200px]"
                        value={selectedArea}
                        onChange={e => setSelectedArea(e.target.value)}
                    >
                        <option value="">-- اختر المنطقة --</option>
                        {areas.map(area => (
                            <option key={area} value={area} disabled={isAreaCleaned(area)}>
                                {area} {isAreaCleaned(area) ? "✓" : ""}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        className="input-glass flex-1 min-w-[150px]"
                        placeholder="اسم المنظف"
                        value={cleanedBy}
                        onChange={e => setCleanedBy(e.target.value)}
                    />
                    <button onClick={addCleaningLog} className="btn-gradient flex items-center gap-2">
                        <Plus size={18} /> تسجيل
                    </button>
                </div>
            </div>

            {/* قائمة المناطق */}
            {loading ? (
                <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" size={40} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {areas.map(area => {
                        const log = getLogForArea(area);
                        const cleaned = !!log;

                        return (
                            <div
                                key={area}
                                className={`glass-card p-4 ${cleaned ? "bg-green-50/50 border-green-200" : ""}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold">{area}</h3>
                                    {cleaned ? (
                                        <span className="badge bg-green-100 text-green-700 flex items-center gap-1">
                                            <Check size={14} /> نظيف
                                        </span>
                                    ) : (
                                        <span className="badge bg-red-100 text-red-700 flex items-center gap-1">
                                            <X size={14} /> بانتظار
                                        </span>
                                    )}
                                </div>
                                {log && (
                                    <div className="text-sm text-gray-500">
                                        <p>تنظيف بواسطة: {log.cleaned_by}</p>
                                        <p>الوقت: {new Date(log.cleaned_at).toLocaleTimeString("ar-EG")}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ملخص */}
            <div className="mt-6 glass-card p-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">الإجمالي المنظف اليوم:</span>
                    <span className="font-bold text-xl gradient-text">
                        {logs.length} / {areas.length} منطقة
                    </span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-brand-gradient h-full transition-all duration-500"
                        style={{ width: `${(logs.length / areas.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
