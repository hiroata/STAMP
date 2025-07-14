# CLAUDE.md - ワールドスタンプ広島 開発ガイド

> AI開発者向けプロジェクト完全ガイド - 効率的な開発とメンテナンスのために

## 🎯 プロジェクト概要

**ワールドスタンプ広島**は、シニア世代に特化した切手専門ECサイトです。Firebase + Vanilla JavaScript でモダンかつシンプルな構成を採用し、高いパフォーマンスとセキュリティを実現しています。

### 重要な特徴
- **シニアフレンドリーUI**: 大きなフォント、高コントラスト、直感的操作
- **電話・FAX併用**: オンラインとオフライン注文の両立
- **高いセキュリティ**: XSS/CSRF対策、Firebase Security Rules
- **PWA対応**: オフライン機能、インストール可能
- **SEO最適化**: 構造化データ、sitemap.xml、robots.txt

## 🏗️ 技術スタック

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **Vanilla JavaScript ES6+**: フレームワークレス、軽量
- **Tailwind CSS**: ユーティリティファーストCSS
- **PWA**: Service Worker, App Manifest

### バックエンド
- **Firebase Realtime Database**: リアルタイムデータ同期
- **Firebase Storage**: 画像・ファイル管理
- **Firebase Authentication**: セキュアな認証
- **Firebase Hosting**: CDN付きホスティング

### 開発・運用
- **GitHub Actions**: CI/CD パイプライン
- **ESLint + Prettier**: コード品質管理
- **Jest**: ユニットテスト
- **Firebase CLI**: デプロイメント

## 📁 プロジェクト構造（最新版）

```
STAMP/
├── 📄 主要ページ（20ファイル）
│   ├── index.html                # トップページ
│   ├── admin.html                # 管理画面（メイン）
│   ├── admin-login.html          # 管理者ログイン
│   ├── category.html             # カテゴリー一覧
│   ├── products.html             # 商品一覧
│   ├── product-detail.html       # 商品詳細
│   ├── about.html                # 店舗情報
│   ├── contact.html              # お問い合わせ
│   ├── buy.html / sell.html      # 購入・売却
│   ├── features.html             # 当店の特徴
│   ├── appraiser.html            # 鑑定人について
│   ├── qna.html                  # Q&A
│   ├── privacy.html / terms.html # 規約類
│   └── manifest.json             # PWA設定
│
├── 📂 pages/                     # サブページ（整理済み）
│   ├── categories/               # カテゴリーページ（77ファイル）
│   └── admin/                    # 管理関連ページ
│
├── 📂 js/                        # JavaScript（最新追加分）
│   ├── components.js             # 共通コンポーネント（UI最適化済み）
│   ├── unified-storage.js        # Firebase統合管理
│   ├── auth-manager.js           # 認証システム
│   ├── image-uploader.js         # 画像アップロード
│   ├── security.js               # セキュリティ機能（NEW）
│   ├── pwa.js                    # PWA機能（NEW）
│   └── performance.js            # パフォーマンス最適化（NEW）
│
├── 📂 css/
│   ├── common.css                # 共通スタイル
│   └── tailwind-compiled.css     # Tailwind CSS
│
├── 📂 scripts/                   # 本番スクリプト
│   ├── generate-sitemap.js       # サイトマップ生成（NEW）
│   └── generate-category-pages.js
│
├── 📂 docs/                      # ドキュメント（統廃合済み）
├── 📂 tools/                     # 開発ツール（整理済み）
├── 📂 tests/                     # テスト（整理済み）
├── 📂 templates/                 # テンプレートファイル
└── 🔧 設定ファイル
    ├── firebase.json             # Firebase設定（セキュリティヘッダー含む）
    ├── database.rules.json       # DB権限設定
    ├── package.json              # npm設定
    ├── robots.txt                # SEO設定（NEW）
    ├── sitemap.xml               # サイトマップ（自動生成）
    ├── sw.js                     # Service Worker（NEW）
    └── offline.html              # オフラインページ（NEW）
```

