/* =====================================================
   useTimer Hook
   Hook للتايمر (تصاعدي أو تنازلي)
===================================================== */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerOptions {
    // الوقت بالثواني
    initialTime?: number;
    // نوع التايمر
    type?: "countdown" | "countup";
    // وقت البدء (للتايمر التصاعدي)
    startTime?: string | Date;
    // عند انتهاء الوقت
    onComplete?: () => void;
    // تشغيل تلقائي
    autoStart?: boolean;
}

interface UseTimerReturn {
    // الوقت المتبقي/المنقضي بالثواني
    time: number;
    // الوقت منسق
    formatted: string;
    // حالة التشغيل
    isRunning: boolean;
    // التحكم
    start: () => void;
    pause: () => void;
    reset: () => void;
    // النسبة المئوية للتايمر التنازلي
    percentage: number;
}

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
    const {
        initialTime = 0,
        type = "countup",
        startTime,
        onComplete,
        autoStart = false,
    } = options;

    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(autoStart);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // حساب الوقت من تاريخ البدء
    const calculateElapsed = useCallback(() => {
        if (!startTime) return 0;
        const start = new Date(startTime).getTime();
        const now = Date.now();
        return Math.floor((now - start) / 1000);
    }, [startTime]);

    // تهيئة الوقت
    useEffect(() => {
        if (type === "countup" && startTime) {
            setTime(calculateElapsed());
        } else {
            setTime(initialTime);
        }
    }, [type, startTime, initialTime, calculateElapsed]);

    // التايمر
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (type === "countdown") {
                        const newTime = prev - 1;
                        if (newTime <= 0) {
                            setIsRunning(false);
                            onComplete?.();
                            return 0;
                        }
                        return newTime;
                    } else {
                        return prev + 1;
                    }
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, type, onComplete]);

    // التحكم
    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    const reset = useCallback(() => {
        setIsRunning(false);
        if (type === "countup" && startTime) {
            setTime(calculateElapsed());
        } else {
            setTime(initialTime);
        }
    }, [type, startTime, initialTime, calculateElapsed]);

    // تنسيق الوقت
    const formatted = (() => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    })();

    // النسبة المئوية
    const percentage = type === "countdown" && initialTime > 0
        ? ((initialTime - time) / initialTime) * 100
        : 0;

    return {
        time,
        formatted,
        isRunning,
        start,
        pause,
        reset,
        percentage,
    };
}
