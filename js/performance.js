/**
 * パフォーマンス最適化
 * 画像の遅延読み込み、WebP対応、リソース最適化
 */

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupWebPSupport();
        this.setupResourceOptimization();
        this.setupCriticalResourceHints();
    }

    // 遅延読み込み設定
    setupLazyLoading() {
        // Intersection Observer API をサポートしているかチェック
        if ('IntersectionObserver' in window) {
            this.lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                // ビューポートの100px手前で読み込み開始
                rootMargin: '100px'
            });

            // 既存の画像に遅延読み込みを適用
            this.setupExistingImages();
        }

        // フォールバック: Intersection Observerが利用できない場合
        else {
            this.setupScrollBasedLazyLoading();
        }
    }

    setupExistingImages() {
        // data-src属性を持つ画像を検索
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.lazyImageObserver.observe(img);
        });

        // 動的に追加される画像のための監視
        this.setupDynamicImageObserver();
    }

    setupDynamicImageObserver() {
        // DOM変更を監視して新しい画像に遅延読み込みを適用
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // 新しく追加された img[data-src] 要素
                        const newLazyImages = node.querySelectorAll ? 
                            node.querySelectorAll('img[data-src]') : [];
                        
                        newLazyImages.forEach(img => {
                            this.lazyImageObserver.observe(img);
                        });
                        
                        // 追加されたノード自体がimg[data-src]の場合
                        if (node.tagName === 'IMG' && node.hasAttribute('data-src')) {
                            this.lazyImageObserver.observe(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    loadImage(img) {
        // WebP対応の確認と画像読み込み
        const src = img.dataset.src;
        if (!src) return;

        // WebP対応の場合は拡張子を変換
        const optimizedSrc = this.getOptimizedImageSrc(src);
        
        // 新しいImageオブジェクトで事前読み込み
        const imageLoader = new Image();
        imageLoader.onload = () => {
            img.src = optimizedSrc;
            img.classList.add('loaded');
            img.classList.remove('lazy');
        };
        imageLoader.onerror = () => {
            // WebPに失敗した場合は元の画像を使用
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('lazy');
        };
        imageLoader.src = optimizedSrc;
    }

    setupScrollBasedLazyLoading() {
        // フォールバック: スクロールベースの遅延読み込み
        let lazyImageTargets = document.querySelectorAll('img[data-src]');
        
        const lazyLoad = () => {
            lazyImageTargets.forEach(img => {
                if (this.isInViewport(img)) {
                    this.loadImage(img);
                    lazyImageTargets = Array.from(lazyImageTargets).filter(target => target !== img);
                }
            });

            if (lazyImageTargets.length === 0) {
                document.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
                window.removeEventListener('orientationchange', lazyLoad);
            }
        };

        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // WebP対応設定
    setupWebPSupport() {
        this.webpSupported = this.checkWebPSupport();
    }

    checkWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    getOptimizedImageSrc(src) {
        // WebPサポートがある場合は拡張子を変換
        if (this.webpSupported && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png'))) {
            return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return src;
    }

    // リソース最適化
    setupResourceOptimization() {
        // CSS/JSファイルの圧縮版使用
        this.optimizeResourceUrls();
        
        // 画像の最適化
        this.setupImageOptimization();
        
        // フォントの最適化
        this.setupFontOptimization();
    }

    optimizeResourceUrls() {
        // 本番環境でmin版のリソースを使用
        if (window.location.hostname !== 'localhost') {
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                if (!link.href.includes('.min.')) {
                    link.href = link.href.replace(/\.css$/, '.min.css');
                }
            });

            document.querySelectorAll('script[src]').forEach(script => {
                if (!script.src.includes('.min.')) {
                    script.src = script.src.replace(/\.js$/, '.min.js');
                }
            });
        }
    }

    setupImageOptimization() {
        // 画像の自動リサイズ
        document.addEventListener('DOMContentLoaded', () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                this.optimizeImageSize(img);
            });
        });
    }

    optimizeImageSize(img) {
        img.addEventListener('load', () => {
            const container = img.parentElement;
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            
            // 表示サイズより大きい画像の場合、最適化を推奨
            if (img.naturalWidth > containerWidth * 2 || img.naturalHeight > containerHeight * 2) {
                console.info(`Image optimization recommended for: ${img.src}`);
            }
        });
    }

    setupFontOptimization() {
        // フォントの事前読み込み
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap'
        ];

        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            link.onload = () => {
                link.rel = 'stylesheet';
            };
            document.head.appendChild(link);
        });
    }

    // 重要リソースのヒント
    setupCriticalResourceHints() {
        // DNS事前解決
        const domains = ['fonts.googleapis.com', 'stamp-e20f2.web.app'];
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });

        // 重要リソースの事前読み込み
        this.preloadCriticalResources();
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: '/css/tailwind-compiled.css', as: 'style' },
            { href: '/firebase-config.js', as: 'script' },
            { href: '/js/main.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'script') {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }

    // パフォーマンス監視
    setupPerformanceMonitoring() {
        // Core Web Vitals の測定
        this.measureCoreWebVitals();
        
        // カスタムメトリクスの測定
        this.measureCustomMetrics();
    }

    measureCoreWebVitals() {
        // FCP (First Contentful Paint)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('FCP:', entry.startTime);
            }
        }).observe({ entryTypes: ['paint'] });

        // LCP (Largest Contentful Paint)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                console.log('LCP:', entry.startTime);
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // CLS (Cumulative Layout Shift)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                }
            }
        }).observe({ entryTypes: ['layout-shift'] });
    }

    measureCustomMetrics() {
        // ページ読み込み完了時間
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log('Page Load Time:', loadTime);
        });

        // インタラクションの応答時間
        document.addEventListener('click', (e) => {
            const startTime = performance.now();
            requestAnimationFrame(() => {
                const duration = performance.now() - startTime;
                if (duration > 100) { // 100ms以上の場合は警告
                    console.warn('Slow interaction:', duration, 'ms');
                }
            });
        });
    }
}

// パフォーマンス最適化の初期化
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// 画像の遅延読み込み用スタイル
const style = document.createElement('style');
style.textContent = `
    img.lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    img[data-src] {
        background: #f3f4f6;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23d1d5db'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 48px 48px;
    }
`;
document.head.appendChild(style);