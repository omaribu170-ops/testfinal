/* =====================================================
   صميده AI - DeepSeek API Route
   POST /api/ai/chat
===================================================== */

import { NextRequest, NextResponse } from "next/server";

// DeepSeek API Configuration
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// System Prompt لصميده
const SYSTEM_PROMPT = `أنت "صميده"، مساعد ذكي ودود في The Hub - مكان للـ co-working والترفيه في مصر.

شخصيتك:
- ودود ومرح، تستخدم اللهجة المصرية العامية
- ذكي ومفيد، تساعد في الدراسة والعمل والبرمجة
- تعرف كل شيء عن The Hub وخدماته
- تشجع المستخدمين على الإنتاجية مع بعض الفكاهة

معلومات عن The Hub:
- مكان للعمل والدراسة مع ترابيزات مختلفة
- أسعار تبدأ من 30 ج.م للساعة
- كل خميس "ليلة ألعاب" مع جوائز
- يوفر قهوة ومشروبات وسناكس
- نظام حجز مسبق متاح

إذا سُئلت عن شيء لا تعرفه، قل أنك ستبحث وترد لاحقاً.
حافظ على ردودك مختصرة ومفيدة.`;

export async function POST(request: NextRequest) {
    try {
        // التحقق من وجود API Key
        if (!DEEPSEEK_API_KEY) {
            return NextResponse.json(
                {
                    error: "AI غير متاح حالياً",
                    message: "لم يتم إعداد مفتاح الـ AI بعد. برجاء التواصل مع الإدارة."
                },
                { status: 503 }
            );
        }

        // قراءة الرسائل من الـ request
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "برجاء إرسال رسائل صحيحة" },
                { status: 400 }
            );
        }

        // إضافة الـ System Prompt
        const fullMessages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
        ];

        // إرسال الطلب لـ DeepSeek
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: fullMessages,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("DeepSeek API Error:", errorData);
            return NextResponse.json(
                { error: "حصل خطأ في الاتصال بالـ AI" },
                { status: 500 }
            );
        }

        const data = await response.json();
        const aiMessage = data.choices[0]?.message?.content || "مش قادر أرد دلوقتي، جرب تاني!";

        return NextResponse.json({
            message: aiMessage,
            usage: data.usage,
        });

    } catch (error) {
        console.error("AI Chat Error:", error);
        return NextResponse.json(
            { error: "حصل خطأ غير متوقع" },
            { status: 500 }
        );
    }
}
