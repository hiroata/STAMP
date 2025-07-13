// ページネーション対応ストレージマネージャー
class PaginatedStorageManager extends UnifiedStorageManager {
    constructor() {
        super();
        this.pageSize = 50; // 1ページあたり50商品
        this.currentPage = 1;
        this.totalPages = 1;
        this.sortBy = 'created_at';
        this.sortOrder = 'desc';
        this.filters = {
            search: '',
            category: '',
            status: ''
        };
        this.cachedFilteredProducts = [];
        this.lastFilterHash = '';
    }

    // フィルターのハッシュを生成（キャッシュ用）
    getFilterHash() {
        return JSON.stringify({
            search: this.filters.search,
            category: this.filters.category,
            status: this.filters.status,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder
        });
    }

    // フィルターを設定
    setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.currentPage = 1; // フィルター変更時は1ページ目に戻る
    }

    // ソート設定
    setSorting(sortBy, sortOrder = 'desc') {
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.currentPage = 1;
    }

    // ページサイズ設定
    setPageSize(size) {
        this.pageSize = size;
        this.currentPage = 1;
    }

    // フィルタリングされた商品を取得（キャッシュ付き）
    getFilteredProducts() {
        const currentHash = this.getFilterHash();
        
        // キャッシュが有効な場合はそれを返す
        if (currentHash === this.lastFilterHash && this.cachedFilteredProducts.length > 0) {
            return this.cachedFilteredProducts;
        }

        let filtered = [...this.products];

        // 検索フィルター
        if (this.filters.search) {
            const searchLower = this.filters.search.toLowerCase();
            filtered = filtered.filter(product =>
                (product.title && product.title.toLowerCase().includes(searchLower)) ||
                (product.sku && product.sku.toLowerCase().includes(searchLower)) ||
                (product.description && product.description.toLowerCase().includes(searchLower))
            );
        }

        // カテゴリーフィルター
        if (this.filters.category) {
            filtered = filtered.filter(product => {
                const mainCategory = product.category ? product.category.split(' > ')[0] : '';
                return mainCategory === this.filters.category;
            });
        }

        // ステータスフィルター
        if (this.filters.status) {
            filtered = filtered.filter(product => {
                switch (this.filters.status) {
                    case 'active':
                        return !product.soldOut && (product.stock === undefined || product.stock > 0);
                    case 'soldout':
                        return product.soldOut;
                    case 'outofstock':
                        return !product.soldOut && product.stock === 0;
                    default:
                        return true;
                }
            });
        }

        // ソート
        filtered.sort((a, b) => {
            let compareValue = 0;
            
            switch (this.sortBy) {
                case 'created_at':
                    const dateA = new Date(a.created_at || 0);
                    const dateB = new Date(b.created_at || 0);
                    compareValue = dateB - dateA;
                    break;
                case 'title':
                    compareValue = (a.title || '').localeCompare(b.title || '');
                    break;
                case 'price':
                    compareValue = (b.price || 0) - (a.price || 0);
                    break;
                case 'sku':
                    compareValue = (a.sku || '').localeCompare(b.sku || '');
                    break;
                default:
                    compareValue = 0;
            }

            return this.sortOrder === 'desc' ? -compareValue : compareValue;
        });

        // キャッシュを更新
        this.cachedFilteredProducts = filtered;
        this.lastFilterHash = currentHash;

        return filtered;
    }

    // ページネーションされた商品を取得
    getPaginatedProducts() {
        const filtered = this.getFilteredProducts();
        this.totalPages = Math.ceil(filtered.length / this.pageSize);

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;

        return {
            products: filtered.slice(startIndex, endIndex),
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            totalProducts: filtered.length,
            pageSize: this.pageSize,
            hasNextPage: this.currentPage < this.totalPages,
            hasPrevPage: this.currentPage > 1
        };
    }

    // 次のページへ
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }

    // 前のページへ
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }

    // 特定のページへ移動
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }

    // バルク操作用メソッド
    async addProductsBulk(products) {
        if (this.storageType === 'firebase' && this.dbRef) {
            const updates = {};
            products.forEach(product => {
                const newProductRef = this.dbRef.push();
                product.id = newProductRef.key;
                product.created_at = new Date().toISOString();
                updates[newProductRef.key] = product;
            });
            return this.dbRef.update(updates);
        } else {
            products.forEach(product => {
                product.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                product.created_at = new Date().toISOString();
                this.products.push(product);
            });
            this.saveToLocalStorage();
            this.notifyCallbacks();
            return Promise.resolve();
        }
    }

    // 統計情報を取得
    getStatistics() {
        const stats = {
            total: this.products.length,
            active: 0,
            soldOut: 0,
            outOfStock: 0,
            byCategory: {},
            averagePrice: 0,
            totalValue: 0
        };

        let priceSum = 0;
        let priceCount = 0;

        this.products.forEach(product => {
            // ステータス別カウント（実際のプロパティに基づく）
            if (product.soldOut) {
                stats.soldOut++;
            } else if (product.stock === 0) {
                stats.outOfStock++;
            } else {
                stats.active++;
            }

            // カテゴリー別カウント
            const mainCategory = product.category ? product.category.split(' > ')[0] : '未分類';
            stats.byCategory[mainCategory] = (stats.byCategory[mainCategory] || 0) + 1;

            // 価格統計
            if (product.price && !product.negotiable) {
                priceSum += product.price;
                priceCount++;
                if (!product.soldOut && product.stock > 0) {
                    stats.totalValue += product.price * (product.stock || 1);
                }
            }
        });

        stats.averagePrice = priceCount > 0 ? Math.round(priceSum / priceCount) : 0;

        return stats;
    }
}

// グローバルに公開
window.PaginatedStorageManager = PaginatedStorageManager;