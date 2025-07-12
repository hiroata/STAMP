// 認証設定ファイル
// 注意: これはフロントエンドのデモ用実装です。
// 本番環境では必ずサーバーサイドで認証を実装してください。

const AuthConfig = {
    // セッションタイムアウト（ミリ秒）
    sessionTimeout: 30 * 60 * 1000, // 30分

    // ログイン試行回数制限
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15分

    // パスワードポリシー
    passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    },

    // セキュリティヘッダー（サーバーサイドで設定）
    securityHeaders: {
        'Content-Security-Policy':
            "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    },

    // APIエンドポイント（本番環境用）
    api: {
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        verify: '/api/auth/verify',
        refresh: '/api/auth/refresh'
    }
};

// セッション管理
class SessionManager {
    constructor() {
        this.setupSessionTimeout();
        this.setupActivityMonitoring();
    }

    setupSessionTimeout() {
        let timeout;

        const resetTimeout = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.logout('Session expired');
            }, AuthConfig.sessionTimeout);
        };

        // ユーザーアクティビティを監視
        ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach((event) => {
            document.addEventListener(event, resetTimeout, true);
        });

        resetTimeout();
    }

    setupActivityMonitoring() {
        // 不正なアクティビティを検出
        let suspiciousActivityCount = 0;

        // 短時間での大量リクエスト検出
        const requestTimestamps = [];

        this.checkSuspiciousActivity = () => {
            const now = Date.now();
            const recentRequests = requestTimestamps.filter((t) => now - t < 60000);

            if (recentRequests.length > 100) {
                suspiciousActivityCount++;
                if (suspiciousActivityCount > 3) {
                    this.logout('Suspicious activity detected');
                }
            }

            requestTimestamps.push(now);
        };
    }

    logout(reason) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        console.log('Logout:', reason);
        window.location.href = 'admin-login.html';
    }
}

// パスワード強度チェッカー
function checkPasswordStrength(password) {
    const policy = AuthConfig.passwordPolicy;
    const errors = [];

    if (password.length < policy.minLength) {
        errors.push(`パスワードは${policy.minLength}文字以上必要です`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('大文字を含める必要があります');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('小文字を含める必要があります');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
        errors.push('数字を含める必要があります');
    }

    if (policy.requireSpecialChars) {
        const specialCharsRegex = new RegExp(
            `[${policy.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`
        );
        if (!specialCharsRegex.test(password)) {
            errors.push('特殊文字を含める必要があります');
        }
    }

    // 一般的な弱いパスワードをチェック
    const weakPasswords = ['password', 'admin', '123456', 'qwerty'];
    if (weakPasswords.some((weak) => password.toLowerCase().includes(weak))) {
        errors.push('より強力なパスワードを使用してください');
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
        strength: calculateStrength(password)
    };
}

function calculateStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const strengthLevels = ['弱い', '普通', '強い', '非常に強い'];
    return {
        score: strength,
        label: strengthLevels[Math.min(Math.floor(strength / 1.5), 3)]
    };
}

// エクスポート（モジュール使用時）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuthConfig,
        SessionManager,
        checkPasswordStrength
    };
}
