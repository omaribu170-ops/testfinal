/* =====================================================
   Pomodoro Timer - تقنية بومودورو للإنتاجية
===================================================== */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play, Pause, RotateCcw, Settings } from "lucide-react";

export default function PomodoroPage() {
    // الإعدادات
    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [showSettings, setShowSettings] = useState(false);

    // الحالة
    const [isWork, setIsWork] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(workTime * 60);
    const [sessions, setSessions] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // تحديث الوقت المتبقي عند تغيير الإعدادات
    useEffect(() => {
        if (!isRunning) {
            setTimeLeft(isWork ? workTime * 60 : breakTime * 60);
        }
    }, [workTime, breakTime, isWork, isRunning]);

    // المؤقت
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // انتهى الوقت
            if (isWork) {
                setSessions((prev) => prev + 1);
                setIsWork(false);
                setTimeLeft(breakTime * 60);
            } else {
                setIsWork(true);
                setTimeLeft(workTime * 60);
            }
            // تشغيل صوت
            if (typeof window !== "undefined" && "Notification" in window) {
                new Audio("/notification.mp3").play().catch(() => { });
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft, isWork, workTime, breakTime]);

    // تنسيق الوقت
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // حساب النسبة المئوية
    const totalTime = isWork ? workTime * 60 : breakTime * 60;
    const percentage = ((totalTime - timeLeft) / totalTime) * 100;

    // إعادة التعيين
    const reset = () => {
        setIsRunning(false);
        setIsWork(true);
        setTimeLeft(workTime * 60);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* الهيدر */}
            <header className="flex items-center justify-between p-4">
                <Link href="/tools" className="p-2 rounded-full glass">
                    <ArrowRight size={24} />
                </Link>
                <h1 className="text-xl font-bold">Pomodoro Timer</h1>
                <button onClick={() => setShowSettings(true)} className="p-2 rounded-full glass">
                    <Settings size={24} />
                </button>
            </header>

            {/* المحتوى */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* مؤشر الوضع */}
                <div className="mb-8 flex gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${isWork ? "bg-brand-gradient text-white" : "glass"}`}>
                        وقت العمل
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${!isWork ? "bg-green-500 text-white" : "glass"}`}>
                        وقت الراحة
                    </span>
                </div>

                {/* الدائرة */}
                <div className="relative w-64 h-64 mb-8">
                    {/* الخلفية */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            fill="none"
                            stroke="rgba(0,0,0,0.1)"
                            strokeWidth="8"
                        />
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 120}
                            strokeDashoffset={2 * Math.PI * 120 * (1 - percentage / 100)}
                            className="transition-all duration-1000"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#E63E32" />
                                <stop offset="50%" stopColor="#F18A21" />
                                <stop offset="100%" stopColor="#F8C033" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* الوقت */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold font-mono">{formatTime(timeLeft)}</span>
                        <span className="text-gray-500 mt-2">{isWork ? "تركيز!" : "استرح قليلاً"}</span>
                    </div>
                </div>

                {/* الأزرار */}
                <div className="flex gap-4">
                    <button
                        onClick={reset}
                        className="w-14 h-14 rounded-full glass flex items-center justify-center"
                    >
                        <RotateCcw size={24} />
                    </button>
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-lg"
                    >
                        {isRunning ? <Pause size={32} /> : <Play size={32} className="mr-[-4px]" />}
                    </button>
                    <div className="w-14 h-14 flex items-center justify-center">
                        <span className="font-bold text-lg">{sessions}</span>
                        <span className="text-xs text-gray-500 mr-1">جلسة</span>
                    </div>
                </div>
            </div>

            {/* Modal الإعدادات */}
            {showSettings && (
                <div className="modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-6">الإعدادات</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">وقت العمل (دقيقة)</label>
                                <input
                                    type="number"
                                    className="input-glass"
                                    value={workTime}
                                    onChange={(e) => setWorkTime(Number(e.target.value))}
                                    min={1}
                                    max={60}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">وقت الراحة (دقيقة)</label>
                                <input
                                    type="number"
                                    className="input-glass"
                                    value={breakTime}
                                    onChange={(e) => setBreakTime(Number(e.target.value))}
                                    min={1}
                                    max={30}
                                />
                            </div>
                            <button onClick={() => setShowSettings(false)} className="btn-gradient w-full">
                                حفظ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
