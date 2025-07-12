// バックアップマネージャー
// Single Responsibility Principle: データバックアップ機能のみを担当

import { createLogger } from '../logger.js';

const logger = createLogger('BackupManager');

export class BackupManager {
    constructor(storageAdapter) {
        this.storageAdapter = storageAdapter;
        this.backupPrefix = 'backup_';
    }

    // バックアップの作成
    async createBackup(collection) {
        try {
            const data = await this.storageAdapter.getAll(collection);
            const backup = {
                collection,
                timestamp: new Date().toISOString(),
                count: data.length,
                data
            };

            const backupKey = `${this.backupPrefix}${collection}_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(backup));

            logger.info(`バックアップ作成完了: ${collection} (${data.length}件)`);
            return backupKey;
        } catch (error) {
            logger.error('バックアップ作成エラー:', error);
            throw error;
        }
    }

    // バックアップの復元
    async restoreBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                throw new Error('バックアップが見つかりません');
            }

            const backup = JSON.parse(backupData);
            const { collection, data } = backup;

            // 既存データを削除してから復元
            const currentData = await this.storageAdapter.getAll(collection);
            for (const item of currentData) {
                await this.storageAdapter.delete(collection, item.id);
            }

            // バックアップデータを復元
            for (const item of data) {
                await this.storageAdapter.add(collection, item);
            }

            logger.info(`バックアップ復元完了: ${collection} (${data.length}件)`);
            return true;
        } catch (error) {
            logger.error('バックアップ復元エラー:', error);
            throw error;
        }
    }

    // バックアップ一覧の取得
    listBackups(collection = null) {
        const backups = [];
        const prefix = collection ? `${this.backupPrefix}${collection}_` : this.backupPrefix;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    backups.push({
                        key,
                        collection: data.collection,
                        timestamp: data.timestamp,
                        count: data.count
                    });
                } catch (error) {
                    logger.warn(`無効なバックアップ: ${key}`);
                }
            }
        }

        // タイムスタンプで降順ソート
        return backups.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    // バックアップの削除
    deleteBackup(backupKey) {
        try {
            localStorage.removeItem(backupKey);
            logger.info(`バックアップ削除: ${backupKey}`);
            return true;
        } catch (error) {
            logger.error('バックアップ削除エラー:', error);
            return false;
        }
    }

    // 古いバックアップの自動削除
    cleanupOldBackups(maxAge = 7 * 24 * 60 * 60 * 1000) { // デフォルト7日
        const now = Date.now();
        const backups = this.listBackups();
        let deletedCount = 0;

        for (const backup of backups) {
            const backupTime = new Date(backup.timestamp).getTime();
            if (now - backupTime > maxAge) {
                this.deleteBackup(backup.key);
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            logger.info(`${deletedCount}件の古いバックアップを削除`);
        }

        return deletedCount;
    }

    // バックアップのエクスポート（ダウンロード用）
    exportBackup(backupKey) {
        const backupData = localStorage.getItem(backupKey);
        if (!backupData) {
            throw new Error('バックアップが見つかりません');
        }

        const backup = JSON.parse(backupData);
        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const filename = `backup_${backup.collection}_${backup.timestamp.replace(/[:.]/g, '-')}.json`;

        return { url, filename };
    }
}