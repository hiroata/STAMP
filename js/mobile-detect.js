// モバイルデバイス検出とリダイレクト
(function() {
    // モバイルデバイスかどうかを判定
    function isMobileDevice() {
        // タッチデバイスかつ画面幅が768px未満
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 768;
        
        // UserAgentでも確認
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isMobileUA = mobileRegex.test(navigator.userAgent);
        
        return (hasTouch && isSmallScreen) || isMobileUA;
    }

    // 管理画面でのモバイルリダイレクト
    function checkAndRedirectMobile() {
        const currentPath = window.location.pathname;
        const isAdminPage = currentPath.includes('/admin.html');
        const isMobilePage = currentPath.includes('/admin-mobile.html');
        
        // モバイルデバイスで通常の管理画面にアクセスした場合
        if (isMobileDevice() && isAdminPage && !isMobilePage) {
            // URLパラメータに desktop=true がある場合はリダイレクトしない
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('desktop') !== 'true') {
                // モバイル管理画面へリダイレクト
                window.location.href = '/admin-mobile.html';
            }
        }
    }

    // ページ読み込み時にチェック
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndRedirectMobile);
    } else {
        checkAndRedirectMobile();
    }
})();