/* =====================================================
   Auth Context - إدارة حالة المستخدم
   يوفر بيانات المستخدم لكل التطبيق
===================================================== */

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// نوع البيانات
interface UserProfile {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    role: "admin" | "member";
    wallet_balance: number;
    nickname: string | null;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (phone: string, password: string) => Promise<{ error: string | null }>;
    signUp: (data: { phone: string; password: string; name: string; email?: string }) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

// إنشاء الـ Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// الـ Provider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    // جلب بروفيل المستخدم
    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", userId)
            .single();

        if (data) {
            setProfile(data as UserProfile);
        }
    };

    // تهيئة الـ Auth
    useEffect(() => {
        // جلب الجلسة الحالية
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // الاستماع لتغييرات الـ Auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // تسجيل الدخول
    const signIn = async (phone: string, password: string) => {
        // استخدام البريد الإلكتروني الوهمي المبني على رقم الهاتف
        const email = `${phone}@thehub.local`;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return { error: error.message };
        }

        return { error: null };
    };

    // إنشاء حساب جديد
    const signUp = async (data: { phone: string; password: string; name: string; email?: string }) => {
        // استخدام البريد الإلكتروني الوهمي
        const authEmail = `${data.phone}@thehub.local`;

        // إنشاء حساب في Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: authEmail,
            password: data.password
        });

        if (authError) {
            return { error: authError.message };
        }

        // إنشاء سجل في جدول users
        if (authData.user) {
            const code = "MBR" + Date.now().toString().slice(-6);

            const { error: profileError } = await supabase
                .from("users")
                .insert({
                    auth_id: authData.user.id,
                    name: data.name,
                    phone: data.phone,
                    email: data.email || null,
                    code: code,
                    role: "member",
                    wallet_balance: 0,
                    total_hours: 0,
                    total_spent: 0,
                    game_nights_attended: 0,
                    game_nights_won: 0
                });

            if (profileError) {
                return { error: profileError.message };
            }
        }

        return { error: null };
    };

    // تسجيل الخروج
    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
    };

    // تحديث البروفيل
    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            profile,
            loading,
            signIn,
            signUp,
            signOut,
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook للاستخدام
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
