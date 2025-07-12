// stamp-next/src/app/components/Footer.js
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 店舗情報 */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">ワールドスタンプ広島</h3>
                        <p className="text-sm text-gray-300 mb-2">〒XXX-XXXX</p>
                        <p className="text-sm text-gray-300 mb-2">広島県広島市中区XXX</p>
                        <p className="text-sm text-gray-300 mb-2">TEL: 082-XXX-XXXX</p>
                        <p className="text-sm text-gray-300">営業時間: 平日9:30-18:00</p>
                    </div>

                    {/* サイトマップ */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">サイトマップ</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    ホーム
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/features"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    当店の特徴
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sell"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    切手を売りたい
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/buy"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    切手を買いたい
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    店舗アクセス
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    お問い合わせ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* その他 */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">その他</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    プライバシーポリシー
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    利用規約
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin-login"
                                    className="text-sm text-gray-300 hover:text-white transition-colors"
                                >
                                    管理者ログイン
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; 2024 ワールドスタンプ広島. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
