// Firebase v9 Configuration with Environment Variables
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables or defaults (development only)
function getFirebaseConfig() {
    // 環境変数から設定を取得（本番環境推奨）
    if (typeof process !== 'undefined' && process.env) {
        return {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };
    }

    // ブラウザ環境の場合、サーバーから設定を取得することを推奨
    // 開発環境のみの一時的な設定
    const isDevelopment = window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1';

    if (isDevelopment) {
        console.warn('開発環境: Firebase設定をデフォルト値で使用しています。本番環境では環境変数を使用してください。'); // eslint-disable-line no-console
        return {
            apiKey: 'AIzaSyD04IzVBkAOgUCea7hFQLAiajn_uvDz0_0',
            authDomain: 'stamp-e20f2.firebaseapp.com',
            databaseURL: 'https://stamp-e20f2-default-rtdb.asia-southeast1.firebasedatabase.app',
            projectId: 'stamp-e20f2',
            storageBucket: 'stamp-e20f2.firebasestorage.app',
            messagingSenderId: '349999673953',
            appId: '1:349999673953:web:ce05663fe72b6fee3af020',
            measurementId: 'G-T0Z7SF6YCE'
        };
    }

    throw new Error('Firebase設定が見つかりません。環境変数を設定してください。');
}

// Firebase初期化
let app = null;
let analytics = null;
let database = null;
let auth = null;
let storage = null;

try {
    const firebaseConfig = getFirebaseConfig();

    // Firebaseアプリの初期化
    app = initializeApp(firebaseConfig);

    // Firebase servicesの初期化
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
    database = getDatabase(app);
    auth = getAuth(app);
    storage = getStorage(app);
} catch (error) {
    console.error('Firebase初期化エラー:', error); // eslint-disable-line no-console
    // 開発環境でエラーを表示
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Firebase設定を確認してください。.env.exampleを参考に環境変数を設定してください。'); // eslint-disable-line no-console
    }
}

// Admin UID設定（環境変数から取得）
export const ADMIN_UID = process?.env?.ADMIN_UID || '';

// Export services for use in other modules
export { app, analytics, database, auth, storage, getFirebaseConfig };