const CACHE_NAME = 'himnario-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap',
  'https://i.postimg.cc/14xJ49F9/LOGO-Himnario-Cristiano.png'
];

// Instalación del Service Worker y guardado en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar peticiones para que funcione offline
self.addEventListener('fetch', event => {
  // No cachear los archivos de audio de Dropbox (por CORS y tamaño)
  if (event.request.url.includes('dropbox.com') || event.request.url.includes('dropboxusercontent.com')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve la respuesta en caché si existe, si no, hace la petición a la red
        return response || fetch(event.request);
      })
  );
});

// Actualizar el caché cuando hay cambios
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
