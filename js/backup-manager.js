// バックアップマネージャークラス
class BackupManager {
    constructor() {
        this.database = firebase.database();
        this.storage = firebase.storage();
        this.MAX_BACKUPS = 7; // 保持する最大バックアップ数
        this.AUTO_BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24時間ごと
        this.lastAutoBackupTime = null;
        
        // 自動バックアップの初期化
        this.initAutoBackup();
    }

    // 自動バックアップの初期化
    initAutoBackup() {
        // ローカルストレージから最後の自動バックアップ時刻を取得
        const lastBackup = localStorage.getItem('lastAutoBackupTime');
        if (lastBackup) {
            this.lastAutoBackupTime = new Date(lastBackup);
        }

        // 自動バックアップのチェックと実行
        this.checkAndPerformAutoBackup();
        
        // 定期的に自動バックアップをチェック（1時間ごと）
        setInterval(() => {
            this.checkAndPerformAutoBackup();
        }, 60 * 60 * 1000);
    }

    // 自動バックアップのチェックと実行
    async checkAndPerformAutoBackup() {
        const now = new Date();
        
        if (!this.lastAutoBackupTime || 
            (now - this.lastAutoBackupTime) >= this.AUTO_BACKUP_INTERVAL) {
            console.log('自動バックアップを実行します...');
            await this.createBackup('auto');
            this.lastAutoBackupTime = now;
            localStorage.setItem('lastAutoBackupTime', now.toISOString());
        }
    }