### 📁 フォルダ構造の最適化（統合情報）
- **ルートレベル**: 最重要ファイル20個のみ（見つけやすさ重視）
- **pages/categories/**: 77個のカテゴリーページを整理
- **docs/**: ドキュメントファイルを集約（CLAUDE.mdがメイン）
- **tools/**: 開発ツール・スクリプトを整理
- **tests/**: テスト・デバッグファイルを整理

## 🚀 最新の改良点（2025年7月実装）

### 1. SEO最適化 ✅
- **sitemap.xml 自動生成**: 193ページ対応、優先度・更新頻度設定
- **robots.txt**: 管理画面クロール防止、検索エンジン最適化
- **構造化データ**: JSON-LD形式でLocalBusiness実装
- **OGPタグ**: Facebook, Twitter Card対応

### 2. PWA化 ✅
- **Service Worker (sw.js)**: オフライン対応、キャッシュ戦略
- **App Manifest**: インストール可能なWebアプリ
- **オフラインページ**: 接続断時の代替表示
- **インストールプロンプト**: 自動表示、ユーザー体験向上

### 3. パフォーマンス最適化 ✅
- **遅延読み込み**: Intersection Observer使用、100px先読み
- **WebP対応**: 自動フォーマット変換、フォールバック機能
- **リソース最適化**: 画像キャッシュ1年、フォント事前読み込み
- **Core Web Vitals**: FCP, LCP, CLS測定・監視

### 4. セキュリティ強化 ✅
- **CSP (Content Security Policy)**: Firebase設定で実装
- **セキュリティヘッダー**: X-Frame-Options, HSTS, Referrer-Policy
- **XSS保護**: 入力値サニタイゼーション、DOM監視
- **HTTPS強制**: セキュア通信の徹底

### 5. UI/UXデザイン最適化 ✅ **NEW**
- **赤色背景の最適化**: 目障りな薄い赤色背景をグレー系に統一
- **モバイル対応**: スマートフォンで見やすい配色に調整
- **ブランドカラー**: 重要な要素（ボタン、リンク）は適切に赤色を維持
- **アクセシビリティ**: コントラスト比とユーザビリティを向上

## 🔧 開発コマンド

### 基本操作
```bash
# 開発環境起動
firebase serve

# 本番ビルド
npm run build

# CSS再生成
npm run build:css:prod

# サイトマップ生成
npm run build:sitemap

# 全体ビルド（CSS + カテゴリー + サイトマップ）
npm run build
```

### 品質管理
```bash
# コード検証
npm run lint              # ESLint実行
npm run format            # Prettier実行
npm run lint:check        # リント確認のみ
npm run format:check      # フォーマット確認のみ

# テスト実行
npm test                  # 全テスト
npm run test:storage      # ストレージテストのみ
```

### デプロイメント
```bash
# 本番デプロイ（フル）
firebase deploy

# 特定サービスのみ
firebase deploy --only hosting
firebase deploy --only database
firebase deploy --only storage
```

## 🗂️ 主要ファイル詳細

### 1. Firebase設定
**firebase.json** - セキュリティヘッダー、キャッシュ設定
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*",
        "headers": [
          {"key": "Content-Security-Policy", "value": "..."},
          {"key": "X-Frame-Options", "value": "DENY"},
          {"key": "X-Content-Type-Options", "value": "nosniff"}
        ]
      }
    ]
  }
}
```

**database.rules.json** - データベース権限
```json
{
  "rules": {
    "products": {".read": true, ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"},
    "categories": {".read": true, ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"}
  }
}
```

### 2. JavaScript モジュール

**js/unified-storage.js** - Firebase統合管理クラス
- 商品CRUD操作
- リアルタイムデータ同期
- 画像アップロード
- バックアップ機能

**js/auth-manager.js** - 認証システム
- Firebase Authentication
- 管理者権限チェック
- セッション管理

**js/security.js** - セキュリティ機能（NEW）
- XSS保護
- CSP違反レポート
- 入力値サニタイゼーション

**js/pwa.js** - PWA機能（NEW）
- Service Worker登録
- インストールプロンプト
- オフライン検知

**js/performance.js** - パフォーマンス最適化（NEW）
- 遅延読み込み
- WebP対応
- Core Web Vitals測定

### 3. 最新追加ファイル

**robots.txt** - SEO設定
```
User-agent: *
Allow: /
Disallow: /admin*
Sitemap: https://stamp-e20f2.web.app/sitemap.xml
```

**sw.js** - Service Worker
- オフライン対応
- キャッシュ戦略
- バックグラウンド同期

**manifest.json** - PWA設定
```json
{
  "name": "ワールドスタンプ広島",
  "short_name": "スタンプ広島",
  "display": "standalone",
  "theme_color": "#c41e3a"
}
```

## 🎨 UI/UX 設計原則

### シニア対応
- **フォントサイズ**: 最小16px、見出し24px以上
- **コントラスト比**: WCAG AA基準（4.5:1以上）
- **タッチターゲット**: 最小48px×48px
- **ナビゲーション**: 階層は3レベル以下

### レスポンシブデザイン
- **ブレークポイント**: Tailwind CSS標準（sm: 640px, md: 768px, lg: 1024px）
- **モバイルファースト**: 小画面から大画面への拡張
- **フレキシブルグリッド**: CSS Grid + Flexbox

### カラーパレット（✅最適化済み）
```css
:root {
  --primary-red: #c41e3a;     /* メインカラー（ボタン・リンク用） */
  --header-bg: #b71c1c;       /* ヘッダー背景（未使用） */
  --nav-gray: #f5f5f5;        /* ナビゲーション */
  --text-primary: #333333;    /* メインテキスト */
  --text-secondary: #666666;  /* サブテキスト */
}
```

#### 配色ルール（2025年7月14日更新）
- **機能的な赤色**: `bg-red-600`（ボタン）、`text-red-*`（警告・エラー）は維持
- **装飾的な背景**: `bg-red-50` → `bg-gray-50` or `bg-red-50`（適度に使用）
- **モバイル対応**: 目障りな濃い赤線は完全削除
- **アクセシビリティ**: 高コントラスト維持、視認性最優先

## 🔐 セキュリティ実装

### Firebase Security Rules
```javascript
// 商品データの保護
"products": {
  ".read": true,  // 全員が読み取り可能
  ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
}

