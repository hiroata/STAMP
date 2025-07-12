import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { firebaseConfig } from './firebase-config';

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * 新着商品を取得します。
 * @returns {Promise<Array>} 新着商品の配列
 */
export async function getNewProducts() {
    try {
        const snapshot = await get(ref(db, 'products'));
        if (snapshot.exists()) {
            const products = snapshot.val();
            // オブジェクトを配列に変換し、新しい順にソート
            return Object.values(products).sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error getting new products:', error);
        return [];
    }
}

// 他のストレージ管理関数...
