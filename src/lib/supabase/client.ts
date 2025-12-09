/* =====================================================
   Supabase Client Configuration
   إعداد اتصال Supabase للـ Client Side
===================================================== */

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

// =====================================================
// إنشاء Supabase Client للـ Browser
// يستخدم في الـ Components و Client-side code
// =====================================================
export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

// =====================================================
// Singleton instance للاستخدام المتكرر
// =====================================================
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
    if (!supabaseInstance) {
        supabaseInstance = createClient()
    }
    return supabaseInstance
}
