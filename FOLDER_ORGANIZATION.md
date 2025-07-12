# フォルダ構造の整理完了

## 📁 新しいフォルダ構造

```
STAMP/
├── 📄 index.html                    # トップページ
├── 📄 admin.html                    # 管理画面（メイン）
├── 📄 admin-login.html              # 管理者ログイン
├── 📄 category.html                 # カテゴリー一覧
├── 📄 about.html                    # 店舗情報
├── 📄 contact.html                  # お問い合わせ
├── 📄 buy.html                      # 購入方法
├── 📄 sell.html                     # 売却方法
├── 📄 features.html                 # 当店の特徴
├── 📄 faq.html                      # よくある質問
├── 📄 appraiser.html                # 鑑定人について
├── 📄 products.html                 # 商品一覧
├── 📄 qna.html                      # Q&A
├── 📄 search-results.html           # 検索結果
├── 📄 simple-cart.html              # 簡単カート
├── 📄 simple-search.html            # 簡単検索
├── 📄 privacy.html                  # プライバシーポリシー
├── 📄 terms.html                    # 利用規約
│
├── 📂 pages/                        # ページファイル
│   ├── 📂 categories/               # カテゴリーページ（77ファイル）
│   │   ├── category-commemorative.html
│   │   ├── category-foreign.html
│   │   ├── category-*.html          # その他75ファイル
│   │   └── ...
│   └── 📂 admin/                    # 管理関連ページ
│       └── setup-admin.html         # 管理者セットアップ
│
├── 📂 css/                          # スタイルシート
│   ├── common.css                   # 共通CSS
│   └── style.css                    # 追加CSS
│
├── 📂 js/                           # JavaScriptファイル
│   ├── components.js                # 共通コンポーネント
│   ├── unified-storage.js           # ストレージ管理
│   ├── image-uploader.js            # 画像アップロード
│   ├── auth-manager.js              # 認証管理
│   └── ...
│
├── 📂 docs/                         # ドキュメント
│   ├── README.md                    # プロジェクト概要
│   ├── CLAUDE.md                    # プロジェクト指示書
│   ├── DEPLOYMENT_GUIDE.md          # デプロイガイド
│   ├── SETUP_GUIDE.md               # セットアップガイド
│   └── *.md                         # その他ドキュメント（20ファイル）
│
├── 📂 tools/                        # 開発ツール・スクリプト
│   ├── update-category-links.cjs    # リンク更新スクリプト
│   ├── generate-category-pages.js   # カテゴリーページ生成
│   ├── analyze_links.py             # リンク分析
│   └── *.sh, *.js, *.py             # その他スクリプト
│
├── 📂 templates/                    # テンプレートファイル
│   ├── template.html                # ページテンプレート
│   └── header-template.html         # ヘッダーテンプレート
│
├── 📂 tests/                        # テスト関連
│   ├── setup.js                     # テストセットアップ
│   ├── unified-storage.test.js      # ストレージテスト
│   └── 📂 temp/                     # 一時ファイル
│       ├── test-*.html              # テスト用HTMLファイル
│       ├── debug-*.html             # デバッグ用ファイル
│       └── sync-test.html           # 同期テスト
│
├── 📂 backup/                       # バックアップ
├── 📂 content/                      # コンテンツファイル
├── 📂 generated/                    # 生成されたファイル
├── 📂 images/                       # 画像ファイル
├── 📂 public/                       # 公開ファイル
├── 📂 scripts/                      # 本番スクリプト
├── 📂 stamp-next/                   # Next.js版（未使用）
│
└── 🔧 設定ファイル
    ├── firebase.json                # Firebase設定
    ├── database.rules.json          # DB権限設定
    ├── storage.rules                # Storage権限設定
    ├── package.json                 # npm設定
    └── ...
```

## ✅ 整理による改善点

### 1. VSCode エクスプローラーがスッキリ
- **Before**: 112個のファイルが縦長に表示
- **After**: 主要ファイル20個 + 整理されたフォルダ構造

### 2. ファイルの分類
- **メインページ**: ルートに配置（20ファイル）
- **カテゴリーページ**: pages/categories/ に集約（77ファイル）
- **ドキュメント**: docs/ に集約（20ファイル）
- **開発ツール**: tools/ に集約（15ファイル）
- **テスト・デバッグ**: tests/temp/ に集約（10ファイル）

### 3. リンクの自動修正
- カテゴリーページへのリンクを `pages/categories/` に更新
- CSS・JSファイルへのパスを相対パス（`../../`）に修正
- 全ファイル（93ファイル）のリンク更新完了

## 🔍 主な変更点

### ルートレベル（最重要ファイルのみ）
```
✅ index.html              # トップページ
✅ admin.html               # 管理画面
✅ admin-login.html         # 管理者ログイン
✅ category.html            # カテゴリー一覧
✅ about.html               # 基本情報ページ
✅ contact.html             # お問い合わせ
✅ buy.html                 # 購入ページ
✅ sell.html                # 売却ページ
✅ privacy.html             # プライバシーポリシー
✅ terms.html               # 利用規約
```

### 移動されたファイル
```
📁 pages/categories/        # 77個のカテゴリーページ
📁 docs/                    # 20個のドキュメントファイル
📁 tools/                   # 15個のスクリプトファイル
📁 tests/temp/              # 10個のテスト・デバッグファイル
📁 templates/               # 2個のテンプレートファイル
```

## 🎯 メリット

1. **視認性向上**: VSCodeで重要ファイルがすぐ見つかる
2. **管理しやすさ**: 機能別にファイルが整理されている
3. **開発効率**: 必要なファイルに素早くアクセス可能
4. **保守性**: 新しいファイルを適切な場所に配置しやすい

## 🔧 今後の運用

- **新しいカテゴリーページ**: `pages/categories/` に配置
- **新しいドキュメント**: `docs/` に配置
- **新しいスクリプト**: `tools/` に配置
- **テスト・デバッグファイル**: `tests/temp/` に配置

フォルダ構造が大幅に改善され、開発・管理が格段にしやすくなりました！