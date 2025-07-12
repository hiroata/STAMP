// Firebase v9 Configuration
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyD04IzVBkAOgUCea7hFQLAiajn_uvDz0_0',
    authDomain: 'stamp-e20f2.firebaseapp.com',
    databaseURL: 'https://stamp-e20f2-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'stamp-e20f2',
    storageBucket: 'stamp-e20f2.firebasestorage.app',
    messagingSenderId: '349999673953',
    appId: '1:349999673953:web:ce05663fe72b6fee3af020',
    measurementId: 'G-T0Z7SF6YCE'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export services for use in other modules
export { app, analytics, database, auth, storage, firebaseConfig };
