// 統合ストレージマネージャー - 互換性レイヤー
// 新しいモジュール構造への移行用ブリッジ

import { storageManager } from './storage/StorageManager.js';
import { database, auth } from './firebase-config.js';

// グローバル変数への互換性サポート（段階的に削除予定）
window.UnifiedStorageManager = {
    // 初期化
    initialize: async (type = 'auto') => {
        const options = {
            database,
            auth,
            enableRealtimeSync: true
        };
        
        await storageManager.initialize(type, options);
        
        // 互換性のため、グローバルオブジェクトにメソッドを公開
        window.storageManager = storageManager;
        
        return storageManager;
    },
    
    // 商品関連の便利メソッド（既存コードとの互換性）
    getNewProducts: async () => {
        const products = await storageManager.getAll('products');
        return products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);
    },
    
    searchProducts: async (query) => {
        const products = await storageManager.getAll('products');
        const lowerQuery = query.toLowerCase();
        
        return products.filter(product => 
            product.title?.toLowerCase().includes(lowerQuery) ||
            product.description?.toLowerCase().includes(lowerQuery) ||
            product.category?.toLowerCase().includes(lowerQuery)
        );
    },
    
    getProductsByCategory: async (category) => {
        const products = await storageManager.getAll('products');
        return products.filter(product => product.category === category);
    },
    
    // 既存メソッドへのプロキシ
    getAll: (collection) => storageManager.getAll(collection),
    get: (collection, id) => storageManager.get(collection, id),
    add: (collection, item) => storageManager.add(collection, item),
    update: (collection, id, updates) => storageManager.update(collection, id, updates),
    delete: (collection, id) => storageManager.delete(collection, id),
    
    // ユーティリティメソッド
    getAuthGuard: () => storageManager.getAuthGuard(),
    getBackupManager: () => storageManager.getBackupManager(),
    getCacheManager: () => storageManager.getCacheManager(),
    getAdapterType: () => storageManager.getAdapterType()
};

// デフォルトエクスポート（ES6モジュール対応）
export default window.UnifiedStorageManager;

// 名前付きエクスポート（新しいコード用）
export { storageManager };

// 自動初期化（DOMContentLoaded時）
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await window.UnifiedStorageManager.initialize('auto');
            console.info('UnifiedStorageManager自動初期化完了'); // eslint-disable-line no-console
        } catch (error) {
            console.error('UnifiedStorageManager自動初期化エラー:', error); // eslint-disable-line no-console
        }
    });
}