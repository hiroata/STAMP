import Link from 'next/link';
// import ProductCard from './components/ProductCard'; // 仮のコンポーネント
// import { getNewProducts } from '../lib/firebase'; // 仮の関数

export default async function Home() {
    // const newProducts = await getNewProducts();

    return (
        <>
            {/* ヒーローバナー */}
            <section
                className="mb-8 text-white rounded-lg p-8 text-center"
                style={{ background: 'linear-gradient(to right, #DC2626, #B91C1C)' }}
            >
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                    厳選された切手コレクションをご提供
                </h1>
                <p className="text-lg mb-6">
                    入門者からベテランコレクターまで、どなたにも満足いただける品揃え
                </p>
                <Link href="/products" className="btn btn-secondary inline-block">
                    全商品を見る
                </Link>
            </section>

            {/* 新着商品 */}
            <section className="mb-10">
                <h2
                    className="text-xl md:text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2"
                    style={{ borderColor: '#C41E3A' }}
                >
                    新着商品
                </h2>
                <div
                    id="new-products-container"
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-3"
                >
                    {/* {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))} */}
                </div>
            </section>

            {/* 当店の特徴 */}
            <section className="mb-12">
                <h2
                    className="text-xl md:text-2xl font-bold text-gray-800 mb-8 pb-2 border-b-2"
                    style={{ borderColor: '#C41E3A' }}
                >
                    切手愛好家が心から楽しめる、特別な理由のあるショップです
                </h2>

                <div className="grid grid-cols-1 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">📮</div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                                    消印つき切手の圧倒的な品揃え！
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    ��客様のほとんどが消印愛好家というだけあって、在庫量は圧巻です。
                                    国内でもトップクラスの充実度！
                                    消印つき切手の売買なら、どこよりも頼れる専門店です。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">🌍</div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                                    海外切手の深い知識で差をつける！
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    各国切手の価値判断には高度な専門性が求められます。
                                    正確な評価ができるからこそ、適正価格での査定が可能に。
                                    海外切手をお持ちなら、ぜひ専門知識豊富な当店へ。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">🤝</div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                                    コレクター仲間との出会いの場
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    県内外から多くの切手ファンが訪れる交流スポット。
                                    同じ趣味を持つ方々と語り合い、新しい発見があるのも当店の醍醐味です。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">✨</div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2 text-lg">
                                    店主自身が熱心な愛好家
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    査定担当者も長年の収集家だからこそ、お客様の気持ちに共感できます。
                                    切手の魅力や価値を深く理解し、楽しい会話も弾みます！
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 当店のサービス */}
                <div className="bg-red-50 rounded-lg p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        売却も購入も、お客様のニーズに幅広く対応いたします。
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="bg-white rounded-lg p-6">
                            <h4 className="font-bold text-red-600 mb-3">切手を売りたい方</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                専門知識を活かした公正な査定価格でお応えします。
                            </p>
                            <Link href="/sell" className="text-red-600 hover:underline font-medium">
                                詳しく���る »
                            </Link>
                        </div>
                        <div className="bg-white rounded-lg p-6">
                            <h4 className="font-bold text-red-600 mb-3">切手を買いたい方</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                お探しの一枚がきっと見つかる充実の在庫
                            </p>
                            <Link href="/buy" className="text-red-600 hover:underline font-medium">
                                詳しく見る »
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* お客様の声 */}
            <section className="mb-10">
                <h2
                    className="text-xl md:text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2"
                    style={{ borderColor: '#C41E3A' }}
                >
                    お客様の声
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600 mb-2">
                            「コレクターの集まる場所と聞いて持ち込みました。大切なコレクションが次の方に受け継がれるのは喜ばしいですね。査定額も適切でした。��
                        </p>
                        <p className="text-xs text-gray-500 text-right">- 東京都 F様</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600 mb-2">
                            「他社では詳しい説明もなく低い査定でしたが、こちらで再査定してもらいました。額面の差に驚き、専門店の大切さを実感しました。」
                        </p>
                        <p className="text-xs text-gray-500 text-right">- 神奈川県 T様</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600 mb-2">
                            「査定を断られた品を郵送対応で買い取っていただけました。先に売ってしまった分も、こちらにお任せすればよかったです。」
                        </p>
                        <p className="text-xs text-gray-500 text-right">- 大阪府 I様</p>
                    </div>
                </div>
            </section>
        </>
    );
}
