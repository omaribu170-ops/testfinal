/* =====================================================
   الصفحة الرئيسية - Home Page
   نفس محتوى صفحة المستخدم السابقة
===================================================== */

import Link from "next/link";
import { Clock, Brain, FileText, ChevronLeft, Bell } from "lucide-react";

const tools = [
  { href: "/tools/pomodoro", icon: Clock, label: "Pomodoro Timer", color: "bg-red-500" },
  { href: "/tools/ai", icon: Brain, label: "صميده AI", color: "bg-purple-500" },
  { href: "/tools/notes", icon: FileText, label: "الملاحظات", color: "bg-blue-500" },
];

const banners = [
  { id: 1, title: "عرض خاص!", description: "ساعتين بسعر ساعة كل يوم أحد", bgColor: "from-brand-start to-brand-end" },
  { id: 2, title: "ليلة ألعاب قريباً", description: "انضم لبطولة UNO يوم الخميس", bgColor: "from-purple-500 to-pink-500" },
];

export default function HomePage() {
  const firstName = "أحمد";

  return (
    <div className="animate-fadeIn max-w-lg mx-auto px-4 py-6 pb-24">
      {/* الهيدر */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">The Hub</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/notifications" className="p-2 rounded-full glass hover:scale-105 transition-transform relative">
            <Bell size={22} />
            <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <Link href="/profile" className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold">
            {firstName.charAt(0)}
          </Link>
        </div>
      </header>

      {/* الترحيب */}
      <section className="mb-6">
        <h2 className="text-xl">
          أهلاً يا <span className="font-bold">{firstName}</span> 👋
        </h2>
        <p className="text-gray-500 text-sm">نتمنى لك يوم مثمر!</p>
      </section>

      {/* بانرات العروض */}
      <section className="mb-8">
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`flex-shrink-0 w-72 h-32 rounded-2xl bg-gradient-to-r ${banner.bgColor} p-6 text-white snap-center`}
            >
              <h3 className="text-lg font-bold mb-1">{banner.title}</h3>
              <p className="text-sm opacity-90">{banner.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* الأدوات */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">استخدم أدواتنا</h3>
          <Link href="/tools" className="text-sm text-gray-500 flex items-center gap-1">
            الكل <ChevronLeft size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="glass-card p-4 text-center hover:scale-105 transition-transform"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="text-white" size={24} />
                </div>
                <p className="text-sm font-medium">{tool.label}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* أخبار وعروض */}
      <section>
        <h3 className="text-lg font-semibold mb-4">أخبار وعروض</h3>
        <div className="space-y-3">
          <Link href="/booking" className="glass-card p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-start to-brand-end flex items-center justify-center text-white text-2xl">
              🎮
            </div>
            <div className="flex-1">
              <h4 className="font-bold">بطولة UNO القادمة</h4>
              <p className="text-sm text-gray-500">الخميس 14 ديسمبر - الجوائز 1500 ج.م</p>
            </div>
            <ChevronLeft className="text-gray-400" />
          </Link>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl">
              ☕
            </div>
            <div className="flex-1">
              <h4 className="font-bold">قهوة مجانية</h4>
              <p className="text-sm text-gray-500">مع كل جلسة 3 ساعات أو أكثر</p>
            </div>
            <ChevronLeft className="text-gray-400" />
          </div>
        </div>
      </section>

      {/* Navbar السفلي */}
      <nav className="fixed bottom-0 right-0 left-0 glass border-t border-white/20 z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center py-2">
          <Link href="/" className="flex flex-col items-center gap-1 p-2 text-brand-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            <span className="text-xs">الرئيسية</span>
          </Link>
          <Link href="/tools" className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            <span className="text-xs">الأدوات</span>
          </Link>
          <Link href="/booking" className="bg-brand-gradient text-white px-6 py-3 -mt-6 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          </Link>
          <Link href="/store" className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            <span className="text-xs">المتجر</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span className="text-xs">حسابي</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
