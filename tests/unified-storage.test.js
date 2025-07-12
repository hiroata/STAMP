// UnifiedStorageManager のテスト

describe('UnifiedStorageManager', () => {
    let UnifiedStorageManager;

    beforeEach(() => {
        // モジュールをリセット
        jest.resetModules();
        jest.clearAllMocks();

        // UnifiedStorageManagerをロード
        require('../js/unified-storage.js');
        UnifiedStorageManager = window.UnifiedStorageManager;
    });

    describe('初期化', () => {
        it('Firebaseが利用可能な場合はFirebaseを使用する', () => {
            window.firebase = global.firebase;
            const manager = new UnifiedStorageManager();

            expect(manager.storageType).toBe('firebase');
        });

        it('Firebaseが利用できない場合はlocalStorageにフォールバックする', () => {
            window.firebase = undefined;
            const manager = new UnifiedStorageManager();

            expect(manager.storageType).toBe('local');
            expect(localStorage.getItem).toHaveBeenCalledWith('stampProducts');
        });
    });

    describe('商品の追加', () => {
        it('Firebase使用時に商品を追加できる', async () => {
            window.firebase = global.firebase;
            const mockPush = jest.fn(() => ({
                key: 'test-id-123',
                set: jest.fn(() => Promise.resolve())
            }));

            firebase.database().ref.mockReturnValue({
                push: mockPush
            });

            const manager = new UnifiedStorageManager();
            manager.storageType = 'firebase';
            manager.dbRef = firebase.database().ref('products');

            const product = {
                title: 'テスト商品',
                price: 1000
            };

            await manager.addProduct(product);

            expect(mockPush).toHaveBeenCalled();
            expect(product.id).toBe('test-id-123');
            expect(product.created_at).toBeDefined();
        });

        it('localStorage使用時に商品を追加できる', async () => {
            window.firebase = undefined;
            localStorage.getItem.mockReturnValue(JSON.stringify([]));

            const manager = new UnifiedStorageManager();
            const product = {
                title: 'テスト商品',
                price: 1000
            };

            await manager.addProduct(product);

            expect(manager.products.length).toBe(1);
            expect(manager.products[0].title).toBe('テスト商品');
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });

    describe('商品の検索', () => {
        it('タイトルで商品を検索できる', () => {
            window.firebase = undefined;
            const manager = new UnifiedStorageManager();
            manager.products = [
                { id: '1', title: '富士山切手', category: '風景切手', description: '美しい富士山' },
                { id: '2', title: '桜切手', category: '花切手', description: '春の桜' },
                { id: '3', title: '紅葉切手', category: '風景切手', description: '秋の紅葉' }
            ];

            const results = manager.searchProducts('富士');

            expect(results.length).toBe(1);
            expect(results[0].title).toBe('富士山切手');
        });

        it('カテゴリーで商品を検索できる', () => {
            window.firebase = undefined;
            const manager = new UnifiedStorageManager();
            manager.products = [
                { id: '1', title: '富士山切手', category: '風景切手', description: '美しい富士山' },
                { id: '2', title: '桜切手', category: '花切手', description: '春の桜' },
                { id: '3', title: '紅葉切手', category: '風景切手', description: '秋の紅葉' }
            ];

            const results = manager.searchProducts('風景');

            expect(results.length).toBe(2);
        });
    });

    describe('コールバック管理', () => {
        it('データ変更時にコールバックが呼ばれる', () => {
            window.firebase = undefined;
            const manager = new UnifiedStorageManager();
            const callback = jest.fn();

            manager.onDataChange(callback);
            manager.notifyCallbacks();

            expect(callback).toHaveBeenCalledWith(manager.products);
        });
    });
});
