// \u064a\u062e\u0632\u0651\u0646 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0639\u0644\u0649 \u0627\u0644\u062c\u0647\u0627\u0632 \u0644\u064a\u0639\u0645\u0644 \u0628\u062f\u0648\u0646 \u0625\u0646\u062a\u0631\u0646\u062a.
var CACHE = 'abu-yara-budget-8055191843';
var ASSETS = ['./', './index.html', './manifest.webmanifest',
              './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
    .then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; })
      .map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function(hit){
    return hit || fetch(e.request).then(function(res){
      if(res && res.ok && new URL(e.request.url).origin === location.origin){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      }
      return res;
    })['catch'](function(){ return caches.match('./index.html'); });
  }));
});
