const staticCacheName = 'static-v1.0.0';
const dynamicCacheName = 'dynamic-v1.0.0';
const assets = [
    '/',
    '/css/style.css'
];

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});
self.addEventListener('fetch', e => {
    console. log('Service Worker: Fetching');
   e. respondWith (
      fetch(e.request)
        .then(res => {
         // Make copy/clone of response
          const resClone=res.clone();
         // Open cahce
          caches
            .open (cacheName)   
           .then (cache => {
             // Add response to cache
              cache.put(e.request, resClone);
            });
          return res;
        }).catch(err=>caches.match(e.request).then(res=>res))
    );
  });
