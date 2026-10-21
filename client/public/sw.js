// OneType Service Worker
const CACHE_NAME = 'onetype-v1.0.0';
const STATIC_CACHE_NAME = 'onetype-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'onetype-dynamic-v1.0.0';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.svg',
  '/assets/sounds/keypress.wav',  // Updated path to match actual sound files in assets folder
  '/assets/sounds/error.wav',      // Updated path to match actual sound files in assets folder
  '/assets/sounds/success.wav'     // Updated path to match actual sound files in assets folder
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }

        // Fetch from network and cache dynamic content
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response for caching
            const responseToCache = networkResponse.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            console.log('Service Worker: Serving from network and caching', request.url);
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback
            console.log('Service Worker: Network failed, serving offline fallback');
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // Return placeholder for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for offline typing data
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'typing-progress-sync') {
    event.waitUntil(syncTypingProgress());
  }
});

// Push notifications for achievements and reminders
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New achievement unlocked!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open-app',
        title: 'Open OneType',
        icon: '/icons/shortcut-lesson.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('OneType', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();

  if (event.action === 'open-app') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync typing progress when back online
async function syncTypingProgress() {
  try {
    // Get stored offline progress
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const offlineData = await cache.match('/offline-progress');
    
    if (offlineData) {
      const progressData = await offlineData.json();
      
      // Send to server when online
      await fetch('/api/sync-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData)
      });
      
      // Clear offline data after successful sync
      await cache.delete('/offline-progress');
      console.log('Service Worker: Progress synced successfully');
    }
  } catch (error) {
    console.error('Service Worker: Failed to sync progress', error);
  }
}

// Handle app updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded successfully');
