/* =====================================================
   صفحة البروفيل - User Profile
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { User, Wallet, Clock, Trophy, Settings, Edit2, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    nickname: string | null;
    wallet_balance: number;
    total_hours: number;
    total_spent: number;
    game_nights_attended: number;
    game_nights_won: number;
    created_at: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", nickname: "", phone: "" });

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const supabase = createClient();

            // للتجريب: جلب أحد الأعضاء
            // في الواقع سيتم استخدام الـ auth.user للحصول على المستخدم الحالي
            const { data } = await supabase
                .from("users")
                .select("*")
                .eq("role", "member")
                .limit(1)
                .single();

            if (data) {
                setProfile(data as UserProfile);
                setEditForm({
                    name: data.name,
                    nickname: data.nickname || "",
                    phone: data.phone
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    const saveProfile = async () => {
        if (!profile) return;
        try {
            const supabase = createClient();
            await supabase
                .from("users")
                .update({
                    name: editForm.name,
                    nickname: editForm.nickname || null,
                    phone: editForm.phone
                })
                .eq("id", profile.id);

            setIsEditing(false);
            fetchProfile();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
                <div className="text-center">
                    <User size={64} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-4">لم يتم تسجيل الدخول</p>
                    <Link href="/login" className="btn-gradient">تسجيل الدخول</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24">
            {/* الهيدر */}
            <div className="bg-brand-gradient pt-12 pb-20 px-4">
                <div className="max-w-lg mx-auto text-center text-white">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 text-4xl font-bold">
                        {profile.name.charAt(0)}
                    </div>
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    {profile.nickname && <p className="opacity-80">&quot;{profile.nickname}&quot;</p>}
                    <p className="opacity-80 mt-1">{profile.phone}</p>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 -mt-12">
                {/* المحفظة */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-green-500">
                                <Wallet className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">رصيد المحفظة</p>
                                <p className="text-2xl font-bold gradient-text">{profile.wallet_balance} ج.م</p>
                            </div>
                        </div>
                        <Link href="/store" className="btn-glass text-sm">شحن الرصيد</Link>
                    </div>
                </div>

                {/* الإحصائيات */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="glass-card p-4 text-center">
                        <Clock className="mx-auto mb-2 text-blue-500" size={24} />
                        <p className="text-2xl font-bold">{profile.total_hours}</p>
                        <p className="text-sm text-gray-500">ساعة</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Wallet className="mx-auto mb-2 text-green-500" size={24} />
                        <p className="text-2xl font-bold">{profile.total_spent}</p>
                        <p className="text-sm text-gray-500">ج.م مصروف</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Trophy className="mx-auto mb-2 text-purple-500" size={24} />
                        <p className="text-2xl font-bold">{profile.game_nights_attended}</p>
                        <p className="text-sm text-gray-500">ليالي ألعاب</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Trophy className="mx-auto mb-2 text-yellow-500" size={24} />
                        <p className="text-2xl font-bold">{profile.game_nights_won}</p>
                        <p className="text-sm text-gray-500">انتصارات</p>
                    </div>
                </div>

                {/* تعديل البروفيل */}
                {isEditing ? (
                    <div className="glass-card p-4 mb-6 space-y-4">
                        <h3 className="font-bold">تعديل البروفيل</h3>
                        <div>
                            <label className="block text-sm mb-1">الاسم</label>
                            <input type="text" className="input-glass" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">الاسم المستعار</label>
                            <input type="text" className="input-glass" value={editForm.nickname} onChange={e => setEditForm({ ...editForm, nickname: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">الهاتف</label>
                            <input type="tel" className="input-glass" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={saveProfile} className="btn-gradient flex-1">حفظ</button>
                            <button onClick={() => setIsEditing(false)} className="btn-glass flex-1">إلغاء</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button onClick={() => setIsEditing(true)} className="glass-card p-4 w-full flex items-center gap-3">
                            <Edit2 size={20} className="text-gray-500" />
                            <span>تعديل البروفيل</span>
                        </button>
                        <button className="glass-card p-4 w-full flex items-center gap-3">
                            <Settings size={20} className="text-gray-500" />
                            <span>الإعدادات</span>
                        </button>
                        <Link href="/login" className="glass-card p-4 w-full flex items-center gap-3 text-red-500">
                            <LogOut size={20} />
                            <span>تسجيل الخروج</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 px-6 py-3 safe-bottom">
                <div className="max-w-lg mx-auto flex items-center justify-around">
                    <Link href="/" className="nav-item"><span className="text-2xl">🏠</span></Link>
                    <Link href="/booking" className="nav-item"><span className="text-2xl">📅</span></Link>
                    <Link href="/tools" className="nav-item"><span className="text-2xl">🛠️</span></Link>
                    <Link href="/store" className="nav-item"><span className="text-2xl">🛒</span></Link>
                    <Link href="/profile" className="nav-item active"><span className="text-2xl">👤</span></Link>
                </div>
            </nav>
        </div>
    );
}
