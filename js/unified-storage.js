// 統合ストレージマネージャー
class UnifiedStorageManager {
    constructor() {
        this.storageType = 'firebase'; // デフォルトはFirebase
        this.products = [];
        this.isInitialized = false;
        this.callbacks = [];

        // Firebase設定の確認
        if (typeof firebase !== 'undefined' && firebase.database) {
            this.initializeFirebase();
        } else {
            console.error('Firebase not loaded, falling back to localStorage');
            this.storageType = 'local';
            this.loadFromLocalStorage();
        }
    }

    // Firebase初期化
    initializeFirebase() {
        try {
            this.dbRef = firebase.database().ref('products');

            // リアルタイムリスナーの設定
            this.dbRef.on(
                'value',
                (snapshot) => {
                    const data = snapshot.val();
                    this.products = data
                        ? Object.entries(data).map(([id, product]) => ({
                            ...product,
                            id: id
                        }))
                        : [];

                    this.isInitialized = true;
                    this.notifyCallbacks();
                },
                (error) => {
                    console.error('Firebase read error:', error);
                    this.fallbackToLocalStorage();
                }
            );
        } catch (error) {
            console.error('Firebase initialization error:', error);
            this.fallbackToLocalStorage();
        }
    }

    // LocalStorageへのフォールバック
    fallbackToLocalStorage() {
        console.warn('Falling back to localStorage');
        this.storageType = 'local';
        this.loadFromLocalStorage();
    }

    // LocalStorageから読み込み
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('stampProducts');
            this.products = data ? JSON.parse(data) : [];
            this.isInitialized = true;
            this.notifyCallbacks();
        } catch (error) {
            console.error('LocalStorage read error:', error);
            this.products = [];
        }
    }

    // コールバック通知
    notifyCallbacks() {
        this.callbacks.forEach((callback) => {
            try {
                callback(this.products);
            } catch (error) {
                console.error('Callback error:', error);
            }
        });
    }

    // データ変更監視
    onDataChange(callback) {
        this.callbacks.push(callback);
        if (this.isInitialized) {
            callback(this.products);
        }
    }

    // 商品取得
    getProducts() {
        return [...this.products];
    }

    // 商品追加
    addProduct(product) {
        if (this.storageType === 'firebase' && this.dbRef) {
            const newProductRef = this.dbRef.push();
            product.id = newProductRef.key;
            product.created_at = new Date().toISOString();
            return newProductRef.set(product);
        } else {
            product.id = Date.now().toString();
            product.created_at = new Date().toISOString();
            this.products.push(product);
            this.saveToLocalStorage();
            this.notifyCallbacks();
            return Promise.resolve();
        }
    }

    // 商品更新
    updateProduct(id, product) {
        if (this.storageType === 'firebase' && this.dbRef) {
            return this.dbRef.child(id).update(product);
        } else {
            const index = this.products.findIndex((p) => p.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...product };
                this.saveToLocalStorage();
                this.notifyCallbacks();
            }
            return Promise.resolve();
        }
    }

    // 商品削除
    deleteProduct(id) {
        if (this.storageType === 'firebase' && this.dbRef) {
            return this.dbRef.child(id).remove();
        } else {
            this.products = this.products.filter((p) => p.id !== id);
            this.saveToLocalStorage();
            this.notifyCallbacks();
            return Promise.resolve();
        }
    }

    // LocalStorageに保存
    saveToLocalStorage() {
        try {
            localStorage.setItem('stampProducts', JSON.stringify(this.products));
        } catch (error) {
            console.error('LocalStorage save error:', error);
        }
    }

    // カテゴリ取得
    getCategories() {
        const categories = new Set();
        this.products.forEach((product) => {
            if (product.category) {
                categories.add(product.category);
            }
        });
        return Array.from(categories);
    }

    // 商品検索
    searchProducts(query) {
        const searchLower = query.toLowerCase();
        return this.products.filter(
            (product) =>
                (product.title && product.title.toLowerCase().includes(searchLower)) ||
                (product.description && product.description.toLowerCase().includes(searchLower)) ||
                (product.category && product.category.toLowerCase().includes(searchLower))
        );
    }

    // カテゴリで絞り込み
    getProductsByCategory(category) {
        return this.products.filter((product) => product.category === category);
    }

    // アクティブな商品のみ取得
    getActiveProducts() {
        return this.products.filter((product) => product.status === 'active');
    }

    // 新着商品を取得（最新12件）
    getNewProducts() {
        return this.products
            .filter((product) => product.status === 'active' || product.soldOut)
            .sort((a, b) => {
                const dateA = new Date(a.created_at || 0);
                const dateB = new Date(b.created_at || 0);
                return dateB - dateA;
            })
            .slice(0, 12);
    }
}

// グローバルに公開
window.UnifiedStorageManager = UnifiedStorageManager;

// 互換性のためのメソッド追加
window.UnifiedStorageManager.getNewProducts = async function() {
    const manager = new UnifiedStorageManager();
    // 初期化を待つ
    return new Promise((resolve) => {
        if (manager.isInitialized) {
            resolve(manager.getNewProducts());
        } else {
            const checkInterval = setInterval(() => {
                if (manager.isInitialized) {
                    clearInterval(checkInterval);
                    resolve(manager.getNewProducts());
                }
            }, 100);
        }
    });
};

window.UnifiedStorageManager.getProductsByCategory = async function(category) {
    const manager = new UnifiedStorageManager();
    // 初期化を待つ
    return new Promise((resolve) => {
        if (manager.isInitialized) {
            resolve(manager.getProductsByCategory(category));
        } else {
            const checkInterval = setInterval(() => {
                if (manager.isInitialized) {
                    clearInterval(checkInterval);
                    resolve(manager.getProductsByCategory(category));
                }
            }, 100);
        }
    });
};
