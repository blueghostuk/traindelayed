var version = "v1";
this.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(version).then(function (cache) {
            return cache.addAll([
                '/Scripts/libs.es5.min.js',

                '/Scripts/app/common.js',
                '/Scripts/app/index-page.js',
                '/Scripts/app/search-schedule.js',
                '/Scripts/app/searchModels.js',
                '/Scripts/app/stations.js',
                '/Scripts/app/Tocs.js',
                '/Scripts/app/webApi.js',

                '/about/index.html',
                '/search-results/index.html',
                '/index.html'
            ])
        }));
});

this.addEventListener('fetch', function (event) {
    var response;
    event.respondWith(caches.match(event.request).catch(function () {
        return fetch(event.request);
    }).then(function (r) {
        response = r;
        caches.open(version).then(function (cache) {
            cache.put(event.request, response);
        });
        return response.clone();
    }));
});

this.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName != version;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                }));
        }));
});