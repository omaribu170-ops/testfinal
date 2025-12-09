/* =====================================================
   Middleware - معطل مؤقتاً
   تم تعطيله للسماح بالوصول لكل الصفحات أثناء التطوير
===================================================== */

import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // مؤقتاً: السماح لكل الطلبات بالمرور بدون تحقق
    return NextResponse.next();
}

export const config = {
    matcher: [
        // لا يتم تطبيق أي فلتر حالياً
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
