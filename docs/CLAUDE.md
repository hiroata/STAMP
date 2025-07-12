# CLAUDE.md - ワールドスタンプ広島 ECサイト

このファイルは、AI アシスタントがこのプロジェクトを理解し、効率的に作業できるようにするためのガイドです。

## 🎯 プロジェクト概要

**ワールドスタンプ広島** - 切手販売専門ECサイト

- **目的**: 切手コレクター向けのオンライン販売プラットフォーム
- **ターゲット**: シニア層を中心とした切手愛好家
- **特徴**: シニアフレンドリーなUI、100以上のカテゴリー分類、電話・FAX注文対応

### 技術スタック

- **フロントエンド**: HTML5, Vanilla JavaScript, Tailwind CSS
- **バックエンド**: Firebase Realtime Database, Firebase Storage
- **認証**: Firebase Authentication
- **開発ツール**: ESLint, Prettier, Jest
- **ホスティング**: Firebase Hosting

## 📁 プロジェクト構造

```
STAMP/
├── index.html                # トップページ
├── products.html             # 商品一覧
├── admin.html                # 管理画面
├── admin-login.html          # 管理者ログイン
├── search-results.html       # 検索結果
├── category-*.html           # カテゴリー別ページ（100+ファイル）
├── firebase-config.js        # Firebase設定
├── js/
│   ├── unified-storage.js    # ストレージ管理
│   ├── auth-manager.js       # 認証管理
│   └── image-uploader.js    # 画像アップロード
├── .env.example              # 環境変数テンプレート
├── package.json              # npm設定
├── .eslintrc.json            # ESLint設定
└── .prettierrc.json          # Prettier設定
```

## 🔑 重要な機能

### 1. Firebase統合

- **Realtime Database**: 商品データのリアルタイム同期
- **Authentication**: 管理者認証
- **Storage**: 商品画像の保存
- **UnifiedStorageManager**: Firebase/localStorage フォールバック機能

### 2. 管理機能

- Firebase認証による安全なログイン
- 商品のCRUD操作
- ドラッグ&ドロップ画像アップロード
- カテゴリー自動選択（2階層構造）

### 3. シニア対応UI

- 最小フォントサイズ: 18px（モバイル）
- タッチターゲット: 最小48px
- 高コントラストカラー
- わかりやすいナビゲーション

## 💻 開発環境セットアップ

```bash
# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env
# .envファイルを編集してFirebase認証情報を設定

# Tailwind CSSのコンパイル
npm run build:css:prod

# 開発サーバー起動
firebase serve

# 開発時のCSSウォッチ（別ターミナル）
npm run build:css

# コード品質チェック
npm run lint          # ESLint実行
npm run format        # Prettier実行
npm test              # テスト実行
```

## 🚀 デプロイ

```bash
# Firebase にデプロイ
firebase deploy

# ホスティングのみ
firebase deploy --only hosting
```

## 🔒 セキュリティ設定

### Firebase セキュリティルール（database.rules.json）

```json
{
    "rules": {
        "products": {
            ".read": true,
            ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
        },
        "admins": {
            ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
            ".write": false
        }
    }
}
```

### 環境変数（.env）

```
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 🛠️ コード規約

- **フォーマット**: Prettier（自動適用）
- **リント**: ESLint（エラーチェック）
- **命名規則**: HTML(kebab-case)、JS(camelCase)
- **コメント**: 日本語で記述

## 📋 トラブルシューティング

1. **商品が表示されない**: Firebase設定とコンソールエラーを確認
2. **管理画面にアクセスできない**: Firebase Authenticationの設定確認
3. **画像アップロードエラー**: Firebase Storageの権限設定確認

## 📝 更新履歴

- 2025-01-07: Firebase完全統合、セキュリティ強化、開発環境整備
- 2024-07-06: 初版作成
