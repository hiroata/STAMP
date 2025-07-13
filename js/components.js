// 共通コンポーネント - DRY原則に基づく実装

// パスの深度を計算する関数
function getBasePath() {
    const path = window.location.pathname;
    // pages/categories/ 内のページかどうかを判定
    if (path.includes('/pages/categories/')) {
        return '../../';
    } else if (path.includes('/pages/')) {
        return '../';
    } else {
        return '';
    }
}

// ヘッダーコンポーネント
function createHeader() {
    const basePath = getBasePath();
    return `
    <header class="w-full">
        <!-- 上部の薄い茶色バー -->
        <div class="bg-red-50 py-1 text-center text-xs text-gray-700">
            広島で切手の買取・販売を手がける専門店
        </div>
        
        <!-- メインヘッダー -->
        <div class="bg-white border-b-4 border-red-600">
            <div class="container mx-auto px-4">
                <!-- モバイル版ヘッダー -->
                <div class="md:hidden">
                    <!-- 上段：店名と電話番号 -->
                    <div class="flex items-center justify-between py-3">
                        <h1 class="text-lg font-bold text-gray-800">
                            <a href="${basePath}index.html" class="hover:text-red-700 transition-colors">ワールドスタンプ広島</a>
                        </h1>
                        <a href="tel:082-XXX-XXXX" class="flex items-center gap-1">
                            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <span class="text-base font-bold text-gray-900">082-XXX-XXXX</span>
                        </a>
                    </div>
                    <!-- 下段：営業時間とお問い合わせボタン -->
                    <div class="flex items-center justify-between pb-3">
                        <p class="text-xs text-gray-600">平日9:30-18:00 休業日：月水木・臨時休業あり</p>
                        <a href="${basePath}contact.html" class="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            お問い合わせ
                        </a>
                    </div>
                </div>

                <!-- デスクトップ版ヘッダー -->
                <div class="hidden md:flex items-center justify-between py-4">
                    <!-- 左側：ロゴとショップ名 -->
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-600">
                            <span class="text-xs font-bold text-red-900">WS</span>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">
                                <a href="${basePath}index.html" class="hover:text-red-700 transition-colors">ワールドスタンプ広島</a>
                            </h1>
                        </div>
                    </div>
                    
                    <!-- 右側：電話番号とお問い合わせボタン -->
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <div class="flex items-center justify-end gap-2">
                                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <a href="tel:082-XXX-XXXX" class="text-3xl font-bold text-gray-900 hover:text-red-600 transition-colors">082-XXX-XXXX</a>
                            </div>
                            <p class="text-sm text-gray-600">平日9:30-18:00 休業日：月水木・臨時休業あり</p>
                        </div>
                        <a href="${basePath}contact.html" class="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 text-base">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            お問い合わせ
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- モバイルナビゲーション -->
        <div class="bg-red-50 border-b border-red-200 md:hidden">
            <div class="container mx-auto px-4">
                <div class="py-3">
                    <button id="mobile-nav-toggle" class="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span class="font-medium text-gray-700">メニュー</span>
                        <svg class="w-5 h-5 text-gray-500 transition-transform" id="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- ナビゲーションバー（デスクトップのみ） -->
        <div class="bg-red-50 border-b border-red-200 hidden md:block">
            <div class="container mx-auto px-4">
                <nav class="flex items-center justify-center gap-8 py-3">
                    <a href="${basePath}index.html" class="text-gray-700 hover:text-red-700 font-medium transition-colors">HOME</a>
                    <a href="${basePath}features.html" class="text-gray-700 hover:text-red-700 font-medium transition-colors">当店の特徴</a>
                    <a href="${basePath}sell.html" class="text-gray-700 hover:text-red-700 font-medium transition-colors">切手を売りたい</a>
                    <a href="${basePath}buy.html" class="text-gray-700 hover:text-red-700 font-medium transition-colors">切手を買いたい</a>
                    <a href="${basePath}appraiser.html" class="text-gray-700 hover:text-red-700 font-medium transition-colors">鑑定人と切手</a>
                    <a href="${basePath}about.html" class="text-gray-700 hover:text-red-700 font-medium transition-colors">店舗アクセス</a>
                    <a href="${basePath}qna.html" class="text-gray-700 hover:text-red-700 font-medium transition-colors">Q&A</a>
                </nav>
            </div>
        </div>
        
        <!-- モバイルメニュー -->
        <div id="mobile-menu">
            <div class="mobile-menu-content">
                <div class="mobile-menu-header">
                    <h3 class="font-bold text-gray-800">メニュー</h3>
                    <button class="mobile-menu-close" aria-label="メニューを閉じる">
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <nav class="p-5">
                    <!-- 電話番号とお問い合わせ -->
                    <div class="mb-6 p-4 bg-red-50 rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                            <a href="tel:082-XXX-XXXX" class="text-lg font-bold text-gray-900">082-XXX-XXXX</a>
                        </div>
                        <p class="text-xs text-gray-600 mb-3">平日9:30-18:00 休業日：月水木・臨時休業あり</p>
                        <a href="${basePath}contact.html" class="block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-center">
                            お問い合わせ
                        </a>
                    </div>
                    
                    <!-- ナビゲーションリンク -->
                    <ul class="space-y-1">
                        <li><a href="${basePath}index.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">HOME</a></li>
                        <li><a href="${basePath}features.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">当店の特徴</a></li>
                        <li><a href="${basePath}sell.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">切手を売りたい</a></li>
                        <li><a href="${basePath}buy.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">切手を買いたい</a></li>
                        <li><a href="${basePath}appraiser.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">鑑定人と切手</a></li>
                        <li><a href="${basePath}about.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">店舗アクセス</a></li>
                        <li><a href="${basePath}qna.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors">Q&A</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>`;
}

