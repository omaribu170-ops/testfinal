/* =====================================================
   Supabase Server Configuration
   إعداد اتصال Supabase للـ Server Side
===================================================== */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

// =====================================================
// إنشاء Supabase Client للـ Server
// يستخدم في Server Components و API Routes
// =====================================================
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // يمكن تجاهل هذا الخطأ في Server Components
                        // لأن cookies لا يمكن تعديلها في Server Components
                    }
                },
            },
        }
    )
}
