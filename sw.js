const CACHE_NAME = 'budget-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html'
];

// फाइल्स फोनच्या मेमरीमध्ये सेव्ह करणे
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// जुना कॅश काढून नवीन अपडेट करणे
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// इंटरनेट नसताना फोनमधील सेव्ह फाइल्स दाखवणे
self.addEventListener('fetch', (event) => {
  // गुगल शीटची लिंक कॅश करायची नाही
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
