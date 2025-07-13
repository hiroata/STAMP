// セキュリティユーティリティ関数
// XSS対策のためのHTMLエスケープ処理を提供

/**
 * HTMLエスケープ処理
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
function escapeHtml(str) {
    if (typeof str !== 'string') {
        return str;
    }
    
    const htmlEscapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };
    
    return str.replace(/[&<>"'\/]/g, function(match) {
        return htmlEscapeMap[match];
    });
}

/**
 * 属性値用のエスケープ処理
 * @param {string} str - エスケープする文字列
 * @returns {string} エスケープされた文字列
 */
function escapeAttr(str) {
    if (typeof str !== 'string') {
        return str;
    }
    
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

/**
 * URLのサニタイゼーション
 * @param {string} url - チェックするURL
 * @returns {string} 安全なURL、または空文字列
 */
function sanitizeUrl(url) {
    if (typeof url !== 'string') {
        return '';
    }
    
    // 基本的なURLパターンをチェック
    const allowedProtocols = ['http:', 'https:', 'tel:', 'mailto:'];
    
    try {
        const urlObj = new URL(url);
        if (allowedProtocols.includes(urlObj.protocol)) {
            return url;
        }
    } catch (e) {
        // 相対URLの場合
        if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
            return url;
        }
    }
    
    return '';
}

/**
 * 商品データの安全な表示用オブジェクトを作成
 * @param {Object} product - 商品データ
 * @returns {Object} エスケープされた商品データ
 */
function createSafeProductDisplay(product) {
    if (!product) {
        return null;
    }
    
    // 元のデータは変更せず、表示用のコピーを作成
    return {
        ...product,
        title: escapeHtml(product.title || ''),
        description: escapeHtml(product.description || ''),
        category: escapeHtml(product.category || ''),
        priceText: escapeHtml(product.priceText || ''),
        sku: escapeHtml(product.sku || ''),
        // 画像URLは特別な処理
        imageUrl: sanitizeUrl(product.imageUrl || '/images/products/placeholder.jpg')
    };
}

/**
 * CSRFトークンの生成（将来の実装用）
 * @returns {string} CSRFトークン
 */
function generateCSRFToken() {
    // 簡易的なトークン生成（本番環境ではサーバーサイドで生成すべき）
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * CSRFトークンの検証（将来の実装用）
 * @param {string} token - 検証するトークン
 * @returns {boolean} 検証結果
 */
function verifyCSRFToken(token) {
    // 現在は常にtrueを返す（将来的に実装）
    return true;
}

// グローバルに公開
if (typeof window !== 'undefined') {
    window.SecurityUtils = {
        escapeHtml,
        escapeAttr,
        sanitizeUrl,
        createSafeProductDisplay,
        generateCSRFToken,
        verifyCSRFToken
    };
}

// モジュールとしてもエクスポート（必要に応じて）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        escapeHtml,
        escapeAttr,
        sanitizeUrl,
        createSafeProductDisplay,
        generateCSRFToken,
        verifyCSRFToken
    };
}