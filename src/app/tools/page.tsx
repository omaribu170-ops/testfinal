/* =====================================================
   صفحة الأدوات - Tools Page
===================================================== */

import Link from "next/link";
import { Clock, Brain, FileText } from "lucide-react";

const tools = [
    {
        href: "/tools/pomodoro",
        icon: Clock,
        label: "Pomodoro Timer",
        description: "نظام تقسيم الوقت للإنتاجية",
        color: "from-red-500 to-orange-500"
    },
    {
        href: "/tools/ai",
        icon: Brain,
        label: "صميده AI",
        description: "مساعد ذكي يساعدك في أي شيء",
        color: "from-purple-500 to-pink-500"
    },
    {
        href: "/tools/notes",
        icon: FileText,
        label: "الملاحظات",
        description: "دوّن أفكارك وملاحظاتك",
        color: "from-blue-500 to-cyan-500"
    },
];

export default function ToolsPage() {
    return (
        <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold mb-6">الأدوات</h1>

            <div className="space-y-4">
                {tools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="glass-card p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                                <Icon className="text-white" size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">{tool.label}</h3>
                                <p className="text-gray-500 text-sm">{tool.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
