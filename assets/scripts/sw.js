// Nom du cache
const CACHE_NAME = "game-cache-v1";

// Liste des fichiers à mettre en cache
const FILES_TO_CACHE = [
    "./index.html",
    "./assets/styles/game.css",

    "./assets/scripts/game/main.js",
    "./assets/scripts/game/characters.js",
    "./assets/scripts/game/decoration.js",

    "./assets/game/mario.png",
    "./assets/game/mario_dead.png",
    "./assets/game/bricks.png",
    "./assets/game/cloud.png",
    "./assets/game/bullet.png",
    "./assets/game/goomba.png",
    "./assets/game/banana.png",
    "./assets/game/mario_0.png",
    "./assets/game/mario_1.png",
    "./assets/game/mario_2.png",
    "./assets/game/mario_3.png",
    "./assets/game/mario_4.png",
    "./assets/game/mario_5.png",
    "./assets/game/mario_6.png",
    "./assets/game/mario_7.png",
    "./assets/game/goomba_0.png",
    "./assets/game/goomba_1.png",

    "./assets/icons/mario_128.png",
    "./assets/icons/mario_192.png",
    "./assets/icons/mario_256.png",
    "./assets/icons/mario_512.png",
    "./assets/icons/mario_1024.png",

    "./assets/fonts/SuperMario256.ttf",

    "./manifest.json"
];

// Installation du service worker et mise en cache des fichiers
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation du service worker et suppression des anciens caches
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

// Interception des requêtes réseau
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si la requête est en cache, on renvoie la réponse du cache
      if (cachedResponse) {
        return cachedResponse;
      }
      // Sinon, on effectue une requête réseau et on ajoute la réponse au cache
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
