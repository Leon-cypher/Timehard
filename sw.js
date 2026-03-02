const CACHE_NAME = 'poker-calc-v1';
const ASSETS = [
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './貓咪.JPG'
];

// 安裝並快取資源
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 啟動時清除舊快取
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

// 攔截請求，優先從快取讀取
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});
