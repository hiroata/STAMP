# セットアップ完全ガイド

ワールドスタンプ広島ECサイトの完全なセットアップガイドです。

## 📋 前提条件

- Node.js v20以上
- npm v8以上  
- Firebaseアカウント
- Git（バージョン管理用）

## 🚀 クイックセットアップ

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd STAMP
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Firebase CLIのインストール

```bash
npm install -g firebase-tools
```

### 4. Firebaseにログイン

```bash
firebase login
```

## 🔧 Firebase設定

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例：stamp-hiroshima）
4. Google Analyticsは任意で設定

### 2. 必要なサービスの有効化

#### Authentication
1. Firebase Console > Authentication > 始める
2. Sign-in method > メール/パスワード を有効化
3. Users > ユーザーを追加 で管理者アカウントを作成

#### Realtime Database
1. Firebase Console > Realtime Database > データベースを作成
2. 場所：asia-southeast1（シンガポール）を選択
3. セキュリティルール：テストモードで開始

#### Storage
1. Firebase Console > Storage > 始める
2. 場所：asia-southeast1を選択
3. セキュリティルール：テストモードで開始

#### Hosting
1. Firebase Console > Hosting > 始める
2. ドメインは後で設定可能

### 3. 設定値の取得と設定

1. Firebase Console > プロジェクトの設定（歯車アイコン）
2. アプリを追加 > Web アプリ（</> アイコン）
3. アプリのニックネームを入力
4. 表示されたFirebase設定をコピー

### 4. 環境変数の設定

`.env.example`をコピーして`.env`を作成：

```bash
cp .env.example .env
```

`.env`ファイルを編集して、Firebase設定値を入力：

```bash
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### 5. firebase-config.jsの更新

`firebase-config.js`ファイルを開き、Firebase設定を更新：

```javascript
const firebaseConfig = {
    apiKey: "your_api_key_here",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "your_sender_id",
    appId: "your_app_id"
};
```

## 🔐 セキュリティ設定

### 1. Database Rules

Firebase Console > Realtime Database > ルール で以下を設定：

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

### 2. Storage Rules

Firebase Console > Storage > Rules で以下を設定：

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### 3. 管理者権限の設定

Firebase Console > Realtime Database > データ で以下を手動追加：

```json
{
  "admins": {
    "YOUR_ADMIN_UID": true
  }
}
```

**YOUR_ADMIN_UID**は、Firebase Console > Authentication > Users で確認できます。

## 🎨 CSS設定

### Tailwind CSSのコンパイル

開発時：
```bash
npm run build:css
```

本番用（圧縮版）：
```bash
npm run build:css:prod
```

## 🧪 テスト実行

```bash
# 全テスト実行
npm test

# ストレージテストのみ
npm run test:storage

# コード品質チェック
npm run lint
npm run format
```

## 🌐 ローカル開発サーバー

```bash
# Firebase Hosting エミュレーター
firebase serve

# または、特定のポートで起動
firebase serve --port 8080
```

ブラウザで http://localhost:5000 にアクセス

## 📱 管理画面のセットアップ

### 1. 管理者アカウントの作成

1. `/admin-login.html` にアクセス
2. Firebase Authentication で作成したメールアドレスとパスワードでログイン
3. 初回ログイン後、Firebase Realtime Database に管理者権限を設定

### 2. 初期データの投入

管理画面で最初の商品を登録：

1. 商品タイトル、価格、カテゴリーを入力
2. 商品画像をドラッグ&ドロップでアップロード
3. 「商品を登録」ボタンをクリック

## 🔍 動作確認

### 1. フロントエンド

- [ ] トップページが正常に表示される
- [ ] 商品一覧が表示される
- [ ] カテゴリー別ページが動作する
- [ ] 検索機能が動作する
- [ ] レスポンシブデザインが正常に表示される

### 2. 管理機能

- [ ] 管理画面にログインできる
- [ ] 商品の登録ができる
- [ ] 商品の編集ができる
- [ ] 商品の削除ができる
- [ ] 画像のアップロードができる

### 3. Firebase連携

- [ ] Realtime Databaseにデータが保存される
- [ ] Firebase Storageに画像が保存される
- [ ] 認証が正常に動作する

## ⚠️ トラブルシューティング

### よくある問題

1. **Firebase接続エラー**
   - Firebase設定値を再確認
   - ネットワーク接続を確認
   - Firebaseプロジェクトが有効か確認

2. **管理画面にログインできない**
   - Firebase Authentication でユーザーが作成されているか確認
   - Realtime Database に管理者権限が設定されているか確認

3. **画像がアップロードできない**
   - Firebase Storage のルールを確認
   - 管理者権限が正しく設定されているか確認

4. **商品が表示されない**
   - Realtime Database に商品データがあるか確認
   - ネットワークエラーがないか開発者ツールで確認

5. **CSS/デザインが崩れる**
   - Tailwind CSSがコンパイルされているか確認
   - キャッシュをクリアしてブラウザを再読み込み

### デバッグ方法

1. **開発者ツールの使用**
   - F12キーで開発者ツールを開く
   - Console タブでエラーメッセージを確認
   - Network タブでAPI通信を確認

2. **Firebase Console での確認**
   - Realtime Database でデータを確認
   - Storage でファイルを確認
   - Authentication でユーザーを確認

## 📞 サポート

問題が解決しない場合は、以下の情報を含めてお問い合わせください：

- エラーメッセージの詳細
- 実行した手順
- ブラウザとバージョン
- 開発者ツールのエラーログ

---

**最終更新**: 2025年7月13日