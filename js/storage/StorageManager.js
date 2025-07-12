// 統合ストレージマネージャー
// Facade Pattern: 各モジュールを統合して単一のインターフェースを提供

import { createLogger } from '../logger.js';
import { LocalStorageAdapter } from './LocalStorageAdapter.js';
import { FirebaseAdapter } from './FirebaseAdapter.js';
import { CacheManager } from '../cache/CacheManager.js';
import { AuthGuard } from '../auth/AuthGuard.js';
import { BackupManager } from '../backup/BackupManager.js';
import { ConfigError, ForbiddenError } from '../errors/CustomErrors.js';

const logger = createLogger('StorageManager');

export class StorageManager {
    constructor() {
        this.adapter = null;
        this.cache = new CacheManager();
        this.authGuard = null;
        this.backupManager = null;
        this.isInitialized = false;
    }

    // 初期化
    async initialize(type = 'auto', options = {}) {
        if (this.isInitialized) {
            logger.warn('StorageManagerは既に初期化されています');
            return;
        }

        try {
            // アダプターの選択と初期化
            if (type === 'auto') {
                await this.initializeAutoAdapter(options);
            } else if (type === 'firebase') {
                await this.initializeFirebaseAdapter(options);
            } else {
                this.initializeLocalAdapter();
            }

            // バックアップマネージャーの初期化
            this.backupManager = new BackupManager(this.adapter);

            // 古いバックアップの自動削除
            this.backupManager.cleanupOldBackups();

            this.isInitialized = true;
            logger.info('StorageManager初期化完了');
        } catch (error) {
            logger.error('StorageManager初期化エラー:', error);
            throw error;
        }
    }

    // 自動アダプター選択
    async initializeAutoAdapter(options) {
        try {
            await this.initializeFirebaseAdapter(options);
        } catch (error) {
            logger.warn('Firebase初期化失敗、LocalStorageにフォールバック:', error);
            this.initializeLocalAdapter();
        }
    }

    // Firebaseアダプター初期化
    async initializeFirebaseAdapter(options) {
        const { database, auth } = options;

        if (!database) {
            throw new ConfigError('Firebaseデータベースが提供されていません');
        }

        this.adapter = new FirebaseAdapter(database);

        // 認証ガードの初期化（オプション）
        if (auth) {
            this.authGuard = new AuthGuard(auth, database);
        }

        logger.info('Firebaseアダプターを使用');

        // リアルタイム同期の有効化
        if (options.enableRealtimeSync) {
            this.enableRealtimeSync();
        }
    }

    // LocalStorageアダプター初期化
    initializeLocalAdapter() {
        this.adapter = new LocalStorageAdapter();
        logger.info('LocalStorageアダプターを使用');
    }

    // リアルタイム同期の有効化
    enableRealtimeSync() {
        if (!(this.adapter instanceof FirebaseAdapter)) {
            logger.warn('リアルタイム同期はFirebaseアダプターでのみ利用可能');
            return;
        }

        const { onValue, ref } = require('firebase/database');

        // 商品データの変更を監視
        onValue(ref(this.adapter.database, 'products'), (_snapshot) => {
            logger.debug('商品データが更新されました');
            this.cache.delete('products');

            // UIの更新をトリガー（必要に応じて）
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('productsUpdated'));
            }
        });
    }

    // 権限チェック付きCRUD操作
    async getAll(collection) {
        // キャッシュチェック
        const cached = this.cache.get(collection);
        if (cached) {
            return cached;
        }

        // データ取得
        const data = await this.adapter.getAll(collection);

        // キャッシュに保存
        this.cache.setAll(collection, data);

        return data;
    }

    async get(collection, id) {
        // キャッシュチェック
        const cached = this.cache.get(collection, id);
        if (cached) {
            return cached;
        }

        // データ取得
        const data = await this.adapter.get(collection, id);

        // キャッシュに保存
        if (data) {
            this.cache.set(collection, id, data);
        }

        return data;
    }

    async add(collection, item) {
        // 権限チェック
        if (this.authGuard && !this.authGuard.canPerformAction('create', collection)) {
            throw new ForbiddenError('作成権限がありません');
        }

        // データ追加
        const newItem = await this.adapter.add(collection, item);

        // キャッシュクリア
        this.cache.delete(collection);

        return newItem;
    }

    async update(collection, id, updates) {
        // 権限チェック
        if (this.authGuard && !this.authGuard.canPerformAction('update', collection)) {
            throw new ForbiddenError('更新権限がありません');
        }

        // データ更新
        const updatedItem = await this.adapter.update(collection, id, updates);

        // キャッシュ更新
        this.cache.delete(collection);
        this.cache.delete(collection, id);

        return updatedItem;
    }

    async delete(collection, id) {
        // 権限チェック
        if (this.authGuard && !this.authGuard.canPerformAction('delete', collection)) {
            throw new ForbiddenError('削除権限がありません');
        }

        // データ削除
        const result = await this.adapter.delete(collection, id);

        // キャッシュクリア
        this.cache.delete(collection);
        this.cache.delete(collection, id);

        return result;
    }

    // ユーティリティメソッド
    getAuthGuard() {
        return this.authGuard;
    }

    getBackupManager() {
        return this.backupManager;
    }

    getCacheManager() {
        return this.cache;
    }

    getAdapterType() {
        if (this.adapter instanceof FirebaseAdapter) {
            return 'firebase';
        } else if (this.adapter instanceof LocalStorageAdapter) {
            return 'local';
        }
        return 'unknown';
    }
}

// シングルトンインスタンス
export const storageManager = new StorageManager();