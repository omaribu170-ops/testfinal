/* =====================================================
   useAuth Hook
   Hook للتعامل مع المصادقة
===================================================== */

"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User, Session } from "@supabase/supabase-js";

// نوع السياق
interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

// إنشاء السياق
const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    isLoading: true,
    isAdmin: false,
    signOut: async () => { },
});

// المزود
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // إنشاء Supabase client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // جلب الجلسة الحالية
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user || null);

                if (session?.user) {
                    // التحقق من دور المستخدم
                    const { data: userData } = await supabase
                        .from("users")
                        .select("role")
                        .eq("id", session.user.id)
                        .single();

                    setIsAdmin(userData?.role === "admin" || userData?.role === "super_admin");
                }
            } catch (error) {
                console.error("Auth error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getSession();

        // الاستماع لتغييرات المصادقة
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user || null);

                if (session?.user) {
                    const { data: userData } = await supabase
                        .from("users")
                        .select("role")
                        .eq("id", session.user.id)
                        .single();

                    setIsAdmin(userData?.role === "admin" || userData?.role === "super_admin");
                } else {
                    setIsAdmin(false);
                }

                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    // تسجيل الخروج
    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, session, isLoading, isAdmin, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook للاستخدام
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
