# セットアップガイド

## 🚨 重要な修正内容

このプロジェクトには以下の重要な修正を行いました：

### 1. セキュリティの強化

- ✅ Firebaseセキュリティルールを修正（誰でも読み書き可能→認証必須）
- ✅ APIキーの環境変数化の準備
- ✅ 認証メカニズムの基盤を作成

### 2. コード品質の改善

- ✅ StorageManagerを統合（5つの重複実装→1つの統一実装）
- ✅ 共通ヘッダー・フッターコンポーネントを作成
- ✅ 共通CSSファイルを作成

## 📋 手動で行う必要がある作業

### 1. 環境変数の設定

```bash
# .envファイルを作成
cp .env.example .env

# .envファイルを編集して実際の値を設定
# 以下の値を実際のFirebase設定に置き換えてください：
FIREBASE_API_KEY=your_actual_api_key
FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
# ... 他の設定も同様
```

### 2. 既存HTMLファイルの更新

各HTMLファイルに以下の変更を加える必要があります：

#### a) 共通CSS・JSの読み込み追加

```html
<head>
    <!-- 既存のhead内容 -->

    <!-- 共通CSSを追加 -->
    <link rel="stylesheet" href="css/common.css" />
</head>
<body>
    <!-- ヘッダーコンテナを追加 -->
    <div id="header-container"></div>

    <!-- メインコンテンツ -->

    <!-- フッターコンテナを追加 -->
    <div id="footer-container"></div>

    <!-- 共通コンポーネントJSを追加 -->
    <script src="js/components.js"></script>
    <!-- 統合StorageManagerを使用 -->
    <script src="js/unified-storage-manager.js"></script>
</body>
```

#### b) 重複ヘッダー・スタイルの削除

各HTMLファイルから以下を削除：

- `<header>`タグとその中身
- `<style>`タグ内の共通スタイル定義
- 個別のStorageManager読み込み

### 3. Firebase設定の更新

```javascript
// 古いFirebase設定コードを以下に置き換え：
import { initializeFirebase } from './js/firebase-config-secure.js';

// Firebase初期化
initializeFirebase()
    .then((firebase) => {
        // Firebaseを使用するコード
    })
    .catch((error) => {
        console.error('Firebase初期化エラー:', error);
    });
```

### 4. 不要ファイルの削除

以下のファイルは統合されたため削除可能：

```bash
rm firebase-config.js
rm firebase-storage-manager.js
rm storage-manager.js
rm cloud-sync.js
rm auto-sync-storage.js
rm clear-storage.js
rm check-backup.js
```

### 5. モバイルメニューの統一

すべてのHTMLファイルで共通コンポーネントを使用するため、個別のモバイルメニュー実装は不要になります。

## 🧪 テスト手順

### 1. ローカルサーバーの起動

```bash
# Python 3を使用
python3 -m http.server 8080

# または Node.jsを使用
npx http-server -p 8080
```

### 2. 動作確認チェックリスト

- [ ] すべてのページでヘッダー・フッターが表示される
- [ ] モバイルメニューが全ページで動作する
- [ ] 商品の追加・編集・削除が正常に動作する
- [ ] Firebase接続が正常（コンソールでエラーがない）
- [ ] レスポンシブデザインが正常に動作する

## 🚀 本番環境へのデプロイ

### 1. Firebase Hostingの設定

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# デプロイ
firebase deploy
```

### 2. セキュリティの最終確認

- [ ] `.env`ファイルがgitignoreに含まれている
- [ ] APIキーがソースコードに直接記載されていない
- [ ] Firebaseセキュリティルールが本番用に設定されている
- [ ] 管理者認証が正しく設定されている

## 📝 追加の推奨事項

1. **バックアップ**: 定期的なデータバックアップシステムの実装
2. **監視**: エラーログとパフォーマンス監視の設定
3. **テスト**: 自動テストスイートの追加
4. **ドキュメント**: APIドキュメントの作成

## サポート

問題が発生した場合は、以下を確認してください：

1. ブラウザのコンソールでエラーメッセージを確認
2. ネットワークタブでAPIリクエストの状態を確認
3. Firebaseコンソールでデータベースの状態を確認
