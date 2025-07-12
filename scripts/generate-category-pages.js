// カテゴリーページ生成スクリプト
// DRY原則に基づき、単一のテンプレートから全カテゴリーページを生成

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// カテゴリーデータ定義
const categories = {
    'commemorative': {
        name: '記念切手',
        description: '日本の歴史的な出来事や文化を記念して発行された切手のコレクションです。',
        subcategories: {
            'meiji': { name: '明治記念', description: '明治時代の重要な出来事を記念した切手' },
            'taisho': { name: '大正記念', description: '大正時代の記念切手コレクション' },
            'showa-prewar': { name: '昭和戦前記念', description: '昭和初期から戦前までの記念切手' },
            'showa-postwar': { name: '昭和戦後記念', description: '戦後復興期から高度成長期の記念切手' },
            'heisei': { name: '平成記念', description: '平成時代の様々な記念切手' },
            'reiwa': { name: '令和記念', description: '新時代令和の記念切手' },
            'olympic': { name: 'オリンピック記念', description: '各種オリンピック大会の記念切手' },
            'kokutai': { name: '国体記念', description: '国民体育大会の記念切手' },
            'culture': { name: '文化記念', description: '日本の文化財や伝統を記念した切手' },
            'sheet': { name: '記念シート', description: '特別な記念切手シートコレクション' }
        }
    },
    'foreign': {
        name: '外国切手',
        description: '世界各国の貴重な切手コレクションです。',
        subcategories: {
            'usa': { name: 'アメリカ', description: 'アメリカ合衆国の切手コレクション' },
            'uk': { name: 'イギリス', description: 'イギリスの歴史ある切手' },
            'france': { name: 'フランス', description: 'フランスの芸術的な切手' },
            'germany': { name: 'ドイツ', description: 'ドイツの精密な切手デザイン' },
            'china': { name: '中国', description: '中国の伝統的な切手' },
            'korea': { name: '韓国', description: '韓国の現代的な切手' },
            'australia': { name: 'オーストラリア', description: 'オーストラリアの自然を描いた切手' },
            'canada': { name: 'カナダ', description: 'カナダの美しい切手' },
            'others': { name: 'その他の国', description: '世界各国の珍しい切手' }
        }
    },
    'nenga': {
        name: '年賀切手',
        description: '毎年発行される年賀切手のコレクションです。',
        subcategories: {
            'showa': { name: '昭和年賀', description: '昭和時代の年賀切手' },
            'heisei': { name: '平成年賀', description: '平成時代の年賀切手' },
            'reiwa': { name: '令和年賀', description: '令和時代の年賀切手' },
            'otoshidama': { name: 'お年玉シート', description: '年賀はがきのお年玉賞品切手シート' }
        }
    },
    'furusato': {
        name: 'ふるさと切手',
        description: '日本各地の風景や文化を描いたふるさと切手です。',
        subcategories: {
            'landscape': { name: '風景', description: '日本各地の美しい風景' },
            'flower': { name: '花', description: '地域の特産花を描いた切手' },
            'region': { name: '地方版', description: '各地方限定のふるさと切手' }
        }
    },
    'park': {
        name: '国立公園切手',
        description: '日本の美しい国立公園を描いた切手シリーズです。',
        subcategories: {
            'first': { name: '第1次国立公園', description: '初期の国立公園切手シリーズ' },
            'second': { name: '第2次国立公園', description: '第2次発行の国立公園切手' },
            'fuji': { name: '富士箱根', description: '富士箱根国立公園の切手' },
            'nikko': { name: '日光', description: '日光国立公園の切手' },
            'aso': { name: '阿蘇', description: '阿蘇国立公園の切手' },
            'daisen': { name: '大山', description: '大山国立公園の切手' },
            'yoshino': { name: '吉野熊野', description: '吉野熊野国立公園の切手' },
            'quasi': { name: '準国立公園', description: '準国立公園の切手' }
        }
    },
    'special': {
        name: '特殊切手',
        description: '様々なテーマで発行された特殊切手のコレクションです。',
        subcategories: {
            'greeting': { name: 'グリーティング', description: '季節の挨拶用切手' },
            'anime': { name: 'アニメ', description: '人気アニメキャラクターの切手' },
            'celebration': { name: '慶事', description: '慶事用の特別切手' },
            'condolence': { name: '弔事', description: '弔事用の切手' },
            'frame': { name: 'フレーム切手', description: 'オリジナルフレーム付き切手' },
            'summer': { name: '夏のグリーティング', description: '夏の挨拶用切手' },
            'art': { name: '芸術', description: '芸術作品を題材にした切手' },
            'seal': { name: 'シール切手', description: 'シール式の特殊切手' }
        }
    },
    'okinawa': {
        name: '沖縄切手',
        description: '沖縄返還前後の貴重な切手コレクションです。',
        subcategories: {
            'ryukyu': { name: '琉球切手', description: '琉球政府時代の切手' },
            'us': { name: '米国施政下', description: 'アメリカ統治時代の切手' },
            'provisional': { name: '暫定切手', description: '返還前後の暫定切手' },
            'airmail': { name: '航空切手', description: '沖縄の航空切手' },
            'express': { name: '速達切手', description: '沖縄の速達切手' },
            'revenue': { name: '収入印紙', description: '沖縄の収入印紙' }
        }
    },
    'theme': {
        name: 'テーマ別切手',
        description: 'テーマごとに分類された切手コレクションです。',
        subcategories: {
            'animals': { name: '動物', description: '様々な動物を描いた切手' },
            'flowers': { name: '花・植物', description: '美しい花や植物の切手' },
            'trains': { name: '鉄道', description: '鉄道をテーマにした切手' },
            'ships': { name: '船舶', description: '船舶を描いた切手' },
            'space': { name: '宇宙', description: '宇宙開発記念切手' },
            'sports': { name: 'スポーツ', description: 'スポーツをテーマにした切手' },
            'art': { name: '美術', description: '美術作品を題材にした切手' }
        }
    },
    'limited': {
        name: '限定切手',
        description: '地域限定や期間限定で発行された特別な切手です。',
        subcategories: {
            'postoffice': { name: '郵便局限定', description: '特定郵便局限定の切手' },
            'formcard': { name: 'フォルムカード', description: '特殊形状のカード切手' },
            'premium': { name: 'プレミアム', description: 'プレミアム限定切手' },
            'frame': { name: 'フレーム切手', description: '写真付きフレーム切手' },
            'special': { name: '特別限定版', description: '特別な限定発行切手' },
            'nenga-pack': { name: '年賀パック', description: '年賀切手の限定パック' }
        }
    },
    'supplies': {
        name: '切手用品',
        description: '切手収集に必要な各種用品を取り揃えています。',
        subcategories: {
            'album': { name: 'アルバム', description: '切手保管用アルバム' },
            'stockbook': { name: 'ストックブック', description: 'ストックブック各種' },
            'mount': { name: 'マウント', description: '切手マウント用品' },
            'tweezers': { name: 'ピンセット', description: '切手用ピンセット' },
            'loupe': { name: 'ルーペ', description: '切手観察用ルーペ' },
            'catalog': { name: 'カタログ', description: '切手カタログ各種' }
        }
    }
};

