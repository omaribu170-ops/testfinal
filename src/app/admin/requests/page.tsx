/* =====================================================
   طلبات المكان - Requests Management
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, Package, Check, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Request {
    id: string;
    item_name: string;
    quantity: number;
    requested_by: string | null;
    status: string;
    notes: string | null;
    created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-700" },
    approved: { label: "موافق عليه", color: "bg-green-100 text-green-700" },
    rejected: { label: "مرفوض", color: "bg-red-100 text-red-700" },
    ordered: { label: "تم الطلب", color: "bg-blue-100 text-blue-700" }
};

function AddRequestModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ item_name: "", quantity: 1, requested_by: "", notes: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const supabase = createClient();
            await supabase.from("requests").insert({ ...formData, status: "pending" });
            onSuccess();
            onClose();
            setFormData({ item_name: "", quantity: 1, requested_by: "", notes: "" });
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
                <h2 className="text-xl font-bold mb-6">طلب جديد</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">اسم المنتج/الطلب *</label>
                        <input type="text" className="input-glass" value={formData.item_name} onChange={e => setFormData({ ...formData, item_name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">الكمية</label>
                        <input type="number" className="input-glass" min={1} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">مقدم الطلب</label>
                        <input type="text" className="input-glass" value={formData.requested_by} onChange={e => setFormData({ ...formData, requested_by: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">ملاحظات</label>
                        <textarea className="input-glass" rows={2} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "إرسال"}
                        </button>
                        <button type="button" onClick={onClose} className="btn-glass flex-1">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data } = await supabase.from("requests").select("*").order("created_at", { ascending: false });
            setRequests(data as Request[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const updateStatus = async (id: string, status: string) => {
        const supabase = createClient();
        await supabase.from("requests").update({ status }).eq("id", id);
        fetchRequests();
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Package className="text-brand-start" />
                        طلبات المكان
                    </h1>
                    <p className="text-gray-500 mt-1">{requests.length} طلب</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} /> طلب جديد
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" size={40} /></div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 glass-card"><Package size={48} className="mx-auto mb-4 text-gray-400" /><p className="text-gray-500">لا يوجد طلبات</p></div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => {
                        const status = statusLabels[req.status] || statusLabels.pending;
                        return (
                            <div key={req.id} className="glass-card p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold">{req.item_name}</h3>
                                            <span className="text-gray-500">x{req.quantity}</span>
                                            <span className={`badge ${status.color}`}>{status.label}</span>
                                        </div>
                                        {req.notes && <p className="text-sm text-gray-500 mb-1">{req.notes}</p>}
                                        <p className="text-xs text-gray-400">
                                            {req.requested_by && `طلب: ${req.requested_by} | `}
                                            {new Date(req.created_at).toLocaleDateString("ar-EG")}
                                        </p>
                                    </div>
                                    {req.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button onClick={() => updateStatus(req.id, "approved")} className="p-2 hover:bg-green-50 rounded-lg text-green-500"><Check size={18} /></button>
                                            <button onClick={() => updateStatus(req.id, "rejected")} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><X size={18} /></button>
                                        </div>
                                    )}
                                    {req.status === "approved" && (
                                        <button onClick={() => updateStatus(req.id, "ordered")} className="btn-glass text-sm">تم الطلب</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AddRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchRequests} />
        </div>
    );
}
