// サンプル商品データ初期化スクリプト
// 管理画面とフロントエンドで表示するためのテストデータを作成します

const sampleProducts = [
    {
        title: "1916年 立太子礼10銭",
        category: "記念切手",
        subCategory: "",
        status: "active",
        price: 160000,
        stock: 1,
        sku: "COMM-1916-01",
        description: "大正天皇立太子礼記念切手。希少な未使用品。",
        images: [],
        imageUrl: "/images/products/stamp-1916.jpg",
        soldOut: false,
        created_at: new Date('2024-01-15').toISOString(),
        updated_at: new Date('2024-01-15').toISOString()
    },
    {
        title: "文化人野口2版",
        category: "記念切手",
        subCategory: "",
        status: "active",
        price: 11500,
        stock: 1,
        sku: "CULT-NOGUCHI-02",
        description: "文化人シリーズ野口英世切手、第2版。",
        images: [],
        imageUrl: "/images/products/stamp-noguchi.jpg",
        soldOut: false,
        created_at: new Date('2024-01-20').toISOString(),
        updated_at: new Date('2024-01-20').toISOString()
    },
    {
        title: "2次新昭和 五重塔30銭縦帯",
        category: "普通切手",
        subCategory: "",
        status: "active",
        price: 42000,
        stock: 1,
        sku: "REG-SHOWA-30",
        description: "2次新昭和シリーズ、五重塔30銭の縦帯付き。",
        images: [],
        imageUrl: "/images/products/stamp-pagoda.jpg",
        soldOut: false,
        created_at: new Date('2024-01-25').toISOString(),
        updated_at: new Date('2024-01-25').toISOString()
    },
    {
        title: "1949年 地方博覧会記念",
        category: "記念切手",
        subCategory: "",
        status: "active",
        price: 3000,
        stock: 1,
        sku: "COMM-1949-EXPO",
        description: "戦後復興期の地方博覧会記念切手。",
        images: [],
        imageUrl: "/images/products/stamp-expo1949.jpg",
        soldOut: false,
        created_at: new Date('2024-02-01').toISOString(),
        updated_at: new Date('2024-02-01').toISOString()
    },
    {
        title: "無印刷切手",
        category: "エラー・変種切手",
        subCategory: "",
        status: "active",
        price: 1000,
        stock: 1,
        sku: "ERROR-BLANK-01",
        description: "印刷ミスによる無印刷切手。コレクター必見の一品。",
        images: [],
        imageUrl: "/images/products/stamp-blank.jpg",
        soldOut: false,
        created_at: new Date('2024-02-05').toISOString(),
        updated_at: new Date('2024-02-05').toISOString()
    },
    {
        title: "2次動植物 平等院30円 シート",
        category: "特殊切手",
        subCategory: "",
        status: "active",
        price: 56000,
        stock: 1,
        sku: "SPEC-BYODO-30",
        description: "2次動植物シリーズ、平等院30円の完全シート。",
        images: [],
        imageUrl: "/images/products/stamp-byodoin.jpg",
        soldOut: false,
        created_at: new Date('2024-02-10').toISOString(),
        updated_at: new Date('2024-02-10').toISOString()
    },
    {
        title: "切手趣味週間「ビードロを吹く女」",
        category: "特殊切手",
        subCategory: "",
        status: "active",
        price: 500,
        stock: 1,
        sku: "HOBBY-BIDORO-01",
        description: "切手趣味週間シリーズ、喜多川歌麿の名作。",
        images: [],
        imageUrl: "/images/products/stamp-bidoro.jpg",
        soldOut: false,
        created_at: new Date('2024-02-15').toISOString(),
        updated_at: new Date('2024-02-15').toISOString()
    },
    {
        title: "1934年 建国記念日新定価",
        category: "記念切手",
        subCategory: "",
        status: "active",
        price: 89000,
        stock: 1,
        sku: "COMM-1934-FOUND",
        description: "1934年発行の建国記念切手、新定価版。",
        images: [],
        imageUrl: "/images/products/stamp-foundation.jpg",
        soldOut: false,
        created_at: new Date('2024-02-20').toISOString(),
        updated_at: new Date('2024-02-20').toISOString()
    }
];

// Firebase初期化とデータ投入
async function initializeSampleProducts() {
    console.log('サンプル商品データの初期化を開始します...');
    
    try {
        // UnifiedStorageManagerを使用
        const storageManager = new UnifiedStorageManager();
        
        // 初期化待ち
        await new Promise((resolve) => {
            if (storageManager.isInitialized) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (storageManager.isInitialized) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
        
        // 既存データをクリア（オプション）
        // const existingProducts = await storageManager.getProducts();
        // if (existingProducts.length > 0) {
        //     console.log(`既に${existingProducts.length}件の商品データが存在します。`);
        //     return;
        // }
        
        // サンプルデータを追加
        for (const product of sampleProducts) {
            await storageManager.addProduct(product);
            console.log(`商品追加: ${product.title}`);
        }
        
        console.log('サンプル商品データの初期化が完了しました。');
        
    } catch (error) {
        console.error('初期化エラー:', error);
    }
}

// 実行確認
if (typeof window !== 'undefined') {
    // ブラウザ環境
    if (confirm('サンプル商品データを初期化しますか？')) {
        initializeSampleProducts();
    }
} else {
    // Node.js環境
    initializeSampleProducts();
}