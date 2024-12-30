// Nom du cache
const CACHE_NAME = "game-cache-v1";

// Liste des fichiers à mettre en cache
const FILES_TO_CACHE = [
    "../../index.html",
    "../styles/game.css",

    "../scripts/game/main.js",
    "../scripts/game/characters.js",
    "../scripts/game/decoration.js",

    "../game/mario.png",
    "../game/mario_dead.png",
    "../game/bricks.png",
    "../game/cloud.png",
    "../game/bullet.png",
    "../game/goomba.png",
    "../game/banana.png",
    "../game/mario_0.png",
    "../game/mario_1.png",
    "../game/mario_2.png",
    "../game/mario_3.png",
    "../game/mario_4.png",
    "../game/mario_5.png",
    "../game/mario_6.png",
    "../game/mario_7.png",
    "../game/goomba_0.png",
    "../game/goomba_1.png",

    "../icons/mario_128.png",
    "../icons/mario_192.png",
    "../icons/mario_256.png",
    "../icons/mario_512.png",
    "../icons/mario_1024.png",

    "../fonts/SuperMario256.ttf",

    "../../manifest.json"
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
