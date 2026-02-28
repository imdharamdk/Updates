const CACHE_NAME = 'joa-static-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './quiz.html',
  './mock.html',
  './himachal.html',
  './leaderboard.html',
  './login.html',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/dashboard.js',
  './assets/js/auth.js',
  './assets/js/quiz.js',
  './assets/js/mock.js',
  './assets/js/leaderboard.js',
  './assets/js/himachal.js',
  './data/news.json',
  './data/questions.json',
  './data/himachal_gk.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).catch(() => caches.match('./index.html'))
    )
  );
});
