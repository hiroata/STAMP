const fs = require('fs');
const path = require('path');

// 修正が必要なファイルとパターン
const filesToUpdate = [
    'index.html',
    'category.html',
    'about.html',
    'contact.html',
    'buy.html',
    'sell.html',
    'features.html',
    'faq.html',
    'appraiser.html',
    'products.html',
    'qna.html',
    'search-results.html',
    'simple-cart.html',
    'simple-search.html',
    'privacy.html',
    'terms.html'
];

// カテゴリーファイルへのリンクを修正
function updateCategoryLinks() {
    filesToUpdate.forEach(filename => {
        const filePath = path.join(__dirname, '..', filename);
        
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // category-*.html を pages/categories/category-*.html に変更
            content = content.replace(/href="category-([^"]+)\.html"/g, 'href="pages/categories/category-$1.html"');
            
            // category.html はそのまま
            content = content.replace(/href="pages\/categories\/category\.html"/g, 'href="category.html"');
            
            fs.writeFileSync(filePath, content);
            console.log(`Updated: ${filename}`);
        }
    });

    // カテゴリーファイル内のリンクも修正
    const categoryDir = path.join(__dirname, '..', 'pages', 'categories');
    const categoryFiles = fs.readdirSync(categoryDir);
    
    categoryFiles.forEach(filename => {
        if (filename.endsWith('.html')) {
            const filePath = path.join(categoryDir, filename);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 他のカテゴリーページへのリンクを修正
            content = content.replace(/href="category-([^"]+)\.html"/g, 'href="category-$1.html"');
            
            // トップページとメインページへのリンク
            content = content.replace(/href="index\.html"/g, 'href="../../index.html"');
            content = content.replace(/href="category\.html"/g, 'href="../../category.html"');
            content = content.replace(/href="about\.html"/g, 'href="../../about.html"');
            content = content.replace(/href="contact\.html"/g, 'href="../../contact.html"');
            content = content.replace(/href="buy\.html"/g, 'href="../../buy.html"');
            content = content.replace(/href="sell\.html"/g, 'href="../../sell.html"');
            
            // CSS と JS パスを修正
            content = content.replace(/href="css\/([^"]+)"/g, 'href="../../css/$1"');
            content = content.replace(/src="js\/([^"]+)"/g, 'src="../../js/$1"');
            
            fs.writeFileSync(filePath, content);
            console.log(`Updated category: ${filename}`);
        }
    });
}

updateCategoryLinks();
console.log('Category links update completed!');