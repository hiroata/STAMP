// Firebase認証管理クラス
class AuthManager {
    constructor() {
        this.auth = firebase.auth();
        this.database = firebase.database();
        this.currentUser = null;
        this.isAdmin = false;
        this.sessionTimeout = null;
        this.SESSION_TIMEOUT_DURATION = 30 * 60 * 1000; // 30分
        
        // デモモードのチェック
        this.checkDemoMode();

        // 認証状態の監視
        this.auth.onAuthStateChanged(async (user) => {
            console.log('Auth state changed:', user ? user.email : 'null');
            
            // デモモードの場合はFirebase認証をスキップ
            if (window.isDemoMode) {
                console.log('Demo mode active, skipping Firebase auth');
                return;
            }
            
            this.currentUser = user;
            if (user) {
                // 管理者権限をチェック
                await this.checkAdminStatus(user.uid);
                // セッションタイムアウトを開始
                this.startSessionTimeout();
            } else {
                this.isAdmin = false;
                this.clearSessionTimeout();
            }
        });

        // ユーザーアクティビティを監視
        this.setupActivityListeners();
    }

    // 管理者権限をチェック
    async checkAdminStatus(uid) {
        try {
            // Firebase Databaseで管理者権限をチェック
            const snapshot = await this.database.ref(`admins/${uid}`).once('value');
            this.isAdmin = snapshot.val() === true;
            return this.isAdmin;
        } catch (error) {
            console.error('管理者権限チェックエラー:', error);
            this.isAdmin = false;
            return false;
        }
    }

    // ログイン
    async login(email, password, remember = false) {
        try {
            // デモモードは本番環境では無効化されています
            // 開発環境でのみ使用する場合は、以下のコメントを解除してください
            /*
            if (false) { // 本番環境では常にfalse
                // デモモードのコードはここに配置
            }
            */
            
            // Firebase認証でログイン（本番用）
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 管理者権限をチェック
            const isAdmin = await this.checkAdminStatus(user.uid);
            if (!isAdmin) {
                // 管理者権限がない場合はログアウト
                await this.logout();
                throw new Error('管理者権限がありません');
            }

            // セッション永続性の設定（セキュリティ強化）
            // デフォルトはSESSION（ブラウザを閉じたら自動ログアウト）
            await this.auth.setPersistence(
                remember
                    ? firebase.auth.Auth.Persistence.LOCAL
                    : firebase.auth.Auth.Persistence.SESSION
            );

            // IDトークンを取得（オプション）
            const idToken = await user.getIdToken();

            return {
                success: true,
                user: user,
                token: idToken
            };
        } catch (error) {
            console.error('ログインエラー:', error);

            // エラーメッセージの日本語化
            let message = 'ログインに失敗しました';
            switch (error.code) {
            case 'auth/invalid-email':
                message = 'メールアドレスの形式が正しくありません';
                break;
            case 'auth/user-disabled':
                message = 'このアカウントは無効化されています';
                break;
            case 'auth/user-not-found':
                message = 'ユーザーが見つかりません';
                break;
            case 'auth/wrong-password':
                message = 'パスワードが正しくありません';
                break;
            case 'auth/too-many-requests':
                message = 'ログイン試行回数が多すぎます。しばらくしてからお試しください';
                break;
            }

            return {
                success: false,
                message: message,
                error: error
            };
        }
    }

    // ログアウト
    async logout() {
        try {
            // デモ用認証情報をクリア
            localStorage.removeItem('demoAuth');
            sessionStorage.removeItem('demoAuth');
            
            // Firebase認証からログアウト
            await this.auth.signOut();
            
            // ローカルストレージのクリーンアップ
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            
            // 状態をリセット
            this.currentUser = null;
            this.isAdmin = false;
            window.isDemoMode = false;
            
            return { success: true };
        } catch (error) {
            console.error('ログアウトエラー:', error);
            return { success: false, error: error };
        }
    }

    // 現在のユーザーを取得
    getCurrentUser() {
        return this.currentUser;
    }

    // 管理者かどうかをチェック
    async isAdminUser() {
        if (!this.currentUser) {
            return false;
        }
        if (this.isAdmin) {
            return true;
        }

        // 再チェック
        return await this.checkAdminStatus(this.currentUser.uid);
    }

    // 認証状態の確認（ページ保護用）
    async requireAuth(redirectUrl = 'admin-login.html') {
        // デモモードの場合
        if (window.isDemoMode && this.currentUser) {
            console.log('Demo mode auth check passed');
            return true;
        }
        
        return new Promise((resolve) => {
            const unsubscribe = this.auth.onAuthStateChanged(async (user) => {
                unsubscribe();
                if (user) {
                    const isAdmin = await this.checkAdminStatus(user.uid);
                    if (isAdmin) {
                        resolve(true);
                    } else {
                        window.location.href = redirectUrl;
                        resolve(false);
                    }
                } else {
                    // デモモードの再チェック
                    this.checkDemoMode();
                    if (window.isDemoMode && this.currentUser) {
                        console.log('Demo mode revalidated');
                        resolve(true);
                    } else {
                        window.location.href = redirectUrl;
                        resolve(false);
                    }
                }
            });
        });
    }

    // パスワードリセット
    async sendPasswordResetEmail(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            console.error('パスワードリセットエラー:', error);
            return { success: false, error: error };
        }
    }

    // セッションタイムアウトを開始
    startSessionTimeout() {
        this.clearSessionTimeout();
        this.sessionTimeout = setTimeout(() => {
            console.log('セッションタイムアウト: 30分間操作がありませんでした');
            this.logout();
            alert('セキュリティのため、自動的にログアウトしました。');
            window.location.href = 'admin-login.html';
        }, this.SESSION_TIMEOUT_DURATION);
    }

    // セッションタイムアウトをクリア
    clearSessionTimeout() {
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
            this.sessionTimeout = null;
        }
    }

    // セッションタイムアウトをリセット
    resetSessionTimeout() {
        if (this.currentUser && this.isAdmin) {
            this.startSessionTimeout();
        }
    }

    // ユーザーアクティビティの監視を設定
    setupActivityListeners() {
        const events = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.resetSessionTimeout();
            }, true);
        });
    }
    
    // デモモードのチェック（本番環境では無効）
    checkDemoMode() {
        // 本番環境ではデモモードは無効化されています
        return;
    }
}

// グローバルに公開
window.AuthManager = AuthManager;
