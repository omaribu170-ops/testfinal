/* =====================================================
   Push Notifications Hook
   للسماح بالإشعارات وإرسالها
===================================================== */

"use client";

import { useState, useEffect } from "react";

export function usePushNotifications() {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>("default");

    useEffect(() => {
        // التحقق من دعم المتصفح
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            setPermission(Notification.permission);

            // تسجيل Service Worker
            navigator.serviceWorker.register("/sw.js")
                .then((registration) => {
                    console.log("SW registered:", registration);

                    // الحصول على الاشتراك الحالي
                    return registration.pushManager.getSubscription();
                })
                .then((sub) => {
                    setSubscription(sub);
                })
                .catch((err) => {
                    console.error("SW registration failed:", err);
                });
        }
    }, []);

    // طلب الإذن
    const requestPermission = async () => {
        if (!isSupported) {
            alert("المتصفح لا يدعم الإشعارات");
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === "granted") {
                await subscribeUser();
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error requesting permission:", err);
            return false;
        }
    };

    // الاشتراك في الإشعارات
    const subscribeUser = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;

            // توليد VAPID key (يجب تغييره في الإنتاج)
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

            if (!vapidPublicKey) {
                console.warn("VAPID public key not set");
                return;
            }

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });

            setSubscription(sub);

            // إرسال الاشتراك للسيرفر
            // await fetch("/api/push/subscribe", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(sub)
            // });

            console.log("Push subscription:", sub);
        } catch (err) {
            console.error("Error subscribing:", err);
        }
    };

    // إلغاء الاشتراك
    const unsubscribe = async () => {
        if (subscription) {
            await subscription.unsubscribe();
            setSubscription(null);
        }
    };

    // إرسال إشعار محلي (للتجربة)
    const sendLocalNotification = (title: string, body: string) => {
        if (permission === "granted") {
            new Notification(title, {
                body,
                icon: "/icons/icon-192x192.png"
            });
        }
    };

    return {
        isSupported,
        permission,
        subscription,
        requestPermission,
        unsubscribe,
        sendLocalNotification
    };
}

// تحويل VAPID key
function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