// 管理者のみアクセス可能なデータ
"admin": {
  ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
  ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
}
```

### XSS対策
```javascript
// HTML エスケープ
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 入力値サニタイゼーション
function sanitizeInput(input) {
  return input.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '');
}
```

### CSRF対策
- Firebase Authentication トークン使用
- リクエストヘッダーでの検証
- Same-Origin Policy 活用

## 📊 パフォーマンス最適化

### 画像最適化
- **WebP形式**: 自動変換、フォールバック付き
- **遅延読み込み**: Intersection Observer使用
- **適切なサイズ**: 表示サイズの2倍まで

### キャッシュ戦略
- **HTML/CSS/JS**: no-cache（開発中のため）
- **画像**: 1年キャッシュ
- **フォント**: 1年キャッシュ + CORS対応

### Core Web Vitals目標
- **FCP (First Contentful Paint)**: < 1.8秒
- **LCP (Largest Contentful Paint)**: < 2.5秒
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🛠️ トラブルシューティング

### よくある問題と解決法

| 問題 | 原因 | 解決方法 |
|------|------|----------|
| 管理画面ログイン失敗 | Firebase設定エラー | `.env`確認、管理者権限チェック |
| 画像アップロード失敗 | Storage権限エラー | `storage.rules`確認、CORS設定 |
| 商品が表示されない | Database権限エラー | `database.rules.json`確認 |
| CSS適用されない | ビルドエラー | `npm run build:css:prod`実行 |
| PWA機能が動かない | Service Worker エラー | ブラウザのキャッシュクリア |
| サイトマップが古い | 自動生成未実行 | `npm run build:sitemap`実行 |
| 赤色背景が表示される | 未修正ファイルあり | `bg-red-50`, `bg-red-100`を`bg-gray-*`に変更 |
| モバイルで赤線が見える | ヘッダー背景問題 | components.jsの赤色背景を削除・修正 |

### デバッグ方法
```javascript
// Firebase接続確認
console.log('Firebase app:', firebase.app());

// 認証状態確認
firebase.auth().onAuthStateChanged(user => {
  console.log('Auth state:', user);
});

// データベース接続確認
firebase.database().ref().once('value').then(snapshot => {
  console.log('Database connected:', snapshot.exists());
});
```

## 🔄 開発ワークフロー

### 1. 新機能開発
```bash
# 機能ブランチ作成
git checkout -b feature/new-feature

# 開発・テスト
npm run lint && npm test

# コミット
git commit -m "feat: 新機能追加"

# プッシュ・PR作成
git push origin feature/new-feature
```

### 2. 商品管理
- **追加**: `admin.html` → 商品情報入力 → 画像アップロード
- **編集**: 商品リスト → 編集ボタン → 更新
- **削除**: 商品リスト → 削除ボタン → 確認
- **バックアップ**: 自動（日次）+ 手動実行可能

### 3. カテゴリー管理
- **自動生成**: `npm run build:categories`
- **手動追加**: `pages/categories/` に新ファイル配置
- **リンク更新**: スクリプトが自動実行

## 📈 今後の改良提案

### 短期（1-2ヶ月）
- **在庫管理システム**: リアルタイム在庫表示
- **注文システム**: オンライン決済対応
- **レビュー機能**: 商品評価・コメント

### 中期（3-6ヶ月）
- **AI検索**: 商品の自然言語検索
- **レコメンド**: 購買履歴ベースの推薦
- **モバイルアプリ**: React Native版

### 長期（6ヶ月以上）
- **マルチテナント**: 他店舗への展開
- **API化**: 外部システム連携
- **分析ダッシュボード**: 売上・顧客分析

## 🎯 重要な注意事項

### 開発時の注意
1. **Firebase設定**: 本番とテスト環境を分離
2. **画像サイズ**: アップロード前にリサイズ（最大2MB）
3. **セキュリティ**: 管理者権限の厳格な管理
4. **パフォーマンス**: 画像の遅延読み込み必須
5. **アクセシビリティ**: シニア層への配慮

### 運用時の注意
1. **バックアップ**: 毎日自動実行、週次で手動確認
2. **監視**: Firebase Console でエラー監視
3. **更新**: セキュリティパッチの定期適用
4. **テスト**: 本番反映前の動作確認必須

---

## 🎉 最終更新

**更新日**: 2025年7月14日  
**バージョン**: v2.1.1  
**実装済み**: SEO最適化、PWA化、パフォーマンス最適化、セキュリティ強化、UI/UXデザイン最適化

このガイドは最新の実装状況を反映しており、次の開発者がスムーズに作業を継続できるよう設計されています。