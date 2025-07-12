// stamp-next/src/app/components/Header.js
import Link from 'next/link';

const Header = () => {
    return (
        <header className="w-full">
            {/* 上部の薄い茶色バー */}
            <div className="bg-red-50 py-1 text-center text-xs text-gray-700">
                広島で切手の買取・販売を手がける専門店
            </div>

            {/* メインヘッダー */}
            <div className="bg-white border-b-4 border-red-600">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        {/* 左側：ロゴとショップ名 */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-600">
                                <span className="text-xs font-bold text-red-900">WS</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    <Link href="/" className="hover:text-red-700 transition-colors">
                                        ワールドスタンプ広島
                                    </Link>
                                </h1>
                            </div>
                        </div>

                        {/* 右側：電話番号、お問い合わせボタン、ハンバーガーメニュー */}
                        <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
                            {/* 電話番号（モバイルでは非表示） */}
                            <div className="text-right hidden sm:block">
                                <div className="flex items-center justify-end gap-2">
                                    <svg
                                        className="w-4 h-4 md:w-5 md:h-5 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        ></path>
                                    </svg>
                                    <a
                                        href="tel:082-XXX-XXXX"
                                        className="text-xl md:text-3xl font-bold text-gray-900 hover:text-red-600 transition-colors"
                                    >
                                        082-XXX-XXXX
                                    </a>
                                </div>
                                <p className="text-xs md:text-sm text-gray-600">
                                    平日9:30-18:00 休業�����：月水木・臨時休業あり
                                </p>
                            </div>
                            {/* お問い合わせボタン（モバイルでは非表示） */}
                            <Link
                                href="/contact"
                                className="hidden sm:flex bg-red-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-md hover:bg-red-700 transition-colors items-center gap-2 text-sm md:text-base"
                            >
                                <svg
                                    className="w-4 h-4 md:w-5 md:h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    ></path>
                                </svg>
                                お問い合わせ
                            </Link>
                            {/* ハンバーガーメニューボタン（モバイルのみ表示） */}
                            <button
                                id="mobile-menu-btn"
                                className="sm:hidden hamburger"
                                aria-label="メニューを開く"
                            >
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                                <span className="hamburger-line"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ナビゲーションバー（デスクトップのみ） */}
            <div className="bg-red-50 border-b border-red-200 hidden sm:block">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-center gap-8 py-3">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-red-700 font-medium transition-colors"
                        >
                            HOME
                        </Link>
                        <Link
                            href="/features"
                            className="text-gray-700 hover:text-red-700 font-medium transition-colors"
                        >
                            当店の特徴
                        </Link>
                        <Link
                            href="/sell"
                            className="text-gray-700 hover:text-red-700 font-medium transition-colors"
                        >
                            切手を売りたい
                        </Link>
                        <Link
                            href="/buy"
                            className="text-gray-700 hover:text-red-700 font-medium transition-colors"
                        >
                            切手を買いたい
                        </Link>
                        <Link
                            href="/appraiser"
                            className="text-gray-700 hover:text-red-700 font-medium transition-colors"
                        >
                            鑑定人と切手
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-red-700 font-medium transition-colors"
                        >
                            店舗アクセス
                        </Link>
                        <Link
                            href="/qna"
                            className="text-gray-700 hover:text-red-700 font-medium transition-colors"
                        >
                            Q&A
                        </Link>
                    </nav>
                </div>
            </div>

            {/* モバイルメニューはクライアントサイドで表示を制御するため、ここでは記述しない */}
        </header>
    );
};

export default Header;
