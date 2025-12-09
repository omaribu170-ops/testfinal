/* =====================================================
   نظام المسوقين - Affiliates System
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, Share2, Copy, Loader2, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Affiliate {
    id: string;
    user_id: string | null;
    name: string;
    code: string;
    commission_rate: number;
    total_referrals: number;
    total_earnings: number;
    is_active: boolean;
    created_at: string;
}

function AddAffiliateModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", code: "", commission_rate: 10 });

    const generateCode = () => {
        const code = "HUB" + Math.random().toString(36).substring(2, 8).toUpperCase();
        setFormData({ ...formData, code });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const supabase = createClient();
            await supabase.from("affiliates").insert({
                ...formData,
                total_referrals: 0,
                total_earnings: 0,
                is_active: true
            });
            onSuccess();
            onClose();
            setFormData({ name: "", code: "", commission_rate: 10 });
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
                <h2 className="text-xl font-bold mb-6">مسوق جديد</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">الاسم *</label>
                        <input type="text" className="input-glass" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">كود التسويق *</label>
                        <div className="flex gap-2">
                            <input type="text" className="input-glass flex-1" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required />
                            <button type="button" onClick={generateCode} className="btn-glass">توليد</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">نسبة العمولة (%)</label>
                        <input type="number" className="input-glass" min={0} max={100} value={formData.commission_rate} onChange={e => setFormData({ ...formData, commission_rate: Number(e.target.value) })} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-gradient flex-1" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "إضافة"}
                        </button>
                        <button type="button" onClick={onClose} className="btn-glass flex-1">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAffiliates = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data } = await supabase.from("affiliates").select("*").order("total_earnings", { ascending: false });
            setAffiliates(data as Affiliate[] || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAffiliates(); }, []);

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert("تم نسخ الكود!");
    };

    const toggleActive = async (id: string, is_active: boolean) => {
        const supabase = createClient();
        await supabase.from("affiliates").update({ is_active: !is_active }).eq("id", id);
        fetchAffiliates();
    };

    const totalEarnings = affiliates.reduce((sum, a) => sum + a.total_earnings, 0);
    const totalReferrals = affiliates.reduce((sum, a) => sum + a.total_referrals, 0);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Share2 className="text-brand-start" />
                        المسوقين
                    </h1>
                    <p className="text-gray-500 mt-1">{affiliates.length} مسوق</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-gradient flex items-center gap-2">
                    <Plus size={20} /> مسوق جديد
                </button>
            </div>

            {/* إحصائيات */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-500"><Users className="text-white" size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">إجمالي الإحالات</p>
                            <p className="text-2xl font-bold">{totalReferrals}</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-orange-500"><Share2 className="text-white" size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">إجمالي العمولات</p>
                            <p className="text-2xl font-bold">{totalEarnings} ج.م</p>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12"><Loader2 className="animate-spin mx-auto" size={40} /></div>
            ) : affiliates.length === 0 ? (
                <div className="text-center py-12 glass-card"><Share2 size={48} className="mx-auto mb-4 text-gray-400" /><p className="text-gray-500">لا يوجد مسوقين</p></div>
            ) : (
                <div className="glass-card overflow-hidden">
                    <table className="data-table">
                        <thead><tr><th>الاسم</th><th>الكود</th><th>النسبة</th><th>الإحالات</th><th>الأرباح</th><th>الحالة</th></tr></thead>
                        <tbody>
                            {affiliates.map(aff => (
                                <tr key={aff.id}>
                                    <td className="font-medium">{aff.name}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-gray-100 px-2 py-1 rounded">{aff.code}</code>
                                            <button onClick={() => copyCode(aff.code)} className="p-1 hover:bg-gray-100 rounded"><Copy size={14} /></button>
                                        </div>
                                    </td>
                                    <td>{aff.commission_rate}%</td>
                                    <td>{aff.total_referrals}</td>
                                    <td className="font-bold text-green-600">{aff.total_earnings} ج.م</td>
                                    <td>
                                        <button
                                            onClick={() => toggleActive(aff.id, aff.is_active)}
                                            className={`badge ${aff.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                                        >
                                            {aff.is_active ? "نشط" : "متوقف"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AddAffiliateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchAffiliates} />
        </div>
    );
}
