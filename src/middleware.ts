/* =====================================================
   Middleware - حماية المسارات
===================================================== */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // تحديث الجلسة إذا انتهت
    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // المسارات المحمية للأدمن
    if (pathname.startsWith("/admin")) {
        if (!user) {
            // الذهاب لصفحة الدخول
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // التحقق من صلاحية الأدمن
        const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

        if (userData?.role !== "admin" && userData?.role !== "super_admin") {
            // ليس لديه صلاحية
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // المسارات المحمية للمستخدمين
    const protectedPaths = ["/profile", "/booking", "/store", "/tools"];
    if (protectedPaths.some(path => pathname.startsWith(path))) {
        if (!user) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // إعادة توجيه المستخدم المسجل من صفحات الدخول
    if ((pathname === "/login" || pathname === "/register") && user) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
