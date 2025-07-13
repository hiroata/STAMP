/**
 * Service Worker for PWA機能
 * ワールドスタンプ広島 オフライン対応・高速化
 */

const CACHE_NAME = 'stamp-hiroshima-v1';
const OFFLINE_URL = '/offline.html';

// キャッシュするリソース
const CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/about.html',
  '/products.html',
  '/category.html',
  '/contact.html',
  '/features.html',
  '/buy.html',
  '/sell.html',
  '/css/common.css',
  '/css/tailwind-compiled.css',
  '/js/components.js',
  '/js/firebase-config.js',
  '/js/main.js',
  '/icon.svg',
  '/favicon.ico'
];

// Service Worker インストール
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app resources');
        return cache.addAll(CACHE_RESOURCES);
      })
      .catch((error) => {
        console.error('[SW] Cache failed:', error);
      })
  );
  
  // 新しいSWを即座に有効化
  self.skipWaiting();
});

// Service Worker アクティブ化
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  
  event.waitUntil(
    // 古いキャッシュを削除
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // 新しいSWを全てのタブで有効化
  self.clients.claim();
});

// リクエストインターセプト
self.addEventListener('fetch', (event) => {
  // NavigationリクエストかつHTMLページの場合
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // オフライン時の代替ページ
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // その他のリクエスト（CSS、JS、画像等）
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにある場合はそれを返す
        if (response) {
          return response;
        }
        
        // キャッシュにない場合はネットワークから取得
        return fetch(event.request)
          .then((response) => {
            // レスポンスが正常でない場合はそのまま返す
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // レスポンスをクローンしてキャッシュに保存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});

// バックグラウンド同期（将来の拡張用）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync');
    // バックグラウンドで同期処理を実行
  }
});

// プッシュ通知（将来の拡張用）
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'ワールドスタンプ広島からのお知らせ',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('ワールドスタンプ広島', options)
  );
});