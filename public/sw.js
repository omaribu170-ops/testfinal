/* =====================================================
   Service Worker - للإشعارات و PWA
===================================================== */

const CACHE_NAME = "the-hub-v1";
const urlsToCache = [
    "/",
    "/offline",
    "/manifest.json"
];

// تثبيت Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// استقبال Push Notifications
self.addEventListener("push", (event) => {
    const options = {
        body: event.data ? event.data.text() : "لديك إشعار جديد من The Hub!",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/badge-72x72.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: "open",
                title: "فتح"
            },
            {
                action: "close",
                title: "إغلاق"
            }
        ]
    };

    // محاولة parse البيانات كـ JSON
    try {
        const data = event.data.json();
        options.body = data.body || options.body;
        options.title = data.title || "The Hub";
        if (data.url) {
            options.data.url = data.url;
        }
    } catch (e) {
        // استخدام النص العادي
    }

    event.waitUntil(
        self.registration.showNotification(options.title || "The Hub", options)
    );
});

// التعامل مع النقر على الإشعار
self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.action === "close") {
        return;
    }

    const urlToOpen = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                // البحث عن نافذة مفتوحة
                for (const client of windowClients) {
                    if (client.url === urlToOpen && "focus" in client) {
                        return client.focus();
                    }
                }
                // فتح نافذة جديدة
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// الرد من الـ Cache أو الشبكة
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch(() => {
                // رجوع للصفحة offline إذا فشل
                if (event.request.mode === "navigate") {
                    return caches.match("/offline");
                }
            })
    );
});
