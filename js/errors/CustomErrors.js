// カスタムエラークラス
// 一貫したエラーハンドリングのための専用エラータイプ

// 基底エラークラス
export class BaseError extends Error {
    constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();

        // スタックトレースを保持
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // エラーの詳細情報を取得
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

// ストレージ関連エラー
export class StorageError extends BaseError {
    constructor(message, code = 'STORAGE_ERROR') {
        super(message, code, 500);
    }
}

export class StorageReadError extends StorageError {
    constructor(message, collection) {
        super(message, 'STORAGE_READ_ERROR');
        this.collection = collection;
    }
}

export class StorageWriteError extends StorageError {
    constructor(message, collection) {
        super(message, 'STORAGE_WRITE_ERROR');
        this.collection = collection;
    }
}

// 認証関連エラー
export class AuthError extends BaseError {
    constructor(message, code = 'AUTH_ERROR') {
        super(message, code, 401);
    }
}

export class UnauthorizedError extends AuthError {
    constructor(message = '認証が必要です') {
        super(message, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AuthError {
    constructor(message = 'アクセス権限がありません') {
        super(message, 'FORBIDDEN');
        this.statusCode = 403;
    }
}

// バリデーションエラー
export class ValidationError extends BaseError {
    constructor(message, field = null) {
        super(message, 'VALIDATION_ERROR', 400);
        this.field = field;
    }
}

// ネットワークエラー
export class NetworkError extends BaseError {
    constructor(message, originalError = null) {
        super(message, 'NETWORK_ERROR', 503);
        this.originalError = originalError;
    }
}

// Firebase関連エラー
export class FirebaseError extends BaseError {
    constructor(message, firebaseCode = null) {
        super(message, 'FIREBASE_ERROR', 500);
        this.firebaseCode = firebaseCode;
    }
}

// 設定エラー
export class ConfigError extends BaseError {
    constructor(message) {
        super(message, 'CONFIG_ERROR', 500);
    }
}

// エラーハンドリングユーティリティ
export class ErrorHandler {
    // エラーをユーザーフレンドリーなメッセージに変換
    static getUserMessage(error) {
        if (error instanceof UnauthorizedError) {
            return 'ログインが必要です。';
        }

        if (error instanceof ForbiddenError) {
            return 'この操作を実行する権限がありません。';
        }

        if (error instanceof ValidationError) {
            return `入力エラー: ${error.message}`;
        }

        if (error instanceof NetworkError) {
            return 'ネットワーク接続に問題があります。しばらくしてから再度お試しください。';
        }

        if (error instanceof StorageReadError) {
            return 'データの読み込みに失敗しました。';
        }

        if (error instanceof StorageWriteError) {
            return 'データの保存に失敗しました。';
        }

        if (error instanceof FirebaseError) {
            return 'サーバーとの通信に問題が発生しました。';
        }

        // デフォルトメッセージ
        return 'エラーが発生しました。しばらくしてから再度お試しください。';
    }

    // エラーログ出力
    static logError(error, context = {}) {
        const errorInfo = {
            ...context,
            timestamp: new Date().toISOString(),
            userAgent: navigator?.userAgent || 'Unknown',
            url: window?.location?.href || 'Unknown'
        };

        if (error instanceof BaseError) {
            console.error(`[${error.code}] ${error.message}`, errorInfo, error); // eslint-disable-line no-console
        } else {
            console.error('Unexpected error:', error, errorInfo); // eslint-disable-line no-console
        }
    }

    // エラー通知表示（UIへの統合用）
    static showError(error, duration = 5000) {
        const message = this.getUserMessage(error);

        // 既存のエラー表示要素があれば削除
        const existingError = document.getElementById('error-notification');
        if (existingError) {
            existingError.remove();
        }

        // エラー通知要素を作成
        const errorEl = document.createElement('div');
        errorEl.id = 'error-notification';
        errorEl.className = 'error-message fixed top-4 right-4 p-4 bg-orange-100 border border-orange-400 text-red-700 rounded shadow-lg z-50';
        errorEl.innerHTML = `
            <div class="flex items-center">
                <span class="flex-1">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-red-700 hover:text-red-900">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(errorEl);

        // 自動削除
        if (duration > 0) {
            setTimeout(() => {
                errorEl.remove();
            }, duration);
        }
    }
}