// フッターコンポーネント
function createFooter() {
    const basePath = getBasePath();
    return `
    <footer class="bg-gray-100 mt-12">
        <div class="container mx-auto px-4 py-8">
            <!-- 配送・送料について -->
            <div class="bg-white rounded-lg p-6 mb-8 border border-gray-200">
                <h3 class="text-lg font-bold text-gray-800 mb-4">配送・送料について</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 class="font-bold text-[#C41E3A] mb-2">郵便局（書留便など）</h4>
                        <p class="text-sm text-gray-600 mb-2">
                            郵便局の書留便、ゆうパックなどでお送りします。お客様の玄関先まで確実にお届けします。
                        </p>
                        <p class="text-sm font-bold text-gray-800">料金は全国一律650円です。</p>
                    </div>
                    <div>
                        <h4 class="font-bold text-[#C41E3A] mb-2">郵便局（特定記録便など）</h4>
                        <p class="text-sm text-gray-600 mb-2">
                            郵便局の特定記録便などでお送りします。基本的にお客様の郵便受箱に配送となります。
                        </p>
                        <p class="text-sm font-bold text-gray-800 mb-2">料金は全国一律400円です。</p>
                        <p class="text-xs text-gray-500">
                            ※特定記録便は万が一、亡失、誤配、商品破損、盗難などがあった場合に補償を受ける事ができません。<br />
                            ※平日のみの配達となります。土日、祝日は配達がありません。
                        </p>
                    </div>
                    <div>
                        <h4 class="font-bold text-[#C41E3A] mb-2">店頭お受け取り</h4>
                        <p class="text-sm text-gray-600 mb-2">
                            ご注文品の用意が整いましたら、メールでお知らせいたしますので、メール受信後に店舗（広島市）にてお受け取りください。
                        </p>
                        <a href="${basePath}about.html" class="text-sm text-[#C41E3A] hover:underline">店舗案内はこちら »</a>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div>
                    <h3 class="font-bold text-gray-800 mb-4">ワールドスタンプ広島</h3>
                    <p class="text-sm text-gray-600 mb-2">高品質な切手を適正価格で</p>
                    <p class="text-sm text-gray-600">初心者から愛好家まで幅広くサポート</p>
                </div>
                <div>
                    <h3 class="font-bold text-gray-800 mb-4">ショッピングガイド</h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="${basePath}order-guide.html" class="text-sm text-gray-600 hover:text-[#C41E3A] underline">
                                ご注文方法
                            </a>
                        </li>
                        <li>
                            <a href="${basePath}payment-guide.html" class="text-sm text-gray-600 hover:text-[#C41E3A] underline">
                                お支払い方法
                            </a>
                        </li>
                        <li>
                            <a href="${basePath}about.html" class="text-sm text-gray-600 hover:text-[#C41E3A] underline">
                                店舗案内
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-gray-800 mb-4">お客様サポート</h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="${basePath}faq.html" class="text-sm text-gray-600 hover:text-[#C41E3A] underline">
                                よくあるご質問
                            </a>
                        </li>
                        <li>
                            <a href="${basePath}contact.html" class="text-sm text-gray-600 hover:text-[#C41E3A] underline">
                                お問い合わせ
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-bold text-gray-800 mb-4">お問い合わせ</h3>
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <svg
                                class="w-5 h-5"
                                style="color: #c41e3a"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                ></path>
                            </svg>
                            <span class="text-sm text-gray-700 font-medium">082-XXX-XXXX</span>
                        </div>
                        <p class="text-xs text-gray-600 ml-7">
                            平日 9:30-18:00<br />
                            定休日: 月・水・木
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-gray-800 text-white py-4">
            <div class="container mx-auto px-4 text-center">
                <p class="text-sm">© 2024 ワールドスタンプ広島 All Rights Reserved.</p>
                <p class="text-xs mt-2">
                    <a href="${basePath}admin-login.html" class="text-gray-400 hover:text-gray-300">管理者ログイン</a>
                </p>
            </div>
        </div>
    </footer>`;
}

// モバイルメニューの初期化
function initializeMobileMenu() {
    const mobileMenuBtns = document.querySelectorAll('#mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavIcon = document.getElementById('mobile-nav-icon');

    function openMobileMenu() {
        mobileMenu?.classList.add('show');
        mobileMenuBtns.forEach(btn => btn?.classList.add('open'));
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu?.classList.remove('show');
        mobileMenuBtns.forEach(btn => btn?.classList.remove('open'));
        document.body.style.overflow = '';
    }

    mobileMenuBtns.forEach(btn => {
        btn?.addEventListener('click', openMobileMenu);
    });
    mobileMenuClose?.addEventListener('click', closeMobileMenu);
    
    // Mobile navigation toggle
    if (mobileNavToggle && mobileMenu) {
        mobileNavToggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('show')) {
                closeMobileMenu();
                mobileNavIcon.style.transform = 'rotate(0deg)';
            } else {
                openMobileMenu();
                mobileNavIcon.style.transform = 'rotate(180deg)';
            }
        });
    }

    // メニュー外をクリックしたら閉じる
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    // メニューリンクをクリックしたら閉じる
    document.querySelectorAll('#mobile-menu a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// コンポーネントの読み込み
function loadComponents() {
    // ヘッダーの挿入
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = createHeader();
        initializeMobileMenu();
    }

    // フッターの挿入
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = createFooter();
    }
}

// DOMContentLoadedで自動実行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}

// エクスポート（必要な場合）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createHeader, createFooter, initializeMobileMenu, loadComponents };
}