// HTMLテンプレート
function generateHTML(category, subcategory, data) {
    const title = subcategory ? data.subcategories[subcategory].name : data.name;
    const description = subcategory ? data.subcategories[subcategory].description : data.description;
    const breadcrumb = subcategory ? 
        `<a href="category.html" class="text-gray-600 hover:text-gray-800">カテゴリー一覧</a>
         <span class="mx-2">&gt;</span>
         <a href="category-${category}.html" class="text-gray-600 hover:text-gray-800">${data.name}</a>
         <span class="mx-2">&gt;</span>
         <span class="text-gray-800">${data.subcategories[subcategory].name}</span>` :
        `<a href="category.html" class="text-gray-600 hover:text-gray-800">カテゴリー一覧</a>
         <span class="mx-2">&gt;</span>
         <span class="text-gray-800">${data.name}</span>`;
    
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | ワールドスタンプ広島</title>
    <link rel="stylesheet" href="css/common.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media (max-width: 639px) {
            body { font-size: 18px; }
            a, button { min-height: 48px; padding: 12px 16px; }
            .phone-number { text-decoration: underline; color: #1976d2; }
        }
        .product-card {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body class="bg-gray-50">
    <div id="header-container"></div>

    <main class="container mx-auto px-4 py-8">
        <!-- パンくずリスト -->
        <nav class="text-sm mb-6">
            <a href="index.html" class="text-gray-600 hover:text-gray-800">ホーム</a>
            <span class="mx-2">&gt;</span>
            ${breadcrumb}
        </nav>

        <h1 class="text-3xl font-bold mb-6">${title}</h1>

        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <p class="text-gray-700 leading-relaxed">${description}</p>
        </div>

        <!-- 商品グリッド -->
        <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <!-- 商品カードはJavaScriptで動的に生成されます -->
        </div>

        <!-- 注文方法 -->
        <div class="bg-blue-50 rounded-lg p-6">
            <h2 class="text-xl font-bold mb-4">ご注文方法</h2>
            <p class="mb-2">お電話でのご注文：<span class="phone-number font-bold">082-241-3581</span></p>
            <p>FAXでのご注文：082-241-3581</p>
        </div>
    </main>

    <div id="footer-container"></div>

    <script src="js/components.js"></script>
    <script>
        // カテゴリー情報を設定
        const categoryInfo = {
            main: '${category}',
            sub: ${subcategory ? `'${subcategory}'` : 'null'},
            name: '${title}',
            description: '${description}'
        };
        
        // 商品を動的に読み込み
        async function loadCategoryProducts() {
            try {
                if (window.UnifiedStorageManager) {
                    const products = await window.UnifiedStorageManager.getProductsByCategory(
                        categoryInfo.sub ? \`\${categoryInfo.main}-\${categoryInfo.sub}\` : categoryInfo.main
                    );
                    displayProducts(products);
                }
            } catch (error) {
                console.error('商品の読み込みエラー:', error);
            }
        }
        
        function displayProducts(products) {
            const grid = document.getElementById('products-grid');
            if (products.length === 0) {
                grid.innerHTML = '<p class="col-span-full text-center text-gray-500">現在、この カテゴリーに商品はありません。</p>';
                return;
            }
            
            grid.innerHTML = products.map(product => \`
                <div class="product-card bg-white rounded-lg shadow-sm overflow-hidden" 
                     onclick="alert('商品詳細ページは準備中です')">
                    <img src="\${product.imageUrl || 'https://via.placeholder.com/300'}" 
                         alt="\${product.title}" 
                         class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <h3 class="font-bold mb-2">\${product.title}</h3>
                        <p class="text-gray-600 text-sm mb-2">\${product.description || ''}</p>
                        <p class="text-lg font-bold text-red-600">¥\${product.price?.toLocaleString() || '価格未定'}</p>
                    </div>
                </div>
            \`).join('');
        }
        
        // ページ読み込み時に商品を読み込み
        document.addEventListener('DOMContentLoaded', loadCategoryProducts);
    </script>
</body>
</html>`;
}

// カテゴリーページ生成
async function generatePages() {
    const outputDir = path.join(__dirname, '..', 'generated');
    
    // 出力ディレクトリ作成
    await fs.mkdir(outputDir, { recursive: true });
    
    let generatedCount = 0;
    
    // メインカテゴリーページ生成
    for (const [categoryKey, categoryData] of Object.entries(categories)) {
        const filename = `category-${categoryKey}.html`;
        const html = generateHTML(categoryKey, null, categoryData);
        await fs.writeFile(path.join(outputDir, filename), html, 'utf8');
        console.log(`生成: ${filename}`);
        generatedCount++;
        
        // サブカテゴリーページ生成
        if (categoryData.subcategories) {
            for (const subcategoryKey of Object.keys(categoryData.subcategories)) {
                const subFilename = `category-${categoryKey}-${subcategoryKey}.html`;
                const subHtml = generateHTML(categoryKey, subcategoryKey, categoryData);
                await fs.writeFile(path.join(outputDir, subFilename), subHtml, 'utf8');
                console.log(`生成: ${subFilename}`);
                generatedCount++;
            }
        }
    }
    
    console.log(`\n✅ ${generatedCount}個のカテゴリーページを生成しました`);
    console.log(`📁 出力先: ${outputDir}`);
}

// 実行
generatePages().catch(console.error);