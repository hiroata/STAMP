# デプロイメント完全ガイド

ワールドスタンプ広島ECサイトのFirebase Hostingへの完全なデプロイメントガイドです。

## 📋 デプロイ前チェックリスト

### 必須確認事項

- [ ] セットアップ完了（SETUP_COMPLETE_GUIDE.md を参照）
- [ ] ローカルテストが正常動作
- [ ] Firebase設定が正しく設定されている
- [ ] 管理者アカウントが作成済み
- [ ] 商品データが正常に表示される
- [ ] 画像アップロードが動作する

### コード品質チェック

```bash
# リンターチェック
npm run lint

# コードフォーマットチェック
npm run format

# テスト実行
npm test
```

## 🚀 デプロイ手順

### 1. 本番用CSS生成

デプロイ前に最適化されたCSSを生成：

```bash
npm run build:css:prod
```

### 2. Firebase初期化（初回のみ）

プロジェクトをFirebaseに関連付け：

```bash
firebase init
```

以下を選択：
- **Hosting**: Configure files for Firebase Hosting
- **Existing project**: 既存のFirebaseプロジェクトを選択
- **Public directory**: そのまま Enter（デフォルト設定使用）
- **Configure as single-page app**: N（Noを選択）
- **Automatic builds and deploys**: 任意（GitHub Actions設定する場合はY）

### 3. デプロイ実行

#### 本番デプロイ

```bash
firebase deploy
```

#### ホスティングのみデプロイ

```bash
firebase deploy --only hosting
```

#### 特定のFirebaseサービスのみデプロイ

```bash
# Realtime Database ルールのみ
firebase deploy --only database

# Storage ルールのみ  
firebase deploy --only storage
```

### 4. デプロイ完了確認

デプロイが成功すると以下のURLでアクセス可能：

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project-id/overview
Hosting URL: https://your-project-id.web.app
```

## 🔧 本番環境設定

### 1. カスタムドメイン設定（任意）

Firebase Console > Hosting > ドメインを追加：

1. カスタムドメインを追加
2. DNS設定でAレコードまたはCNAMEレコードを追加
3. SSL証明書の自動発行を確認

### 2. セキュリティ強化

#### 本番用Database Rules

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
    },
    "backup": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
    }
  }
}
```

#### 本番用Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    match /backup/{allPaths=**} {
      allow read, write: if request.auth != null && 
                           exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

### 3. 環境変数管理

本番環境では以下を実装推奨：

```javascript
// 本番用firebase-config.js例
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "fallback_key",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "project.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://project.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "project-id",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "project.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.FIREBASE_APP_ID || "app-id"
};
```

## 🤖 CI/CD自動デプロイ設定

### GitHub Actions設定

`.github/workflows/firebase-hosting.yml`を作成：

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build CSS
      run: npm run build:css:prod
    
    - name: Run tests
      run: npm test
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: your-project-id
```

### GitHub Secrets設定

1. Firebase Console > プロジェクトの設定 > サービスアカウント
2. 新しい秘密鍵の生成 > JSON形式でダウンロード
3. GitHub Repository > Settings > Secrets and variables > Actions
4. `FIREBASE_SERVICE_ACCOUNT`にJSONファイルの内容をペースト

## 🎯 デプロイ戦略

### 段階的デプロイ

1. **開発版デプロイ**: `firebase hosting:channel:deploy preview`
2. **ステージング確認**: プレビューURLで動作確認
3. **本番デプロイ**: `firebase deploy --only hosting`

### ロールバック手順

問題が発生した場合：

```bash
# 前のバージョンに戻す
firebase hosting:rollback

# 特定のバージョンに戻す
firebase hosting:rollback [release-id]
```

## 📊 モニタリング設定

### Firebase Analytics

```javascript
// analytics.js
import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics(app);

// カスタムイベント
logEvent(analytics, 'product_view', {
  product_id: 'ABC123',
  product_category: 'commemorative'
});
```

### Performance Monitoring

```javascript
// performance.js  
import { getPerformance } from "firebase/performance";

const perf = getPerformance(app);
```

### Error Reporting

```javascript
// error-reporting.js
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Firebase Crashlyticsまたは外部サービスに送信
});
```

## 🔍 デプロイ後動作確認

### 自動チェックスクリプト

```bash
#!/bin/bash
# deploy-check.sh

SITE_URL="https://your-project-id.web.app"

echo "Checking site accessibility..."
curl -f -s -o /dev/null "$SITE_URL" && echo "✅ Site is accessible" || echo "❌ Site is not accessible"

echo "Checking admin login page..."
curl -f -s -o /dev/null "$SITE_URL/admin-login.html" && echo "✅ Admin login accessible" || echo "❌ Admin login not accessible"

echo "Checking category pages..."
curl -f -s -o /dev/null "$SITE_URL/category.html" && echo "✅ Category page accessible" || echo "❌ Category page not accessible"

echo "Deploy verification complete!"
```

### 手動確認項目

- [ ] トップページが正常に表示される
- [ ] 商品一覧が表示される
- [ ] 商品詳細ページが表示される
- [ ] カテゴリー分類が動作する
- [ ] 検索機能が動作する
- [ ] 管理画面にアクセスできる
- [ ] 管理者ログインができる
- [ ] 商品の登録・編集・削除ができる
- [ ] 画像アップロードができる
- [ ] モバイル表示が正常である
- [ ] SEO情報が正しく設定されている

## ⚠️ トラブルシューティング

### よくあるデプロイエラー

#### 1. Firebase CLI関連

```bash
# Firebase CLIを最新版に更新
npm update -g firebase-tools

# ログイン状態を確認
firebase login --reauth

# プロジェクト設定を確認
firebase projects:list
firebase use --add
```

#### 2. 権限エラー

```bash
# Firebase プロジェクトの権限確認
firebase auth:list

# サービスアカウント権限の確認
firebase projects:addfirebase [project-id]
```

#### 3. デプロイタイムアウト

```bash
# タイムアウト時間を延長
firebase deploy --timeout 10m

# 分割デプロイ
firebase deploy --only hosting
firebase deploy --only database
firebase deploy --only storage
```

#### 4. キャッシュ問題

```bash
# Firebase キャッシュクリア
firebase hosting:disable
firebase hosting:enable

# ブラウザキャッシュクリア
# Ctrl+Shift+R (Chrome)
# Cmd+Shift+R (Mac)
```

### エラーログの確認

```bash
# Firebase プロジェクトのログ確認
firebase functions:log

# Hosting デプロイログ確認  
firebase hosting:log
```

## 📱 本番運用

### 定期メンテナンス

1. **依存関係更新** (月次)
   ```bash
   npm audit
   npm update
   ```

2. **セキュリティ更新** (週次)
   - Firebase SDKの更新確認
   - セキュリティルールの見直し

3. **バックアップ** (日次)
   - Realtime Database のエクスポート
   - Storage ファイルのバックアップ

### 監視項目

- サイトアクセシビリティ
- API レスポンス時間
- エラー率
- セキュリティログ

## 📞 サポート

デプロイに関する問題が発生した場合：

1. エラーメッセージを記録
2. `firebase debug.log` を確認
3. Firebase Console のログを確認
4. 必要に応じてFirebase サポートに連絡

---

**最終更新**: 2025年7月13日