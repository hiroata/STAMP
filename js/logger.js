// ロガーユーティリティ - console.logの代替
// 本番環境では適切なロギングサービスに置き換え可能

class Logger {
    constructor(name) {
        this.name = name;
        this.isDevelopment = window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1';
    }

    // デバッグレベル（開発環境のみ）
    debug(...args) {
        if (this.isDevelopment) {
            console.debug(`[${this.name}]`, ...args); // eslint-disable-line no-console
        }
    }

    // 情報レベル
    info(...args) {
        if (this.isDevelopment) {
            console.info(`[${this.name}]`, ...args); // eslint-disable-line no-console
        }
    }

    // 警告レベル
    warn(...args) {
        console.warn(`[${this.name}]`, ...args); // eslint-disable-line no-console
    }

    // エラーレベル
    error(...args) {
        console.error(`[${this.name}]`, ...args); // eslint-disable-line no-console
    }
}

// ロガーインスタンスを作成するファクトリー関数
export function createLogger(name) {
    return new Logger(name);
}

// デフォルトロガー
export const defaultLogger = new Logger('App');