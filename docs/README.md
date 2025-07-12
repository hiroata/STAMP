# ワールドスタンプ広島 - ECサイト

切手販売専門のECサイトです。Firebase Realtime Databaseを使用して商品管理を行います。

## 機能

- 商品一覧表示
- カテゴリー別表示
- 商品検索
- 管理画面での商品登録・編集・削除
- レスポンシブデザイン（モバイル対応）

## 技術スタック

- **フロントエンド**: HTML, JavaScript, Tailwind CSS
- **バックエンド**: Firebase Realtime Database
- **ホスティング**: Firebase Hosting

## セットアップ

### 1. Firebase設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. Realtime Databaseを有効化
3. プロジェクト設定から設定値を取得
4. `firebase-config.js`に設定値を入力

### 2. ローカル開発

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# ローカルサーバーを起動
firebase serve
```

### 3. デプロイ

```bash
firebase deploy
```

## ディレクトリ構造

```
├── index.html              # トップページ
├── products.html           # 商品一覧
├── admin.html             # 管理画面
├── admin-login.html       # 管理画面ログイン
├── firebase-config.js     # Firebase設定
├── js/
│   └── unified-storage.js # ストレージ管理
├── css/                   # スタイルシート
├── images/               # 画像ファイル
└── category-*.html       # カテゴリー別ページ
```

## 管理画面

管理画面（`/admin.html`）から商品の登録・編集・削除が可能です。

### アクセス方法

1. `/admin-login.html`にアクセス
2. 管理者パスワードでログイン
3. 商品管理画面で操作

### 機能

- 商品画像のドラッグ&ドロップアップロード
- カテゴリー選択
- 価格設定（応相談対応）
- 在庫管理
- NEW表示の設定

## セキュリティ

本番環境では以下の設定を推奨：

- Firebase Database Rulesで適切な権限設定
- 管理画面のアクセス制限
- HTTPS通信の強制

## ライセンス

© 2024 ワールドスタンプ広島 All Rights Reserved.
