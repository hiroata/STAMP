// カテゴリー管理クラス
class CategoryManager {
    constructor() {
        this.dbRef = null;
        this.categoryData = this.getDefaultCategories();
        this.callbacks = [];

        // Firebase初期化
        if (typeof firebase !== 'undefined' && firebase.database) {
            this.dbRef = firebase.database().ref('categories');
            this.initializeFirebase();
        }
    }

    // デフォルトカテゴリー
    getDefaultCategories() {
        return {
            "普通切手": ["明治普通切手", "手彫切手", "竜文切手", "桜切手", "菊切手", "コイル切手"],
            "航空切手": ["球部航空", "大正航空", "昭和航空（戦前）", "五銭位航空", "円位航空", "銅版航空", "立山航空"],
            "記念切手": ["明治記念", "大正記念", "昭和戦前記念", "昭和戦後記念", "平成記念", "令和記念", "小型シート", "文化人シリーズ", "国体シリーズ", "オリンピック関連"],
            "特殊切手": ["グリーティング切手", "シール式切手", "フレーム切手", "慶弔切手", "弔筒切手", "夏のおたより", "美術切手", "アニメ・ヒーロー"],
            "公園切手": ["第1次国立公園", "第2次国立公園", "国定公園", "富士箱根", "日光", "吉野熊野", "阿蘇", "大山瑠璃"],
            "年賀切手": ["昭和10年以前", "昭和11-20年", "昭和21-30年", "昭和31-40年", "昭和41-50年", "昭和51-64年", "平成年賀", "令和年賀", "お年玉小型シート"],
            "ふるさと切手": ["北海道・東北", "関東・信越", "東海・北陸", "近畿", "中国・四国", "九州・沖縄", "花シリーズ", "風景シリーズ"],
            "沖縄切手": ["米国統治時代", "琉球政府", "暫定切手", "航空切手", "速達切手", "収入印紙"],
            "限定販売品": ["プレミアム切手", "特別販売品", "郵便局限定", "オリジナルフレーム", "年賀パック", "フォルムカード"],
            "外国切手": ["アメリカ", "イギリス", "フランス", "ドイツ", "中国", "韓国", "カナダ", "オーストラリア", "その他の国"],
            "テーマ別切手": ["動物切手", "花・植物切手", "鉄道切手", "芸術・美術切手", "スポーツ切手", "宇宙切手", "船舶切手"],
            "エラー・変種切手": ["逆刷りエラー", "色違いエラー", "目打ちエラー", "印刷ズレ", "定常変種"],
            "歴史的切手": ["手彫切手", "小判切手", "菊切手", "田沢切手", "震災切手"],
            "切手関連品": ["初日カバー", "官製はがき", "収入印紙", "軍事切手"],
            "通信用切手": [],
            "収集用品": ["切手アルバム", "ピンセット", "ルーペ", "マウント", "保存ケース", "カタログ"]
        };
    }

    // Firebase初期化
    initializeFirebase() {
        // Firebaseからカテゴリーを読み込み
        this.dbRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.categoryData = data;
                this.notifyCallbacks();
            }
        });

        // 初回保存（データがない場合）
        this.dbRef.once('value', (snapshot) => {
            if (!snapshot.val()) {
                this.saveCategories();
            }
        });
    }

    // カテゴリーを取得
    getCategories() {
        return this.categoryData;
    }

    // メインカテゴリー一覧を取得
    getMainCategories() {
        return Object.keys(this.categoryData);
    }

    // サブカテゴリー一覧を取得
    getSubCategories(mainCategory) {
        return this.categoryData[mainCategory] || [];
    }

    // カテゴリーを保存
    async saveCategories() {
        if (this.dbRef) {
            try {
                await this.dbRef.set(this.categoryData);
            } catch (error) {
                console.error('Firebase save error:', error);
                this.saveToLocalStorage();
            }
        } else {
            this.saveToLocalStorage();
        }
    }

    // ローカルストレージに保存
    saveToLocalStorage() {
        localStorage.setItem('stampCategories', JSON.stringify(this.categoryData));
    }

    // ローカルストレージから読み込み
    loadFromLocalStorage() {
        const saved = localStorage.getItem('stampCategories');
        if (saved) {
            try {
                this.categoryData = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse categories:', e);
            }
        }
    }

    // 変更通知の登録
    onChange(callback) {
        this.callbacks.push(callback);
    }

    // コールバック通知
    notifyCallbacks() {
        this.callbacks.forEach(callback => {
            try {
                callback(this.categoryData);
            } catch (error) {
                console.error('Callback error:', error);
            }
        });
    }

    // メインカテゴリーを追加
    addMainCategory(name, subCategories = []) {
        if (!this.categoryData[name]) {
            this.categoryData[name] = subCategories;
            this.saveCategories();
            this.notifyCallbacks();
            return true;
        }
        return false;
    }

    // サブカテゴリーを追加
    addSubCategory(mainCategory, subCategory) {
        if (this.categoryData[mainCategory]) {
            if (!this.categoryData[mainCategory].includes(subCategory)) {
                this.categoryData[mainCategory].push(subCategory);
                this.saveCategories();
                this.notifyCallbacks();
                return true;
            }
        }
        return false;
    }

    // メインカテゴリーを更新
    updateMainCategory(oldName, newName) {
        if (this.categoryData[oldName] && !this.categoryData[newName]) {
            this.categoryData[newName] = this.categoryData[oldName];
            delete this.categoryData[oldName];
            this.saveCategories();
            this.notifyCallbacks();
            return true;
        }
        return false;
    }

    // サブカテゴリーを更新
    updateSubCategory(mainCategory, oldName, newName) {
        if (this.categoryData[mainCategory]) {
            const index = this.categoryData[mainCategory].indexOf(oldName);
            if (index !== -1) {
                this.categoryData[mainCategory][index] = newName;
                this.saveCategories();
                this.notifyCallbacks();
                return true;
            }
        }
        return false;
    }

    // メインカテゴリーを削除
    deleteMainCategory(name) {
        if (this.categoryData[name]) {
            delete this.categoryData[name];
            this.saveCategories();
            this.notifyCallbacks();
            return true;
        }
        return false;
    }

    // サブカテゴリーを削除
    deleteSubCategory(mainCategory, subCategory) {
        if (this.categoryData[mainCategory]) {
            const index = this.categoryData[mainCategory].indexOf(subCategory);
            if (index !== -1) {
                this.categoryData[mainCategory].splice(index, 1);
                this.saveCategories();
                this.notifyCallbacks();
                return true;
            }
        }
        return false;
    }

    // サブカテゴリーの順序を更新
    updateSubCategoryOrder(mainCategory, newOrder) {
        if (this.categoryData[mainCategory]) {
            this.categoryData[mainCategory] = newOrder;
            this.saveCategories();
            this.notifyCallbacks();
            return true;
        }
        return false;
    }
}

// グローバルに公開
window.CategoryManager = CategoryManager;