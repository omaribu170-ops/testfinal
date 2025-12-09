/* =====================================================
   إدارة الجلسات - Sessions Management
   بدء وإنهاء جلسات العمل - مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Clock, Play, Square, Plus, Loader2, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// الأنواع
interface Table {
    id: string;
    name: string;
    hourly_rate: number;
    status: string;
}

interface Member {
    id: string;
    name: string;
    phone: string;
    wallet_balance: number;
}

interface Session {
    id: string;
    table_id: string;
    tables: { name: string; hourly_rate: number } | null;
    start_time: string;
    end_time: string | null;
    total_price: number | null;
    is_paid: boolean;
    members: string[];
    payment_method: string | null;
}

// =====================================================
// Timer Component
// =====================================================
function SessionTimer({ startTime }: { startTime: string }) {
    const [elapsed, setElapsed] = useState("");

    useEffect(() => {
        const updateTimer = () => {
            const start = new Date(startTime).getTime();
            const now = Date.now();
            const diff = now - start;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setElapsed(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    return <span className="timer-display">{elapsed}</span>;
}

// =====================================================
// Modal بدء جلسة جديدة
// =====================================================
function NewSessionModal({
    isOpen,
    onClose,
    onSuccess,
    tables,
    members
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    tables: Table[];
    members: Member[];
}) {
    const [loading, setLoading] = useState(false);
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const availableTables = tables.filter(t => t.status === "available");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable) {
            alert("اختر ترابيزة");
            return;
        }
        setLoading(true);

        try {
            const supabase = createClient();

            // إنشاء الجلسة
            const { error } = await supabase
                .from("sessions")
                .insert({
                    table_id: selectedTable,
                    start_time: new Date().toISOString(),
                    members: selectedMembers,
                    is_paid: false
                });

            if (error) {
                alert("حدث خطأ: " + error.message);
            } else {
                // تحديث حالة الترابيزة
                await supabase
                    .from("tables")
                    .update({ status: "occupied" })
                    .eq("id", selectedTable);

                alert("تم بدء الجلسة بنجاح!");
                onSuccess();
                onClose();
                setSelectedTable("");
                setSelectedMembers([]);
            }
        } catch (err) {
            console.error(err);
            alert("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">بدء جلسة جديدة</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">اختر الترابيزة *</label>
                        <select
                            className="input-glass"
                            value={selectedTable}
                            onChange={e => setSelectedTable(e.target.value)}
                            required
                        >
                            <option value="">-- اختر --</option>
                            {availableTables.map(table => (
                                <option key={table.id} value={table.id}>
                                    {table.name} ({table.hourly_rate} ج.م/ساعة)
                                </option>
                            ))}
                        </select>
                        {availableTables.length === 0 && (
                            <p className="text-red-500 text-sm mt-1">لا توجد ترابيزات متاحة</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">الأعضاء (اختياري)</label>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {members.map(member => (
                                <label key={member.id} className="flex items-center gap-2 p-2 bg-white/50 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(member.name)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectedMembers([...selectedMembers, member.name]);
                                            } else {
                                                setSelectedMembers(selectedMembers.filter(m => m !== member.name));
                                            }
                                        }}
                                    />
                                    <span>{member.name}</span>
                                    <span className="text-gray-400 text-sm">({member.phone})</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading || availableTables.length === 0}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "بدء الجلسة"}
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
// Modal إنهاء الجلسة
// =====================================================
function EndSessionModal({
    session,
    onClose,
    onSuccess
}: {
    session: Session | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    if (!session) return null;

    // حساب المدة والتكلفة
    const startTime = new Date(session.start_time).getTime();
    const now = Date.now();
    const durationHours = (now - startTime) / (1000 * 60 * 60);
    const hourlyRate = session.tables?.hourly_rate || 30;
    const totalPrice = Math.ceil(durationHours * hourlyRate);

    const handleEndSession = async () => {
        setLoading(true);

        try {
            const supabase = createClient();

            // تحديث الجلسة
            const { error } = await supabase
                .from("sessions")
                .update({
                    end_time: new Date().toISOString(),
                    total_price: totalPrice,
                    is_paid: true,
                    payment_method: paymentMethod
                })
                .eq("id", session.id);

            if (error) {
                alert("حدث خطأ: " + error.message);
            } else {
                // تحرير الترابيزة
                await supabase
                    .from("tables")
                    .update({ status: "available" })
                    .eq("id", session.table_id);

                alert(`تم إنهاء الجلسة! الإجمالي: ${totalPrice} ج.م`);
                onSuccess();
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6">إنهاء الجلسة</h2>

                <div className="space-y-4">
                    <div className="bg-white/50 rounded-xl p-4 text-center">
                        <p className="text-gray-500 mb-2">الترابيزة</p>
                        <p className="text-xl font-bold">{session.tables?.name || "غير معروف"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/50 rounded-xl p-4 text-center">
                            <p className="text-gray-500 mb-1">المدة</p>
                            <p className="text-lg font-bold">{durationHours.toFixed(1)} ساعة</p>
                        </div>
                        <div className="bg-white/50 rounded-xl p-4 text-center">
                            <p className="text-gray-500 mb-1">السعر</p>
                            <p className="text-lg font-bold gradient-text">{totalPrice} ج.م</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">طريقة الدفع</label>
                        <select
                            className="input-glass"
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                        >
                            <option value="cash">كاش</option>
                            <option value="wallet">من المحفظة</option>
                            <option value="card">بطاقة</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleEndSession}
                            className="btn-gradient flex-1"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : `إنهاء ودفع ${totalPrice} ج.م`}
                        </button>
                        <button onClick={onClose} className="btn-glass flex-1">
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =====================================================
// صفحة الجلسات الرئيسية
// =====================================================
export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [endSession, setEndSession] = useState<Session | null>(null);

    // جلب البيانات
    const fetchData = async () => {
        setLoading(true);
        try {
            const supabase = createClient();

            // جلب الجلسات النشطة
            const { data: sessionsData } = await supabase
                .from("sessions")
                .select("*, tables(name, hourly_rate)")
                .is("end_time", null)
                .order("start_time", { ascending: false });

            // جلب الترابيزات
            const { data: tablesData } = await supabase
                .from("tables")
                .select("*")
                .order("name");

            // جلب الأعضاء
            const { data: membersData } = await supabase
                .from("users")
                .select("id, name, phone, wallet_balance")
                .eq("role", "member");

            setSessions(sessionsData as Session[] || []);
            setTables(tablesData as Table[] || []);
            setMembers(membersData as Member[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="animate-fadeIn">
            {/* العنوان */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Clock className="text-brand-start" />
                        إدارة الجلسات
                    </h1>
                    <p className="text-gray-500 mt-1">
                        الجلسات النشطة: {sessions.length}
                    </p>
                </div>
                <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="btn-gradient flex items-center gap-2"
                >
                    <Plus size={20} />
                    جلسة جديدة
                </button>
            </div>

            {/* الجلسات النشطة */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                    <p className="text-gray-500">جاري التحميل...</p>
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-12 glass-card">
                    <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-4">لا يوجد جلسات نشطة</p>
                    <button
                        onClick={() => setIsNewModalOpen(true)}
                        className="btn-gradient"
                    >
                        بدء جلسة جديدة
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                        <div key={session.id} className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">{session.tables?.name || "غير معروف"}</h3>
                                <span className="badge bg-green-100 text-green-700 flex items-center gap-1">
                                    <Play size={12} />
                                    نشطة
                                </span>
                            </div>

                            <div className="text-center my-6">
                                <SessionTimer startTime={session.start_time} />
                            </div>

                            {session.members && session.members.length > 0 && (
                                <div className="mb-4 flex items-center gap-2 text-gray-500">
                                    <Users size={16} />
                                    <span className="text-sm">{session.members.join("، ")}</span>
                                </div>
                            )}

                            <button
                                onClick={() => setEndSession(session)}
                                className="btn-glass w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50"
                            >
                                <Square size={16} />
                                إنهاء الجلسة
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <NewSessionModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
                onSuccess={fetchData}
                tables={tables}
                members={members}
            />

            <EndSessionModal
                session={endSession}
                onClose={() => setEndSession(null)}
                onSuccess={fetchData}
            />
        </div>
    );
}
