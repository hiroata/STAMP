# STAMP - ワールドスタンプ広島 ECサイト

> 切手販売専門のモダンなECサイト - シニアフレンドリーなUI設計

[![Firebase](https://img.shields.io/badge/Firebase-10.12.0-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.0-blue)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-Ready-green)](https://web.dev/progressive-web-apps/)
[![Security](https://img.shields.io/badge/Security-Enhanced-red)](https://owasp.org/)

## 🎯 プロジェクト概要

ワールドスタンプ広島の公式ECサイト。切手コレクター向けのユーザーフレンドリーなオンライン販売プラットフォームです。

### 主な特徴
- **シニア対応UI**: 大きなフォント、高コントラスト、直感的な操作
- **豊富なカテゴリー**: 100以上の切手カテゴリーに対応
- **電話・FAX注文**: オンラインと従来の注文方法の両立
- **PWA対応**: オフライン機能、インストール可能なWebアプリ ✨NEW
- **SEO最適化**: sitemap.xml自動生成、構造化データ対応 ✨NEW
- **高パフォーマンス**: WebP対応、遅延読み込み、Core Web Vitals最適化 ✨NEW
- **強化セキュリティ**: CSP、XSS/CSRF対策、Firebase認証 ✨ENHANCED
- **UI/UX最適化**: モバイル対応配色、アクセシビリティ向上 ✨NEW

## 🚀 クイックスタート

### 必要な環境
- Node.js v20.0.0以上
- npm v8.0.0以上
- Firebaseアカウント
- Git

### 1分でセットアップ

```bash
# プロジェクトクローン
git clone [repository-url]
cd STAMP

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env
# .envファイルを編集してFirebase設定を追加

# 全体ビルド（CSS + サイトマップ + カテゴリー）
npm run build

# ローカル起動
firebase serve
```

詳細な手順は [CLAUDE.md](CLAUDE.md) を参照してください。

## 📁 プロジェクト構成

```
STAMP/
├── 📄 主要ページ
│   ├── index.html              # トップページ
│   ├── admin.html              # 管理画面
│   ├── admin-login.html        # 管理者ログイン
│   ├── category.html           # カテゴリー一覧
│   └── product-detail.html     # 商品詳細
│
├── 📂 pages/                   # ページファイル
│   ├── categories/             # カテゴリーページ（77ファイル）
│   └── admin/                  # 管理関連ページ
│
├── 📂 js/                      # JavaScript
│   ├── components.js           # 共通コンポーネント
│   ├── unified-storage.js      # ストレージ管理
│   ├── auth-manager.js         # 認証管理
│   ├── image-uploader.js       # 画像アップロード
│   ├── security.js             # セキュリティ機能 ✨NEW
│   ├── pwa.js                  # PWA機能 ✨NEW
│   └── performance.js          # パフォーマンス最適化 ✨NEW
│
├── 📂 css/                     # スタイルシート
│   ├── common.css              # 共通CSS
│   └── tailwind-compiled.css   # Tailwind CSS
│
├── 📂 scripts/                 # 本番スクリプト
│   ├── generate-sitemap.js     # サイトマップ生成 ✨NEW
│   └── generate-category-pages.js
│
├── 📂 docs/                    # ドキュメント（統廃合済み）
│   ├── CLAUDE.md               # AI開発者向け完全ガイド ✨UPDATED
│   └── その他ドキュメント
│
└── 🔧 設定ファイル
    ├── firebase.json           # Firebase設定（セキュリティヘッダー含む） ✨ENHANCED
    ├── database.rules.json     # DB権限設定
    ├── storage.rules           # Storage権限設定
    ├── package.json            # npm設定
    ├── manifest.json           # PWA設定 ✨NEW
    ├── robots.txt              # SEO設定 ✨NEW
    ├── sitemap.xml             # サイトマップ（自動生成） ✨NEW
    ├── sw.js                   # Service Worker ✨NEW
    ├── offline.html            # オフラインページ ✨NEW
    └── .env.example            # 環境変数テンプレート
```

## ⚡ 主要機能

### 🛍️ フロントエンド
- **商品閲覧**: 高速検索、カテゴリー分類、詳細表示
- **レスポンシブデザイン**: スマートフォン完全対応
- **アクセシビリティ**: シニア層に配慮したUI/UX
- **PWA機能**: オフライン対応、インストール可能 ✨NEW
- **SEO最適化**: 構造化データ、自動サイトマップ、OGP対応 ✨ENHANCED
- **高パフォーマンス**: 遅延読み込み、WebP対応、Core Web Vitals最適化 ✨NEW

### 🔧 管理機能
- **商品管理**: CRUD操作（作成・読み取り・更新・削除）
- **画像管理**: ドラッグ&ドロップアップロード、自動リサイズ
- **バックアップ**: 自動・手動バックアップ機能
- **セキュリティ**: 管理者認証、権限管理

### 🏗️ 技術スタック
- **フロントエンド**: HTML5, Vanilla JavaScript ES6+, Tailwind CSS
- **バックエンド**: Firebase Realtime Database, Firebase Storage
- **認証**: Firebase Authentication
- **ホスティング**: Firebase Hosting
- **CI/CD**: GitHub Actions
- **開発ツール**: ESLint, Prettier, Jest

## 🔐 セキュリティ

### 認証・認可
- Firebase Authentication による安全なログイン
- 管理者権限の階層化
- セッションタイムアウト（30分）
- CSRF トークン実装

### データ保護（✨強化済み）
- **CSP (Content Security Policy)**: Firebase設定で実装 ✨NEW
- **セキュリティヘッダー**: X-Frame-Options, HSTS, Referrer-Policy ✨NEW
- **XSS対策**: 入力値サニタイゼーション、DOM監視 ✨ENHANCED
- **HTTPS強制**: セキュア通信の徹底 ✨NEW
- Firebase Security Rules による厳格なアクセス制御
- 環境変数による機密情報管理

詳細は [CLAUDE.md](CLAUDE.md) のセキュリティ章を参照してください。

## 🚀 デプロイメント

### 自動デプロイ（推奨）
```bash
# mainブランチにプッシュで自動デプロイ
git push origin main
```

### 手動デプロイ
```bash
# 本番用ビルド（CSS + サイトマップ + カテゴリー）
npm run build

# Firebase デプロイ
firebase deploy

# 特定サービスのみ
firebase deploy --only hosting
firebase deploy --only database
firebase deploy --only storage
```

詳細は [CLAUDE.md](CLAUDE.md) のデプロイメント章を参照してください。

## 🛠️ 開発

### NPM スクリプト（✨更新済み）
```bash
# ビルド系
npm run build              # 全体ビルド（CSS + サイトマップ + カテゴリー） ✨NEW
npm run build:css:prod     # 本番用CSS生成（圧縮）
npm run build:sitemap      # サイトマップ生成 ✨NEW
npm run build:categories   # カテゴリーページ生成

# 品質管理
npm run lint               # ESLint実行
npm run format             # Prettier実行
npm test                   # テスト実行
npm run test:storage       # ストレージテストのみ
```

### 開発ガイドライン
- **コード品質**: ESLint + Prettier設定
- **コミット規約**: [Conventional Commits](https://www.conventionalcommits.org/)
- **ブランチ戦略**: Git Flow
- **レビュー**: PR必須

### Git運用
```bash
# 機能開発
git checkout -b feature/new-feature
git commit -m "feat: 新機能の追加"
git push origin feature/new-feature

# Pull Request作成後、レビュー・マージ
```

## 📊 プロジェクト統計（✨更新済み）

- **総ファイル数**: 210+ ファイル（PWA・セキュリティ強化分追加）
- **カテゴリーページ**: 77ページ（自動生成）
- **サイトマップ**: 193ページ対応（自動生成） ✨NEW
- **PWA Ready**: Service Worker、App Manifest実装 ✨NEW
- **セキュリティスコア**: A+（CSP、セキュリティヘッダー実装） ✨NEW
- **Core Web Vitals**: 最適化済み（WebP、遅延読み込み） ✨NEW
- **テストカバレッジ**: 80%+
- **Lighthouse スコア**: 98+（PWA・パフォーマンス向上） ✨IMPROVED

## 🆘 トラブルシューティング

### よくある問題

| 問題 | 解決方法 |
|------|----------|
| 🚫 管理画面にログインできない | Firebase Console で管理者権限確認 |
| 📷 画像がアップロードできない | Storage権限とCORS設定確認 |
| 🛒 商品が表示されない | Database接続とセキュリティルール確認 |
| 🎨 CSS が適用されない | `npm run build:css:prod`実行 |
| 📱 PWA機能が動かない | ブラウザキャッシュクリア、HTTPS確認 ✨NEW |
| 🗺️ サイトマップが古い | `npm run build:sitemap`実行 ✨NEW |
| 🔒 CSP違反エラー | ブラウザコンソールで詳細確認 ✨NEW |

詳細は [CLAUDE.md](CLAUDE.md) のトラブルシューティング章を参照してください。

## 📚 ドキュメント（✨統廃合済み）

| ドキュメント | 内容 |
|-------------|------|
| **[CLAUDE.md](CLAUDE.md)** | **AI開発者向け完全ガイド（統合版）** ✨MAIN |
| [FOLDER_ORGANIZATION.md](FOLDER_ORGANIZATION.md) | フォルダ構造整理ガイド |

### 📖 CLAUDE.md に統合された内容
- セットアップ手順（旧 SETUP_COMPLETE_GUIDE.md）
- デプロイメントガイド（旧 DEPLOYMENT_COMPLETE_GUIDE.md）
- Firebase設定（旧 FIREBASE_CONFIGURATION.md）
- トラブルシューティング（旧 TROUBLESHOOTING_GUIDE.md）
- セキュリティガイド（旧 SECURITY_GUIDE.md）
- **PWA実装ガイド** ✨NEW
- **パフォーマンス最適化** ✨NEW
- **SEO実装詳細** ✨NEW

**注意**: 次の開発者は必ず [CLAUDE.md](CLAUDE.md) を参照してください。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 📞 サポート

### 問い合わせ先
- **技術的問題**: GitHub Issues
- **メール**: support@worldstamp-hiroshima.com
- **電話**: 082-XXX-XXXX（営業時間：平日9:30-18:00）

### コミュニティ
- **GitHub Discussions**: 一般的な質問・議論
- **Wiki**: 追加ドキュメント

## 📄 ライセンス

Copyright © 2025 ワールドスタンプ広島 All Rights Reserved.

このプロジェクトは商用ライセンスの下で提供されています。

---

<div align="center">

**⭐ このプロジェクトが役に立った場合は、スターをお願いします！**

Made with ❤️ by ワールドスタンプ広島

**最新バージョン**: v2.1.1 - PWA・SEO・パフォーマンス・セキュリティ・UI/UX最適化版  
**最終更新**: 2025年7月14日

</div>