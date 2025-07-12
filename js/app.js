// js/app.js

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    loadPageContent();
});

// ページコンテンツの動的読み込み
async function loadPageContent() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        return;
    }

    // 現在のページのパスを取得
    let page = window.location.pathname.split('/').pop();
    if (page === '' || page === 'index.html') {
        page = 'index';
    } else {
        page = page.replace('.html', '');
    }

    try {
        // コンテンツファイルをフェッチ
        const response = await fetch(`content/${page}.content.html`);
        if (!response.ok) {
            throw new Error('Content not found');
        }
        const content = await response.text();

        // コンテンツを挿入
        mainContent.innerHTML = content;
    } catch (error) {
        console.error('Error loading page content:', error);
        mainContent.innerHTML = '<p>ページの読み込みに失敗しました。</p>';
    }
}
