# セットアップ・デプロイメント統合ガイド

## 🏗️ 初期セットアップ

### 1. 環境構築

#### 必要なツール
- Node.js v20以上
- npm v8以上
- Git
- Firebase CLI

#### インストール手順
```bash
# Firebase CLIのインストール
npm install -g firebase-tools

# プロジェクトのクローン
git clone https://github.com/hiroata/STAMP.git
cd STAMP

# 依存関係のインストール
npm install
```

### 2. Firebase設定

#### Firebaseプロジェクトの作成
1. [Firebase Console](https://console.firebase.google.com)にアクセス
2. 新規プロジェクトを作成
3. 以下のサービスを有効化：
   - Authentication
   - Realtime Database
   - Storage
   - Hosting

#### 設定ファイルの作成
```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. 管理者設定

#### Firebase Authenticationでユーザー作成
1. Authentication → Users → ユーザーを追加
2. メールアドレスとパスワードを設定

#### Realtime Databaseで管理者権限付与
```json
{
  "admins": {
    "USER_UID": true
  }
}
```

## 🚀 デプロイメント

### 自動デプロイ（GitHub Actions）

#### 1. Firebaseサービスアカウントの作成
1. Firebase Console → プロジェクト設定 → サービスアカウント
2. 「新しい秘密鍵の生成」をクリック
3. JSONファイルをダウンロード

#### 2. GitHub Secretsの設定
1. GitHubリポジトリ → Settings → Secrets
2. 新しいシークレットを追加：
   - Name: `FIREBASE_SERVICE_ACCOUNT_[PROJECT_ID]`
   - Value: ダウンロードしたJSONの内容

#### 3. ワークフローの有効化
`.github/workflows/firebase-hosting-deploy.yml`が自動的に実行されます

### 手動デプロイ

#### 初回設定
```bash
# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init

# プロジェクトを選択
firebase use YOUR_PROJECT_ID
```

#### デプロイ実行
```bash
# 全サービスをデプロイ
firebase deploy

# Hostingのみデプロイ
firebase deploy --only hosting

# データベースルールのみデプロイ
firebase deploy --only database
```

## 🔧 環境別設定

### 開発環境
```bash
# ローカルサーバー起動
npm run dev

# エミュレータ起動（オプション）
firebase emulators:start
```

### ステージング環境
```bash
# ステージング用プロジェクトに切り替え
firebase use staging

# プレビューチャンネルにデプロイ
firebase hosting:channel:deploy preview
```

### 本番環境
```bash
# 本番プロジェクトに切り替え
firebase use production

# 本番デプロイ
firebase deploy --only hosting
```

## 📋 デプロイチェックリスト

### デプロイ前の確認事項
- [ ] コードのリント実行（`npm run lint`）
- [ ] テストの実行（`npm test`）
- [ ] 環境変数の確認
- [ ] データベースルールの確認
- [ ] セキュリティ設定の確認

### デプロイ後の確認事項
- [ ] サイトの動作確認
- [ ] 管理画面へのログイン確認
- [ ] 商品の表示確認
- [ ] 画像アップロード機能の確認
- [ ] エラーログの確認

## 🚨 トラブルシューティング

### デプロイエラー

#### "Permission denied"エラー
```bash
# Firebase再認証
firebase login --reauth

# プロジェクトの権限確認
firebase projects:list
```

#### ビルドエラー
```bash
# キャッシュクリア
rm -rf node_modules package-lock.json
npm install

# Firebase CLIの更新
npm install -g firebase-tools@latest
```

### 本番環境の問題

#### キャッシュの問題
- `firebase.json`でキャッシュ設定を確認
- CloudFlareなどCDNのキャッシュをパージ

#### 権限エラー
- Firebase Consoleでルールを確認
- サービスアカウントの権限を確認

## 📞 サポート連絡先

技術的な問題が発生した場合：
1. GitHubのIssuesに報告
2. 開発チームへの連絡
3. Firebase Supportへの問い合わせ

---

最終更新: 2025年1月13日