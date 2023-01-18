const cacheName = 'news-v1';
const staticAssets = [
    './',
    './index.html',
    './style.css',
    './index.js',
    './api.js',
    './components/news-article.js'
];
const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
};
self.addEventListener('install', (event)=> {
    
    event.waitUntil(
        addResourcesToCache(staticAssets)
    );
    self.skipWaiting();
    console.log("mon swv v2");
});

self.addEventListener('activate', e => {
    self.clients.claim(); //claim clients
    console.log("activated");
});

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req){
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}