    // バックアップの作成
    async createBackup(type = 'manual') {
        try {
            // 現在の商品データを取得
            const productsSnapshot = await this.database.ref('products').once('value');
            const products = productsSnapshot.val() || {};

            // カテゴリーデータを取得
            const categoriesSnapshot = await this.database.ref('categories').once('value');
            const categories = categoriesSnapshot.val() || {};

            // バックアップデータの作成
            const backupData = {
                timestamp: new Date().toISOString(),
                type: type, // 'manual' or 'auto'
                data: {
                    products: products,
                    categories: categories,
                    productCount: Object.keys(products).length,
                    categoryCount: Object.keys(categories).length
                },
                version: '1.0' // バックアップフォーマットのバージョン
            };

            // バックアップをFirebase Databaseに保存
            const backupRef = await this.database.ref('backups').push(backupData);
            const backupId = backupRef.key;

            // バックアップメタデータを更新
            await this.updateBackupMetadata(backupId, backupData);

            // 古いバックアップの削除
            await this.cleanupOldBackups();

            console.log(`バックアップが作成されました: ${backupId}`);
            return {
                success: true,
                backupId: backupId,
                timestamp: backupData.timestamp,
                itemCount: backupData.data.productCount
            };

        } catch (error) {
            console.error('バックアップ作成エラー:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // バックアップメタデータの更新
    async updateBackupMetadata(backupId, backupData) {
        const metadata = {
            id: backupId,
            timestamp: backupData.timestamp,
            type: backupData.type,
            productCount: backupData.data.productCount,
            categoryCount: backupData.data.categoryCount,
            size: JSON.stringify(backupData).length // おおよそのサイズ
        };

        await this.database.ref(`backupMetadata/${backupId}`).set(metadata);
    }

    // 古いバックアップの削除
    async cleanupOldBackups() {
        try {
            // すべてのバックアップメタデータを取得
            const metadataSnapshot = await this.database.ref('backupMetadata')
                .orderByChild('timestamp')
                .once('value');
            
            const metadata = [];
            metadataSnapshot.forEach((child) => {
                metadata.push({
                    id: child.key,
                    ...child.val()
                });
            });

            // 自動バックアップと手動バックアップを分離
            const autoBackups = metadata.filter(b => b.type === 'auto');
            const manualBackups = metadata.filter(b => b.type === 'manual');

            // 古い自動バックアップを削除（最新3つを保持）
            if (autoBackups.length > 3) {
                const toDelete = autoBackups.slice(0, autoBackups.length - 3);
                for (const backup of toDelete) {
                    await this.deleteBackup(backup.id);
                }
            }

            // 手動バックアップは最新4つを保持
            if (manualBackups.length > 4) {
                const toDelete = manualBackups.slice(0, manualBackups.length - 4);
                for (const backup of toDelete) {
                    await this.deleteBackup(backup.id);
                }
            }

        } catch (error) {
            console.error('古いバックアップの削除エラー:', error);
        }
    }

    // バックアップの削除
    async deleteBackup(backupId) {
        try {
            await this.database.ref(`backups/${backupId}`).remove();
            await this.database.ref(`backupMetadata/${backupId}`).remove();
            console.log(`バックアップを削除しました: ${backupId}`);
        } catch (error) {
            console.error(`バックアップ削除エラー (${backupId}):`, error);
        }
    }

    // バックアップリストの取得
    async getBackupList() {
        try {
            const metadataSnapshot = await this.database.ref('backupMetadata')
                .orderByChild('timestamp')
                .once('value');
            
            const backups = [];
            metadataSnapshot.forEach((child) => {
                backups.push({
                    id: child.key,
                    ...child.val()
                });
            });

            // 新しい順に並び替え
            return backups.reverse();

        } catch (error) {
            console.error('バックアップリスト取得エラー:', error);
            return [];
        }
    }

    // バックアップからの復元
    async restoreFromBackup(backupId) {
        try {
            // 復元前の確認
            const confirmRestore = confirm(
                '警告: この操作により現在のすべてのデータが上書きされます。\n' +
                '復元を実行する前に、現在のデータのバックアップを作成することをお勧めします。\n\n' +
                '本当に復元を実行しますか？'
            );

            if (!confirmRestore) {
                return { success: false, cancelled: true };
            }

            // バックアップデータを取得
            const backupSnapshot = await this.database.ref(`backups/${backupId}`).once('value');
            const backupData = backupSnapshot.val();

            if (!backupData) {
                throw new Error('バックアップが見つかりません');
            }

            // 復元前に現在のデータをバックアップ（安全のため）
            await this.createBackup('pre-restore');

            // 商品データの復元
            if (backupData.data.products) {
                await this.database.ref('products').set(backupData.data.products);
            }

            // カテゴリーデータの復元
            if (backupData.data.categories) {
                await this.database.ref('categories').set(backupData.data.categories);
            }

            // 復元ログを記録
            await this.logRestore(backupId, backupData);

            return {
                success: true,
                restoredCount: backupData.data.productCount,
                timestamp: backupData.timestamp
            };

        } catch (error) {
            console.error('復元エラー:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 復元ログの記録
    async logRestore(backupId, backupData) {
        const restoreLog = {
            backupId: backupId,
            restoredAt: new Date().toISOString(),
            backupTimestamp: backupData.timestamp,
            itemsRestored: backupData.data.productCount,
            performedBy: firebase.auth().currentUser?.email || 'unknown'
        };

        await this.database.ref('restoreLogs').push(restoreLog);
    }

    // バックアップのエクスポート（JSON形式でダウンロード）
    async exportBackup(backupId) {
        try {
            const backupSnapshot = await this.database.ref(`backups/${backupId}`).once('value');
            const backupData = backupSnapshot.val();

            if (!backupData) {
                throw new Error('バックアップが見つかりません');
            }

            // JSONファイルとしてダウンロード
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `stamp-backup-${backupData.timestamp.replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);

            return { success: true };

        } catch (error) {
            console.error('バックアップエクスポートエラー:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // バックアップのインポート（JSONファイルから）
    async importBackup(file) {
        try {
            const text = await file.text();
            const backupData = JSON.parse(text);

            // バックアップデータの検証
            if (!backupData.timestamp || !backupData.data) {
                throw new Error('無効なバックアップファイル形式です');
            }

            // インポートされたバックアップとして保存
            backupData.type = 'imported';
            backupData.importedAt = new Date().toISOString();

            const backupRef = await this.database.ref('backups').push(backupData);
            await this.updateBackupMetadata(backupRef.key, backupData);

            return {
                success: true,
                backupId: backupRef.key
            };

        } catch (error) {
            console.error('バックアップインポートエラー:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// グローバルに公開
window.BackupManager = BackupManager;