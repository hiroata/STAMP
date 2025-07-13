// シンプルで実用的なバックアップマネージャー
class SimpleBackupManager {
    constructor() {
        this.database = firebase.database();
        this.storage = firebase.storage();
        this.maxBackups = 10; // 最大保持数
        console.log('SimpleBackupManager 初期化完了');
    }

    // バックアップ作成（メイン機能）
    async createBackup(name = null) {
        try {
            const timestamp = new Date();
            const backupName = name || `バックアップ_${timestamp.toLocaleDateString('ja-JP').replace(/\//g, '-')}_${timestamp.toLocaleTimeString('ja-JP').replace(/:/g, '-')}`;
            
            console.log('バックアップ作成開始:', backupName);
            
            // 商品データ取得
            const productsSnapshot = await this.database.ref('products').once('value');
            const products = productsSnapshot.val() || {};
            const productCount = Object.keys(products).length;
            
            console.log(`商品データ取得完了: ${productCount}件`);
            
            // カテゴリーデータ取得（エラーでも続行）
            let categories = {};
            try {
                const categoriesSnapshot = await this.database.ref('categories').once('value');
                categories = categoriesSnapshot.val() || {};
            } catch (error) {
                console.warn('カテゴリーデータ取得スキップ:', error.message);
            }
            
            // バックアップデータ構築
            const backupData = {
                id: `backup_${Date.now()}`,
                name: backupName,
                timestamp: timestamp.toISOString(),
                created: timestamp.toLocaleString('ja-JP'),
                productCount: productCount,
                categoryCount: Object.keys(categories).length,
                data: {
                    products: products,
                    categories: categories
                },
                version: '2.0'
            };
            
            // データサイズ計算
            const dataSize = JSON.stringify(backupData).length;
            backupData.size = dataSize;
            
            // Firebase に保存
            const backupRef = await this.database.ref('simpleBackups').push(backupData);
            console.log('Firebase保存完了:', backupRef.key);
            
            // 古いバックアップ削除
            await this.cleanupOldBackups();
            
            return {
                success: true,
                id: backupRef.key,
                name: backupName,
                productCount: productCount,
                size: this.formatFileSize(dataSize)
            };
            
        } catch (error) {
            console.error('バックアップ作成エラー:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // バックアップ一覧取得
    async getBackupList() {
        try {
            const snapshot = await this.database.ref('simpleBackups').orderByChild('timestamp').once('value');
            const backups = [];
            
            snapshot.forEach((child) => {
                const backup = child.val();
                backups.push({
                    id: child.key,
                    name: backup.name,
                    timestamp: backup.timestamp,
                    created: backup.created,
                    productCount: backup.productCount,
                    categoryCount: backup.categoryCount || 0,
                    size: backup.size || 0,
                    version: backup.version || '1.0'
                });
            });
            
            // 新しい順に並び替え
            return backups.reverse();
            
        } catch (error) {
            console.error('バックアップ一覧取得エラー:', error);
            return [];
        }
    }
    
    // バックアップダウンロード
    async downloadBackup(backupId) {
        try {
            const snapshot = await this.database.ref(`simpleBackups/${backupId}`).once('value');
            const backupData = snapshot.val();
            
            if (!backupData) {
                throw new Error('バックアップが見つかりません');
            }
            
            // ファイル名生成
            const filename = `${backupData.name.replace(/[^a-zA-Z0-9\-_]/g, '_')}.json`;
            
            // JSONファイルとしてダウンロード
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            console.log('ダウンロード完了:', filename);
            return { success: true, filename: filename };
            
        } catch (error) {
            console.error('ダウンロードエラー:', error);
            return { success: false, error: error.message };
        }
    }
    
    // バックアップ復元
    async restoreBackup(backupId) {
        try {
            // 確認ダイアログ
            const confirmed = confirm(
                '⚠️ 復元の確認\n\n' +
                'この操作により現在のすべての商品データが上書きされます。\n' +
                '復元を実行する前に、念のため現在のデータをバックアップすることをお勧めします。\n\n' +
                '本当に復元を実行しますか？'
            );
            
            if (!confirmed) {
                return { success: false, cancelled: true };
            }
            
            console.log('復元開始:', backupId);
            
            // バックアップデータ取得
            const snapshot = await this.database.ref(`simpleBackups/${backupId}`).once('value');
            const backupData = snapshot.val();
            
            if (!backupData) {
                throw new Error('バックアップが見つかりません');
            }
            
            // 復元前に現在のデータをバックアップ
            console.log('復元前バックアップ作成中...');
            await this.createBackup('復元前自動バックアップ');
            
            // 商品データ復元
            if (backupData.data && backupData.data.products) {
                await this.database.ref('products').set(backupData.data.products);
                console.log('商品データ復元完了');
            }
            
            // カテゴリーデータ復元
            if (backupData.data && backupData.data.categories) {
                await this.database.ref('categories').set(backupData.data.categories);
                console.log('カテゴリーデータ復元完了');
            }
            
            // 復元ログ記録
            const restoreLog = {
                timestamp: new Date().toISOString(),
                backupId: backupId,
                backupName: backupData.name,
                restoredItems: backupData.productCount,
                performedBy: firebase.auth().currentUser?.email || 'unknown'
            };
            
            await this.database.ref('restoreLogs').push(restoreLog);
            
            return {
                success: true,
                restoredCount: backupData.productCount,
                backupName: backupData.name
            };
            
        } catch (error) {
            console.error('復元エラー:', error);
            return { success: false, error: error.message };
        }
    }
    
    // バックアップ削除
    async deleteBackup(backupId) {
        try {
            // 確認ダイアログ
            const confirmed = confirm('このバックアップを削除しますか？\nこの操作は元に戻せません。');
            if (!confirmed) {
                return { success: false, cancelled: true };
            }
            
            await this.database.ref(`simpleBackups/${backupId}`).remove();
            console.log('バックアップ削除完了:', backupId);
            
            return { success: true };
            
        } catch (error) {
            console.error('削除エラー:', error);
            return { success: false, error: error.message };
        }
    }
    
    // 古いバックアップの自動削除
    async cleanupOldBackups() {
        try {
            const backups = await this.getBackupList();
            
            if (backups.length > this.maxBackups) {
                const toDelete = backups.slice(this.maxBackups);
                console.log(`古いバックアップ削除: ${toDelete.length}件`);
                
                for (const backup of toDelete) {
                    await this.database.ref(`simpleBackups/${backup.id}`).remove();
                }
            }
            
        } catch (error) {
            console.error('古いバックアップ削除エラー:', error);
        }
    }
    
    // ファイルサイズ表示用フォーマット
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // 今すぐバックアップ作成（UI用）
    async quickBackup() {
        const timestamp = new Date();
        const name = `手動バックアップ_${timestamp.toLocaleDateString('ja-JP').replace(/\//g, '')}_${timestamp.getHours().toString().padStart(2, '0')}${timestamp.getMinutes().toString().padStart(2, '0')}`;
        return await this.createBackup(name);
    }
    
    // 統計情報取得
    async getStats() {
        try {
            const backups = await this.getBackupList();
            let totalSize = 0;
            
            backups.forEach(backup => {
                totalSize += backup.size || 0;
            });
            
            return {
                totalBackups: backups.length,
                totalSize: this.formatFileSize(totalSize),
                latestBackup: backups.length > 0 ? backups[0].created : 'なし'
            };
            
        } catch (error) {
            console.error('統計情報取得エラー:', error);
            return {
                totalBackups: 0,
                totalSize: '0 B',
                latestBackup: 'エラー'
            };
        }
    }
}

// グローバルに公開
window.SimpleBackupManager = SimpleBackupManager;