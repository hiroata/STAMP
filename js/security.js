/**
 * セキュリティ強化
 * XSS対策、CSRF対策、セキュアな設定管理
 */

class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCSPReporting();
        this.setupXSSProtection();
        this.setupSecureHeaders();
        this.setupInputSanitization();
        this.setupSecureCommunication();
    }

    // CSP違反レポート処理
    setupCSPReporting() {
        document.addEventListener('securitypolicyviolation', (e) => {
            console.warn('CSP Violation:', {
                blockedURI: e.blockedURI,
                violatedDirective: e.violatedDirective,
                originalPolicy: e.originalPolicy,
                sourceFile: e.sourceFile,
                lineNumber: e.lineNumber
            });
            
            // 本番環境では違反レポートをサーバーに送信
            if (window.location.hostname !== 'localhost') {
                this.reportCSPViolation(e);
            }
        });
    }

    reportCSPViolation(violationEvent) {
        const report = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            blockedURI: violationEvent.blockedURI,
            violatedDirective: violationEvent.violatedDirective,
            sourceFile: violationEvent.sourceFile,
            lineNumber: violationEvent.lineNumber
        };

        // Firebase Functions エンドポイントにレポート送信
        fetch('/api/security/csp-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(report)
        }).catch(error => {
            console.error('Failed to send CSP report:', error);
        });
    }

    // XSS保護
    setupXSSProtection() {
        // DOM-based XSS の検出と防止
        this.monitorDOMChanges();
        
        // HTMLエスケープ関数をグローバルに提供
        window.SecurityUtils = {
            escapeHtml: this.escapeHtml.bind(this),
            escapeAttr: this.escapeAttr.bind(this),
            sanitizeUrl: this.sanitizeUrl.bind(this),
            createSafeProductDisplay: this.createSafeProductDisplay.bind(this)
        };
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeAttr(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    sanitizeUrl(url) {
        // 危険なプロトコルをチェック
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
        const lowercaseUrl = url.toLowerCase().trim();
        
        for (const protocol of dangerousProtocols) {
            if (lowercaseUrl.startsWith(protocol)) {
                return '#';
            }
        }
        
        // 相対URLまたは安全な絶対URLのみ許可
        if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || 
            url.startsWith('https://') || url.startsWith('http://')) {
            return url;
        }
        
        return '#';
    }

    createSafeProductDisplay(product) {
        return {
            id: this.escapeHtml(product.id || ''),
            title: this.escapeHtml(product.title || ''),
            category: this.escapeHtml(product.category || ''),
            price: product.price || 0,
            priceText: this.escapeHtml(product.priceText || ''),
            description: this.escapeHtml(product.description || ''),
            imageUrl: this.sanitizeUrl(product.imageUrl || ''),
            stock: product.stock || 0,
            soldOut: Boolean(product.soldOut),
            isNew: Boolean(product.isNew),
            negotiable: Boolean(product.negotiable)
        };
    }

    monitorDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        this.scanForXSS(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    scanForXSS(element) {
        // 危険なHTML要素のチェック
        const dangerousElements = ['script', 'iframe', 'object', 'embed', 'form'];
        const tagName = element.tagName?.toLowerCase();
        
        if (dangerousElements.includes(tagName)) {
            console.warn('Potential XSS attempt detected:', element);
            element.remove();
            return;
        }

        // 危険な属性のチェック
        if (element.attributes) {
            Array.from(element.attributes).forEach(attr => {
                if (attr.name.startsWith('on') || attr.value.includes('javascript:')) {
                    console.warn('Dangerous attribute detected:', attr.name, attr.value);
                    element.removeAttribute(attr.name);
                }
            });
        }

        // 子要素も再帰的にチェック
        element.querySelectorAll('*').forEach(child => {
            this.scanForXSS(child);
        });
    }

    // セキュアヘッダー設定
    setupSecureHeaders() {
        // クライアントサイドでできる範囲での設定
        this.enforceHTTPS();
        this.setupReferrerPolicy();
    }

    enforceHTTPS() {
        // 本番環境でHTTPSを強制
        if (window.location.hostname !== 'localhost' && window.location.protocol !== 'https:') {
            window.location.href = window.location.href.replace('http:', 'https:');
        }
    }

    setupReferrerPolicy() {
        // 既存のreferrer metaタグがない場合は追加
        if (!document.querySelector('meta[name="referrer"]')) {
            const meta = document.createElement('meta');
            meta.name = 'referrer';
            meta.content = 'strict-origin-when-cross-origin';
            document.head.appendChild(meta);
        }
    }

    // 入力値のサニタイゼーション
    setupInputSanitization() {
        // 全ての入力フィールドにサニタイゼーションを適用
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.sanitizeInput(e.target);
            }
        });

        // フォーム送信時の検証
        document.addEventListener('submit', (e) => {
            this.validateForm(e);
        });
    }

    sanitizeInput(input) {
        const originalValue = input.value;
        
        // HTMLタグを除去
        const sanitized = originalValue.replace(/<[^>]*>/g, '');
        
        // 危険なJavaScriptコードパターンを検出
        const dangerousPatterns = [
            /javascript:/i,
            /vbscript:/i,
            /on\w+\s*=/i,
            /<script/i,
            /eval\s*\(/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(sanitized)) {
                console.warn('Dangerous input detected:', sanitized);
                input.value = sanitized.replace(pattern, '');
                this.showSecurityWarning();
                break;
            }
        }
    }

    validateForm(event) {
        const form = event.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        let hasViolation = false;
        
        inputs.forEach(input => {
            if (this.containsDangerousContent(input.value)) {
                hasViolation = true;
                input.classList.add('security-violation');
            } else {
                input.classList.remove('security-violation');
            }
        });

        if (hasViolation) {
            event.preventDefault();
            this.showSecurityWarning();
        }
    }

    containsDangerousContent(value) {
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /vbscript:/i,
            /on\w+\s*=/i,
            /data:text\/html/i
        ];

        return dangerousPatterns.some(pattern => pattern.test(value));
    }

    showSecurityWarning() {
        const warning = document.createElement('div');
        warning.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        warning.innerHTML = `
            <div class="flex items-center">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>セキュリティ警告：不正な入力が検出されました</span>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 5000);
    }

    // セキュアな通信設定
    setupSecureCommunication() {
        // Fetch APIのインターセプト
        this.interceptFetch();
        
        // WebSocketのセキュア設定
        this.setupSecureWebSocket();
    }

    interceptFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = (input, init = {}) => {
            // セキュリティヘッダーを追加
            init.headers = {
                ...init.headers,
                'X-Requested-With': 'XMLHttpRequest'
            };

            // CSRFトークンの追加（必要に応じて）
            const csrfToken = this.getCSRFToken();
            if (csrfToken) {
                init.headers['X-CSRF-Token'] = csrfToken;
            }

            return originalFetch(input, init);
        };
    }

    getCSRFToken() {
        // CSRFトークンをmeta tagまたはcookieから取得
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        return metaToken ? metaToken.content : null;
    }

    setupSecureWebSocket() {
        // WebSocket接続のセキュリティ設定
        const originalWebSocket = window.WebSocket;
        
        window.WebSocket = function(url, protocols) {
            // WSS（セキュア）接続を強制
            if (url.startsWith('ws://') && window.location.protocol === 'https:') {
                url = url.replace('ws://', 'wss://');
            }
            
            return new originalWebSocket(url, protocols);
        };
    }

    // セキュリティ監査
    performSecurityAudit() {
        const audit = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            checks: {
                https: window.location.protocol === 'https:',
                csp: this.hasCSP(),
                referrerPolicy: this.hasReferrerPolicy(),
                xFrameOptions: this.hasXFrameOptions()
            }
        };

        console.log('Security Audit:', audit);
        return audit;
    }

    hasCSP() {
        const metas = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
        return metas.length > 0;
    }

    hasReferrerPolicy() {
        const metas = document.querySelectorAll('meta[name="referrer"]');
        return metas.length > 0;
    }

    hasXFrameOptions() {
        // X-Frame-Optionsはレスポンスヘッダーなので、クライアントサイドでは直接確認できない
        // フレーム内で実行されているかどうかで推測
        return window.self === window.top;
    }
}

// セキュリティマネージャー初期化
document.addEventListener('DOMContentLoaded', () => {
    const securityManager = new SecurityManager();
    
    // 開発環境でのセキュリティ監査
    if (window.location.hostname === 'localhost') {
        securityManager.performSecurityAudit();
    }
});

// セキュリティ違反のスタイル
const securityStyle = document.createElement('style');
securityStyle.textContent = `
    .security-violation {
        border: 2px solid #ef4444 !important;
        background-color: #fef2f2 !important;
    }
    
    .security-violation:focus {
        outline: 2px solid #ef4444 !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(securityStyle);