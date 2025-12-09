/* =====================================================
   صميده AI - المساعد الذكي
   باستخدام DeepSeek API
===================================================== */

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Send, Menu, Plus, Trash2 } from "lucide-react";

// أنواع الرسائل
interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
}

export default function AIPage() {
    // المحادثات
    const [conversations, setConversations] = useState<Conversation[]>([
        { id: "1", title: "محادثة جديدة", messages: [] }
    ]);
    const [currentConvId, setCurrentConvId] = useState("1");
    const [showSidebar, setShowSidebar] = useState(false);

    // الإدخال
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // المحادثة الحالية
    const currentConv = conversations.find(c => c.id === currentConvId);

    // التمرير للأسفل
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentConv?.messages]);

    // إرسال رسالة
    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        // إضافة رسالة المستخدم
        setConversations(prev => prev.map(conv => {
            if (conv.id === currentConvId) {
                return {
                    ...conv,
                    messages: [...conv.messages, { role: "user", content: userMessage }],
                    title: conv.messages.length === 0 ? userMessage.slice(0, 30) : conv.title
                };
            }
            return conv;
        }));

        setIsLoading(true);

        try {
            // محاكاة استجابة (سيتم استبدالها بـ API حقيقي)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiResponse = `أهلاً بيك! أنا صميده، مساعدك الذكي 🧔

سؤالك كان: "${userMessage}"

دلوقتي أنا شغال في وضع المحاكاة. لما يتم ربط DeepSeek API، هقدر أساعدك بشكل أفضل!

تقدر تسألني عن:
- الدراسة والمذاكرة
- البرمجة والتقنية
- أفكار للمشاريع
- أي حاجة محتاج مساعدة فيها!`;

            setConversations(prev => prev.map(conv => {
                if (conv.id === currentConvId) {
                    return {
                        ...conv,
                        messages: [...conv.messages, { role: "assistant", content: aiResponse }]
                    };
                }
                return conv;
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // محادثة جديدة
    const newConversation = () => {
        const newId = Date.now().toString();
        setConversations(prev => [...prev, { id: newId, title: "محادثة جديدة", messages: [] }]);
        setCurrentConvId(newId);
        setShowSidebar(false);
    };

    // حذف محادثة
    const deleteConversation = (id: string) => {
        if (conversations.length <= 1) return;
        setConversations(prev => prev.filter(c => c.id !== id));
        if (currentConvId === id) {
            setCurrentConvId(conversations[0].id === id ? conversations[1].id : conversations[0].id);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* الهيدر */}
            <header className="flex items-center justify-between p-4 glass border-b border-white/20">
                <Link href="/tools" className="p-2 rounded-full hover:bg-white/20">
                    <ArrowRight size={24} />
                </Link>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">🧔</span>
                    صميده AI
                </h1>
                <button onClick={() => setShowSidebar(true)} className="p-2 rounded-full hover:bg-white/20">
                    <Menu size={24} />
                </button>
            </header>

            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentConv?.messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🧔</div>
                        <h2 className="text-xl font-bold mb-2">صميده يساعدك</h2>
                        <p className="text-gray-500">كيف دلوقتي؟</p>
                    </div>
                )}

                {currentConv?.messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user"
                                    ? "bg-brand-gradient text-white rounded-tr-none"
                                    : "glass rounded-tl-none"
                                }`}
                        >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-end">
                        <div className="glass p-4 rounded-2xl rounded-tl-none">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* الإدخال */}
            <div className="p-4 glass border-t border-white/20">
                <div className="flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="اكتب رسالتك هنا..."
                        className="input-glass flex-1 resize-none"
                        rows={1}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="btn-gradient px-4 disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {/* Sidebar المحادثات */}
            {showSidebar && (
                <div className="fixed inset-0 z-50" onClick={() => setShowSidebar(false)}>
                    <div className="absolute inset-0 bg-black/50" />
                    <div
                        className="absolute left-0 top-0 bottom-0 w-72 glass p-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold">المحادثات</h2>
                            <button onClick={newConversation} className="btn-gradient p-2">
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer ${conv.id === currentConvId ? "bg-brand-gradient text-white" : "hover:bg-white/30"
                                        }`}
                                    onClick={() => {
                                        setCurrentConvId(conv.id);
                                        setShowSidebar(false);
                                    }}
                                >
                                    <span className="truncate">{conv.title}</span>
                                    {conversations.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteConversation(conv.id);
                                            }}
                                            className="p-1 hover:bg-white/20 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
