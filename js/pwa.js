/**
 * PWA機能管理
 * Service Worker登録とインストールプロンプト
 */

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    async init() {
        // Service Worker登録
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('[PWA] Service Worker registered:', registration);
                
                // 更新チェック
                registration.addEventListener('updatefound', () => {
                    console.log('[PWA] New service worker available');
                    this.showUpdatePrompt();
                });
            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
            }
        }

        // インストールプロンプトイベント
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt triggered');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // インストール完了イベント
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            this.hideInstallButton();
            this.deferredPrompt = null;
        });
    }

    showInstallButton() {
        // インストールボタンを表示
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.addEventListener('click', () => this.promptInstall());
        } else {
            // 動的にボタンを作成
            this.createInstallButton();
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    createInstallButton() {
        const button = document.createElement('button');
        button.id = 'install-btn';
        button.className = 'btn btn-primary fixed bottom-4 right-4 z-50 rounded-full p-3 shadow-lg';
        button.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
            </svg>
            <span class="sr-only">アプリをインストール</span>
        `;
        button.title = 'アプリをインストール';
        button.addEventListener('click', () => this.promptInstall());
        
        document.body.appendChild(button);
    }

    async promptInstall() {
        if (!this.deferredPrompt) return;

        try {
            // インストールプロンプトを表示
            this.deferredPrompt.prompt();
            
            // ユーザーの選択を待つ
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log('[PWA] User choice:', outcome);
            
            if (outcome === 'accepted') {
                console.log('[PWA] User accepted install prompt');
            } else {
                console.log('[PWA] User dismissed install prompt');
            }
            
            this.deferredPrompt = null;
        } catch (error) {
            console.error('[PWA] Install prompt failed:', error);
        }
    }

    showUpdatePrompt() {
        // 更新通知を表示
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>新しいバージョンが利用可能です</span>
                <button id="update-btn" class="ml-4 bg-white text-blue-500 px-3 py-1 rounded text-sm">
                    更新
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        document.getElementById('update-btn').addEventListener('click', () => {
            window.location.reload();
        });
        
        // 10秒後に自動で非表示
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }

    // オフライン状態の検知
    initNetworkStatus() {
        const updateOnlineStatus = () => {
            const status = navigator.onLine ? 'online' : 'offline';
            console.log('[PWA] Network status:', status);
            
            if (!navigator.onLine) {
                this.showOfflineNotification();
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }

    showOfflineNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center">
                <span>オフラインモードです</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // オンラインに戻ったら非表示
        const removeNotification = () => {
            notification.remove();
            window.removeEventListener('online', removeNotification);
        };
        
        window.addEventListener('online', removeNotification);
    }
}

// PWAマネージャー初期化
document.addEventListener('DOMContentLoaded', () => {
    new PWAManager();
});