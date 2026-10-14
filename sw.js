const CACHE_NAME = 'mytieranime-2026-v1';
const ASSETS = [
  './',
  './index.html',
  './css/tokens.css',
  './css/realism-3d.css',
  './css/cards-and-tiers.css',
  './css/modals-and-panels.css',
  './js/utils.js',
  './js/realism-core.js',
  './js/realism-engine.js',
  './js/github-sync.js',
  './js/shikimori-api.js',
  './js/fx-controller.js',
  './js/stats-engine.js',
  './js/drag-drop.js',
  './js/modals.js',
  './js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('data/tiers.json')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});
