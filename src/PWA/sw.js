import { precacheAndRoute } from 'workbox-precaching';

// Vite inyectará los assets estáticos aquí (HTML, CSS, JS básicos)
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  console.log('Service Worker de la PWA: Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('Service Worker de la PWA: Activado');
});
