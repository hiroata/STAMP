// Firebase設定
// 警告: 本番環境では環境変数を使用してください
// 開発環境では、.envファイルを作成し、.env.exampleを参考に設定してください
// 本番環境では、ビルドツール（webpack等）または
// サーバーサイドレンダリングを使用して環境変数を注入してください

// 環境変数が利用可能な場合（ビルドツール使用時）
const firebaseConfig =
    typeof process !== 'undefined' && process.env
        ? {
              apiKey: process.env.FIREBASE_API_KEY,
              authDomain: process.env.FIREBASE_AUTH_DOMAIN,
              databaseURL: process.env.FIREBASE_DATABASE_URL,
              projectId: process.env.FIREBASE_PROJECT_ID,
              storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
              messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.FIREBASE_APP_ID
          }
        : {
              // 開発環境用の設定（本番環境では絶対に使用しないでください）
              // TODO: この設定を環境変数に移行してください
              apiKey: 'AIzaSyD04IzVBkAOgUCea7hFQLAiajn_uvDz0_0',
              authDomain: 'stamp-e20f2.firebaseapp.com',
              databaseURL: 'https://stamp-e20f2-default-rtdb.asia-southeast1.firebasedatabase.app',
              projectId: 'stamp-e20f2',
              storageBucket: 'stamp-e20f2.firebasestorage.app',
              messagingSenderId: '349999673953',
              appId: '1:349999673953:web:ce05663fe72b6fee3af020'
          };

// Firebase初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

// Firebase参照をグローバルに公開（各マネージャーで使用）
window.firebaseDatabase = database;
window.firebaseAuth = auth;
window.firebaseStorage = storage;

// FirebaseStorageManagerは削除し、UnifiedStorageManagerを使用
// 詳細はjs/unified-storage.jsを参照
