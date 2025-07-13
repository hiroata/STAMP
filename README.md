# STAMP - ワールドスタンプ広島 ECサイト

> 切手販売専門のモダンなECサイト - シニアフレンドリーなUI設計

[![Firebase](https://img.shields.io/badge/Firebase-9.22.0-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-blue)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎯 プロジェクト概要

ワールドスタンプ広島の公式ECサイト。切手コレクター向けのユーザーフレンドリーなオンライン販売プラットフォームです。

### 主な特徴
- **シニア対応UI**: 大きなフォント、高コントラスト、直感的な操作
- **豊富なカテゴリー**: 100以上の切手カテゴリーに対応
- **電話・FAX注文**: オンラインと従来の注文方法の両立
- **セキュリティ重視**: XSS/CSRF対策、Firebase認証

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

# CSS生成
npm run build:css:prod

# ローカル起動
firebase serve
```

詳細な手順は [SETUP_COMPLETE_GUIDE.md](docs/SETUP_COMPLETE_GUIDE.md) を参照してください。

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
│   └── security-utils.js       # セキュリティ機能
│
├── 📂 css/                     # スタイルシート
│   ├── common.css              # 共通CSS
│   └── tailwind-compiled.css   # Tailwind CSS
│
├── 📂 docs/                    # ドキュメント
│   ├── SETUP_COMPLETE_GUIDE.md      # セットアップ完全ガイド
│   ├── DEPLOYMENT_COMPLETE_GUIDE.md # デプロイ完全ガイド
│   ├── FIREBASE_CONFIGURATION.md    # Firebase設定ガイド
│   ├── TROUBLESHOOTING_GUIDE.md     # トラブルシューティング
│   ├── SECURITY_GUIDE.md            # セキュリティガイド
│   └── CLAUDE.md                    # AI開発者向けガイド
│
└── 🔧 設定ファイル
    ├── firebase.json           # Firebase設定
    ├── database.rules.json     # DB権限設定
    ├── storage.rules           # Storage権限設定
    ├── package.json            # npm設定
    └── .env.example            # 環境変数テンプレート
```

## ⚡ 主要機能

### 🛍️ フロントエンド
- **商品閲覧**: 高速検索、カテゴリー分類、詳細表示
- **レスポンシブデザイン**: スマートフォン完全対応
- **アクセシビリティ**: シニア層に配慮したUI/UX
- **SEO最適化**: メタタグ、構造化データ対応

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

### データ保護
- XSS対策（HTMLエスケープ処理）
- Firebase Security Rules による厳格なアクセス制御
- 環境変数による機密情報管理
- HTTPS通信の強制

詳細は [SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md) を参照してください。

## 🚀 デプロイメント

### 自動デプロイ（推奨）
```bash
# mainブランチにプッシュで自動デプロイ
git push origin main
```

### 手動デプロイ
```bash
# 本番用CSS生成
npm run build:css:prod

# Firebase デプロイ
firebase deploy

# 特定サービスのみ
firebase deploy --only hosting
```

詳細は [DEPLOYMENT_COMPLETE_GUIDE.md](docs/DEPLOYMENT_COMPLETE_GUIDE.md) を参照してください。

## 🛠️ 開発

### NPM スクリプト
```bash
npm run build:css          # 開発用CSS生成
npm run build:css:prod     # 本番用CSS生成（圧縮）
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

## 📊 プロジェクト統計

- **総ファイル数**: 200+ ファイル
- **カテゴリーページ**: 77ページ
- **テストカバレッジ**: 80%+
- **Lighthouse スコア**: 95+

## 🆘 トラブルシューティング

### よくある問題

| 問題 | 解決方法 |
|------|----------|
| 🚫 管理画面にログインできない | Firebase Console で管理者権限確認 |
| 📷 画像がアップロードできない | Storage権限とCORS設定確認 |
| 🛒 商品が表示されない | Database接続とセキュリティルール確認 |
| 🎨 CSS が適用されない | Tailwind CSS再ビルド実行 |

詳細は [TROUBLESHOOTING_GUIDE.md](docs/TROUBLESHOOTING_GUIDE.md) を参照してください。

## 📚 ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [SETUP_COMPLETE_GUIDE.md](docs/SETUP_COMPLETE_GUIDE.md) | 完全なセットアップ手順 |
| [DEPLOYMENT_COMPLETE_GUIDE.md](docs/DEPLOYMENT_COMPLETE_GUIDE.md) | デプロイメント完全ガイド |
| [FIREBASE_CONFIGURATION.md](docs/FIREBASE_CONFIGURATION.md) | Firebase設定詳細 |
| [TROUBLESHOOTING_GUIDE.md](docs/TROUBLESHOOTING_GUIDE.md) | 問題解決ガイド |
| [SECURITY_GUIDE.md](docs/SECURITY_GUIDE.md) | セキュリティ実装ガイド |
| [CLAUDE.md](docs/CLAUDE.md) | AI開発者向けプロジェクトガイド |

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

最終更新: 2025年7月13日

</div>