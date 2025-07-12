// キャッシュマネージャー
// Single Responsibility Principle: メモリキャッシュの管理のみを担当

import { createLogger } from '../logger.js';

const logger = createLogger('CacheManager');

export class CacheManager {
    constructor(maxAge = 300000) { // デフォルト5分
        this.cache = new Map();
        this.maxAge = maxAge;
    }

    // キャッシュキーの生成
    generateKey(collection, id = null) {
        return id ? `${collection}:${id}` : collection;
    }

    // キャッシュの取得
    get(collection, id = null) {
        const key = this.generateKey(collection, id);
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        // 有効期限チェック
        if (Date.now() - cached.timestamp > this.maxAge) {
            this.cache.delete(key);
            logger.debug('キャッシュ期限切れ:', key);
            return null;
        }

        logger.debug('キャッシュヒット:', key);
        return cached.data;
    }

    // キャッシュの設定
    set(collection, id, data) {
        const key = this.generateKey(collection, id);
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        logger.debug('キャッシュ設定:', key);
    }

    // コレクション全体のキャッシュ設定
    setAll(collection, data) {
        this.set(collection, null, data);
    }

    // キャッシュの削除
    delete(collection, id = null) {
        if (id) {
            // 特定のアイテムを削除
            const key = this.generateKey(collection, id);
            this.cache.delete(key);
        } else {
            // コレクション全体を削除
            const prefix = `${collection}:`;
            for (const key of this.cache.keys()) {
                if (key === collection || key.startsWith(prefix)) {
                    this.cache.delete(key);
                }
            }
        }
        logger.debug('キャッシュ削除:', collection, id);
    }

    // 全キャッシュのクリア
    clear() {
        this.cache.clear();
        logger.debug('全キャッシュクリア');
    }

    // キャッシュサイズの取得
    size() {
        return this.cache.size;
    }

    // 期限切れキャッシュの削除
    cleanup() {
        const now = Date.now();
        let deletedCount = 0;

        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.maxAge) {
                this.cache.delete(key);
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            logger.debug(`${deletedCount}件の期限切れキャッシュを削除`);
        }

        return deletedCount;
    }
}